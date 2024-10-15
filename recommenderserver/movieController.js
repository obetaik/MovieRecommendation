// Import movies model
//Movie = require("./movieModel");


const oracledb = require('oracledb')
const config = {
  user: 'recommender',
  password: '123456',
  connectString: 'localhost:1521/orcl'
}
// Handle index actions
exports.index = async function  (req, res) {
	console.log("Movie index,  findById");
	//console.log("Movie ---,  getMovies(): "+await getMovies());
	let allMovies = await getMovies();
	return await res.json(allMovies);
	//return res.json("[ { ID: '001', TITLE: 'UKWA' } ]");
	
};


async function getMovies(){
//const getMovies = async function(){
	console.log("In getMovies")
	//let connection = await getConnection();
  try {
	connection = await oracledb.getConnection(config)
    const result = await connection.execute(
      'SELECT ID, title from MOVIE',
      [],  // bind value for :id
	  { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    // console.log(result.rows);
	return  result.rows
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
	return "NuLL";
}

// Handle view movie info
exports.viewByUserId = async function (req, res) {
	console.log("Movie viewByUserId: "+req.body.userId);
 
	connection = await oracledb.getConnection(config)
	
	
	
		 console.log(req.body.userId);
		// console.log(req.params.sentimentScore);
		 let selQuery =  "select * from (select JSONOBJECT from  RECOMMENDATION where USER_ID=:userId AND rec_type='SENTIMENT' ORDER by date_recommended desc) where rownum < 6";
		 console.log(selQuery);
		  let rs = await connection.execute(selQuery, [req.body.userId],   { fetchInfo: {"JSONOBJECT": {type: oracledb.STRING } }});
		  let sentJSONS = await getDataFromJSON(rs);
		
		selQuery =  "select * from (select JSONOBJECT from  RECOMMENDATION where USER_ID=:userId AND rec_type='EMOTION' ORDER by date_recommended desc) where rownum < 6";
		  console.log(selQuery);
		rs = await connection.execute(selQuery, [req.body.userId],   { fetchInfo: {"JSONOBJECT": {type: oracledb.STRING } }});
		 
		  let emotionJSONS = await getDataFromJSON(rs);

		  selQuery =  "select * from (select JSONOBJECT from  RECOMMENDATION where USER_ID=:userId AND rec_type='GENRE' ORDER by date_recommended desc) where rownum < 6";
		  console.log(selQuery);
		rs = await connection.execute(selQuery, [req.body.userId],   { fetchInfo: {"JSONOBJECT": {type: oracledb.STRING } }});
		 
		  let genreJSONS = await getDataFromJSON(rs);
		  let output = JSON.parse("[["+sentJSONS+"],["+emotionJSONS+"],["+genreJSONS+"]]");
		  console.log('Final output-:'+output);
		  res.status(201).json(output);
		   
	
};


async function getDataFromJSON(resultSet)
{

	 //console.log(JSON.stringify(rs.rows));
	 let js ='';
	 if (resultSet.rows.length) {
		 let i =0;
		 resultSet.rows.forEach( async function(row) {
		   //	js = await JSON.parse(rs.row);
	   //		console.log('ID is: ' + js.imdbID);
	   //console.log('Title is: ' + rs.rows[i]);
	   js = js + resultSet.rows[i]+",";
	   i=i+1;
		   });
		   var temp = js.slice(0, -1);// remove the last xter
		   console.log(temp);
		   js = temp;
	   //js = await JSON.parse(rs.rows[0]);
	   //console.log('ID is: ' + js.imdbID);
	   //console.log('Title is: ' + js.Title);
	   //console.log('City is: ' + js.address.city);
	 } else {
	   console.log('No rows fetched');
	 }
	 let output = JSON.parse("["+js+"]");
	//return output
	return js;
}
let createSql = 'insert into movie (id, title,year,rated, released, runtime, genre, director, writer, actors, Plot, Language, Country, Awards, Poster, imdbRating, imdbVotes, movieType, jsonObject ) values (:id, :title,:Year,:Rated, :released, :runtime, :genre, :director, :writer, :actors, :Plot, :Language, :Country, :Awards, :Poster, :imdbRating, :imdbVotes, :movieType, :jsonObject) returning id  into :id';
  
  console.log(createSql);

  let sentimentSql = 'insert into sentiment (movie_id, google,naive_bayes,decision_tree, vader, nrclex, joy, surprise, sadness, anger, fear, disgust ) values (:movie_id, :google,:naive_bayes,:decision_tree, :vader, :nrclex, :joy, :surprise, :sadness, :anger, :fear, :disgust) returning movie_id  into :movie_id';
  
  console.log(sentimentSql);
  function getNum(val) {
	val = +val || 0
	return val;
 }

 async function getMovieSentiment(req) {
	console.log("+++1++++:"+req.body.Plot)
	 plot=req.body.Plot;
	 emotions= await getNRCLexSentiment(req.body.Plot);
	 joy=0.0;
	  surprise=0.0;
	  sadness=0.0
	  anger=0.0
	  fear=0.0
	  disgust=0.0
	  if(emotions["joy"]) joy= emotions.joy;
	  if(emotions['surprise']) surprise= emotions.surprise;
	  if(emotions['sadness']) sadness= emotions.sadness;
	  if(emotions['anger']) anger= emotions.anger;
	  if(emotions['fear']) fear= emotions.fear;
	  if(emotions['disgust']) disgust= emotions.disgust;
	 nrclex_neg=0.0;
	 nrclex_pos=0.0;
	 nrclex=0.0;
	 if(emotions.hasOwnProperty('positive')) nrclex_pos= emotions.positive;
	 if(emotions.hasOwnProperty('negative')) nrclex_neg = emotions.negative
	 if(nrclex_pos > nrclex_neg)
	 {
		 nrclex="Positive";
	 }else{
		 nrclex="Negative";
	 }
	 console.log(" nrclex  value: "+nrclex);

	const sentimentObject= {
	  movie_id: req.body.imdbID,
	  
	  naive_bayes: await getNaiveBayesSentiment(req.body.Plot),
	  decision_tree: await getDecisionTreeSentiment(req.body.Plot),
	  vader: await getVaderSentiment(req.body.Plot),
	 // emotions: await getNRCLexSentiment(req.body.Plot),
	  google: await getGoogleSentiment(req.body.Plot),
	  //nrclex: 'POSITIVE',
	  nrclex:nrclex,
	  joy:joy,
	  surprise:surprise,
	  sadness:sadness,
	  anger:anger,
	  fear:fear,
	  disgust:disgust,
	
	};
	console.log("+++++2++:"+await req.body.Plot)
	return sentimentObject;
  }
async function getMovieFromRec(req) {
	const movie_= {
	  id: req.body.imdbID,
	  Title: req.body.Title,
	 // SentimentScore: parseFloat(await getSentimentScore(req.body.Plot)),
	  Year : parseInt(req.body.Year),
	 // Rated: parseInt(req.body.Rated),
	 Rated: getNum(req.body.Rated),
	  Released: req.body.Released,
	  Runtime: req.body.Runtime,
	  Genre: req.body.Genre,
	  Director: req.body.Director,
	  Writer: req.body.Writer,
	  Actors: req.body.Actors,
	  Plot : req.body.Plot,
	  Language: req.body.Language,
	  Country : req.body.Country,
	  Awards : req.body.Awards,
	  Poster : req.body.Poster,
	  imdbRating : getNum(req.body.imdbRating),
	  imdbVotes : getNum(req.body.imdbVotes),
	  movieType : req.body.Type,
	  jsonObject : JSON.stringify(req.body),
	};

	return movie_;
  }
  
  
  exports.new = async function (req, res, next) {
	console.log(req.body);
  console.log("Inside Post:"+req.body.imdbID);
  console.log("Inside Post:"+req.body.Title);
  console.log("PLOT:"+req.body.Plot);
  console.log("new: User Id:"+req.query.userId);
 // userId="test001@gmail.com";
  userId=req.query.userId;
	try {
		connection = await oracledb.getConnection(config);
		const rs = await connection.execute(
			`SELECT ID FROM movie where ID = :ID`,
			[req.body.imdbID],  // bind value for :id
			);
		  
		  //console.log(JSON.stringify(rs.rows));
		  let isExist = false;
		  if (rs.rows.length) {
			  console.log("Record already exist");
			  isExist= true;
		  }
		


		  let mv = '';
	 // let movie = await getMovieFromRec(req);
	//if(!isExist){
		 mv = await create(userId, await getMovieFromRec(req), await getMovieSentiment(req), isExist);
	//}
	 // let mv = await create( await getMovieFromRec(req));
  
	  res.status(201).json(mv);
	} catch (err) {
	  next(err);
	}
  }
  //module.exports.new = new;
  
   
  
  
 async function saveRecommendation(sqlQuery, imdbId, userId, obj,recType)
 {
	 //	(jsonobject,  movie_id, user_id, rec_type) VALUES (:1, :2, :3, :4)';

	let binds = [obj,imdbId, userId,recType];
	result = await connection.execute(sqlQuery, binds ,{autoCommit: true});
	console.log("Saving recommendation")
 }

   async function create(userId, mov, _sentimentObj, isExist) {
	   console.log(":::"+mov.id+"  sObj id "+_sentimentObj.movie_id)
	   console.log(":naive bayes::"+_sentimentObj.naive_bayes+"  dt "+_sentimentObj.decision_tree)
	   console.log(":vader::"+_sentimentObj.vader+"  nrclex "+_sentimentObj.nrclex)
	   console.log(":sadness::"+_sentimentObj.sadness+"  google "+_sentimentObj.google)
	   console.log("::joy:"+_sentimentObj.joy+"  anger "+_sentimentObj.anger +"  fear "+_sentimentObj.fear)
	   console.log("::disgust:"+_sentimentObj.disgust+"  surprise "+_sentimentObj.surprise)
	const movie = Object.assign({}, mov);
	const sentimentObj = Object.assign({}, _sentimentObj);
	//console.log(mov);
	//console.log(" B4 Delete 4 userId:"+ userId);
 	connection = await oracledb.getConnection(config)
	 
	//Ensure that the 5 sentiments match for the recommendation
	let selSentimentQuery ='SELECT * FROM  (select m.id, s.movie_id,s.google,s.naive_bayes,s.decision_tree,s.vader,s.nrclex, m.JSONOBJECT '
	selSentimentQuery = selSentimentQuery +'	from  movie m, sentiment s where  m.ID != :id and s.movie_id=m.id '
	selSentimentQuery = selSentimentQuery +'		 and (s.google,s.naive_bayes,s.decision_tree,s.vader,s.nrclex) = (select ss.google,ss.naive_bayes,ss.decision_tree, '
	selSentimentQuery = selSentimentQuery +'		ss.vader,ss.nrclex from sentiment ss where ss.movie_id=:id)'
	//selSentimentQuery = selSentimentQuery +'		AND m.id NOT IN (select rc.movie_id from recommendation rc where rc.user_id=:userId) '  
	selSentimentQuery = selSentimentQuery +'		order by DBMS_RANDOM.VALUE) where rownum <  6';
 

	console.log(" selSentimentQuery query:"+ selSentimentQuery);
	//let result = await connection.execute(	selQuery,	[mov.id, mov.id, userId],  
	let result = await connection.execute(	selSentimentQuery,	[mov.id, mov.id], 
	  async function(err, resultSentiment) {
		  if (err) {
			  console.log( "errrr")
			console.error(err.message);
			return  null;
		  }
		 
		   resultSentiment.rows.forEach( async function(row2) {
			console.log(" .::.. "+await row2[7]);
			const selSentimentQuery = 'INSERT INTO RECOMMENDATION (jsonobject,  movie_id, user_id, rec_type) VALUES (:1, :2, :3, :4)';
			 await saveRecommendation(selSentimentQuery, mov.id,userId, row2[7],'SENTIMENT')
			
		  });
	 
	   });



	   
//===============================================================
//----------INSERT FOR EMOTIONS ---------------------------

	//Ensure that the 6 EMOTIONS (JOY,SADNESS, FEAR ETC) match for the recommendation
	let selEmotionQuery ='SELECT * FROM  (select m.id, s.movie_id,s.JOY,s.SURPRISE,s.SADNESS,s.ANGER,s.FEAR, s.DISGUST, m.JSONOBJECT '
	selEmotionQuery = selEmotionQuery +'	from  movie m, sentiment s where  m.ID != :id and s.movie_id=m.id '
	selEmotionQuery = selEmotionQuery +'		 and (s.JOY,s.SURPRISE,s.SADNESS,s.ANGER,s.FEAR, s.DISGUST) = (select ss.JOY,ss.SURPRISE,ss.SADNESS, '
	selEmotionQuery = selEmotionQuery +'		ss.ANGER,ss.FEAR, ss.DISGUST from sentiment ss where ss.movie_id=:id)'
	//selEmotionQuery = selEmotionQuery +'		AND m.id NOT IN (select rc.movie_id from recommendation rc where rc.user_id=:userId) '  
	selEmotionQuery = selEmotionQuery +'		order by DBMS_RANDOM.VALUE) where rownum <  6';


console.log(" selEmotionQuery query:"+ selEmotionQuery);
//let result = await connection.execute(	selQuery,	[mov.id, mov.id, userId],  
 let resultEmotion = await connection.execute(	selEmotionQuery,	[mov.id, mov.id], 
  async function(err, resultEmotion) {
	  if (err) {
		  console.log( "err ....")
		console.error(err.message);
		return  null;
	  }
	   resultEmotion.rows.forEach( async function(row) {
		console.log(" ... "+await row[8]);
		const selEmotionQuery = 'INSERT INTO RECOMMENDATION (jsonobject,  movie_id, user_id, rec_type) VALUES (:1, :2, :3, :4)';
		 await saveRecommendation(selEmotionQuery, mov.id,userId, row[8],'EMOTION')
	  });
	});
//===============================================================
//===============================================================
//----------INSERT FOR EMOTIONS ---------------------------

	//Ensure that the 6 EMOTIONS (JOY,SADNESS, FEAR ETC) match for the recommendation
	let selGenreQuery ='SELECT * FROM  (select m.id, m.title, m.genre, m.JSONOBJECT from  MOVIE m '
	selGenreQuery = selGenreQuery +'  where  m.ID !=:id and m.genre in 	(select genre from MOVIE where ID = :id)  '
	 selGenreQuery = selGenreQuery +'  order by DBMS_RANDOM.VALUE) where rownum <  6 ';
	 

console.log(" selGenreQuery query:"+ selGenreQuery);
//let result = await connection.execute(	selQuery,	[mov.id, mov.id, userId],  
 let resultGenre = await connection.execute(	selGenreQuery,	[mov.id, mov.id], 
  async function(err, resultGenre) {
	  if (err) {
		  console.log( "err ....")
		console.error(err.message);
		return  null;
	  }
	   resultGenre.rows.forEach( async function(row) {
		console.log(" .selGenreQuery.. "+await row[3]);
		const selGenreQuery = 'INSERT INTO RECOMMENDATION (jsonobject,  movie_id, user_id, rec_type) VALUES (:1, :2, :3, :4)';
		 await saveRecommendation(selGenreQuery, mov.id,userId, row[3],'GENRE')
	  });
	});
//===============================================================

	  // let createMovie_bk = 'insert into movie_bk (id, title,year,rated, released, runtime, genre, director, writer, actors, Plot, Language, Country, Awards, Poster, imdbRating, imdbVotes, movieType, jsonObject ) values (:id, :title,:Year,:Rated, :released, :runtime, :genre, :director, :writer, :actors, :Plot, :Language, :Country, :Awards, :Poster, :imdbRating, :imdbVotes, :movieType, :jsonObject) returning id  into :id';

	 //  const res = await connection.execute(createMovie_bk, movie,{autoCommit: true});
	   if(!isExist)
	   {
	   const res = await connection.execute(createSql, movie,{autoCommit: true});
	   const res_sent = await connection.execute(sentimentSql, sentimentObj,{autoCommit: true});
	   }
/*
	if (connection) {
		try {
		  await connection.close();
		  console.log(" database closed");
		} catch(err) {
		  console.log("closing the database connection: ", err);
		}
	  }
	*/
  
	return movie;
  }
    
 
  let fetch = require('node-fetch');
const res = require('express/lib/response');
async function sendRequestToModel(url, plot)
{

const response = await fetch(url, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify ({
		"text":'"'+plot+'"',
  }),
});
  let  resp=  await response.json();
  console.log( "::::---::"+await resp);
 return await resp;
}
const myModelURL = "http://192.168.0.15:5000";
//===================================
//--------NAIVE BAYES API CALL -----
//===================================
async function getNaiveBayesSentiment(text) {
	//let text = await req.body.Plot;
	console.log("Naive Bayes");
	//return "POSITIVE";
	resp = await sendRequestToModel(myModelURL+"/nb", text);
	console.log("Back--:"+await resp.neg_pos);
	return await resp.neg_pos;
}

//===================================
//--------Decision Tree API CALL -----
//===================================
async function getDecisionTreeSentiment(text) {
	console.log("Decision Tree");
	resp = await sendRequestToModel(myModelURL+"/dt", text);
	console.log("Back--:"+await resp.neg_pos);
	return await resp.neg_pos;

}

//===================================
//--------Vader API CALL -----
//===================================
async function getVaderSentiment(text) {
	console.log("VADER");
	resp = await sendRequestToModel(myModelURL+"/vader", text);
	console.log("Back--:"+await resp.neg_pos);
	return await resp.neg_pos;
}

//===================================
//--------NCRLex API CALL -----
//===================================
async function getNRCLexSentiment(text) {
	console.log("getNRCLexSentiment");
	resp = await sendRequestToModel(myModelURL+"/getEmotions", text);
	console.log("Back--:"+await resp);
	return await resp;
}
//========================================================
//-----------GOOGLE SENTIMENT ANALYSIS ------------------------
//==========================================================
async function getGoogleSentiment(text) {
console.log(await text);
	const language = require('@google-cloud/language');
	   require('dotenv').config();
   
    //const projectId = 'bcusentimentapi'
    //const keyFilename = 'c:/bcu/projectmsc/google_cred_key.json'
   //const storage = new Storage({projectId, keyFilename})
     // Creates a client
   
   
   
	const client = new language.LanguageServiceClient();
   
     // Prepares a document, representing the provided text
	const document = {
	content: text,
	type: 'PLAIN_TEXT',
	};
   
     // Detects the sentiment
	const [result] = await client.analyzeSentiment({document});
   
	const sentiment = result.documentSentiment;
	//console.log('Document sentiment:');
	console.log(`  Score: ${sentiment.score}`);
   
	let finalScore = await roundNum(sentiment.score, 2); // round to 2 decimal places
	console.log( finalScore );   
   if(finalScore > 0)
   {
	   return "Positive"
   } else{
	   return "Negative"
   }
   //return finalScore;
     
   }
   
   async function roundNum(num, decimalPlaces = 0) {
	   var p = Math.pow(10, decimalPlaces);
	   return Math.round(num * p) / p;
   }
   //=======================++++++++++++++++++++++++++++++++++============================