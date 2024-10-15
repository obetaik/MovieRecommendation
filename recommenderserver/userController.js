// Import user model
User = require("./userModel");

const oracledb = require('oracledb')
const config = {
 // user: 'recommender',
 // password: '123456',
  connectString: 'localhost:1521/orcl'
}
// Handle index actions
exports.index = async function (req, res) {
	console.log("USER Index, Listing all users");
	User.get(function (err, user) {
		if (err) {
			return res.json({
				status: "error",
				message: err,
			});
		}
		console.log("=========================");
		console.log(user);
		console.log("-----------------------");
		return res.json(user);
	});
};

// Handle user creation request
exports.new = function (req, res) {
	console.log("USER  NEW,  user creation");
	var user = new User();
	let today = new Date();
	user._id = req.body.userId;
	user.userId = req.body.userId;
	user.pin = req.body.pin;
	user.name = req.body.name;
	user.dateCreated = today;

	// save the user and check for errors
	user.save(function (err) {
		if (err) return res.json(err);
		return res.json({
			message: "User created..! :" + req.body.userId,
			//data: user
		});
	});
};

// Handle view user info
exports.login = async function (req, res) {
	console.log("USER View, Listing all user, findById");
	//  var query = { userId: "tony1" };

	let userId = req.body.userId;
	console.log("=================="+userId);
	try {
		connection = await oracledb.getConnection(config)
		const result = await connection.execute(
		  'SELECT user_id, password,firstname, role FROM USER_TABLE WHERE USER_ID=trim(:user_id) and password=trim(:password)',
		  //[req.body.userId],  // bind value for :id
		  [req.body.userId,req.body.password],
		  { outFormat: oracledb.OUT_FORMAT_OBJECT }
		);
		 console.log(result.rows);
		 let output = JSON.stringify(result.rows);
		  console.log(output);
		  if(output == '[]')
		  {
			  console.log(" No user");
			  result.rows =JSON.parse('[{"FIRSTNAME":"","ROLE":""}]');
		  }
		//return  result.rows
		res.status(201).json(result.rows);
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
};

//
// Handle update user pin change request
exports.update = function (req, res) {
	User.findById(req.params._id, function (err, user) {
		if (err) return res.send(err);
		console.log("Changing pin for " + req.params._id);
		user._id = req.body.userId ? req.body.userId : user.userId;
		user.userId = req.body.userId ? req.body.userId : user.userId;
		user.pin = req.body.pin;
		user.name = user.name;

		// save the user and check for errors
		user.save(function (err) {
			if (err) return res.json(err);
			return res.json({
				message: "User Info updated",
				data: user,
			});
		});
	});
};
