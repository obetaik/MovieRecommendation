/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// MovieDetailsScreen.js: Additional Screen for Version 2 of MovieExample
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This component acts as a subsidiary screen of the search screen,
//        As before, It reads data from a second (detailed) call to the  OMDB web service,
//        Please read comments carefully to understand what this code does

// import the basic React component and library
import React, {Component} from 'react';
// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Button, Text, TouchableOpacity, Image} from 'react-native';

export default class MovieDetailsScreen extends Component
{
    // you can use the Component's constructor for setting up props and states
    constructor(props)
    {
        // must call the base class (Component's) constructor first
        super(props);
        // set up state variables...
        this.state = {
            // details of the (single) selected movie
            movieDetails: {},
            sentimentscore: 0,
            // 'isLoading' is used as a flag to indicate if data has been returned from service yet
            isLoading: true,
            // 'searchTerm' is initially set to a arbitrary value so we can at least see some data at start
            searchTerm: '',
        };

    }

    // componentDidMount is one of the 'lifecycle' methods of React Native -
    // ... invoked automatically when the App component has first been rendered
    // ... so can be used for initialisation stuff
    componentDidMount()
    {
        // when this screen is loaded, we receive 'passedMovieTitle' parameter through the navigation route prop
        const {passedMovieTitle} = this.props.route.params;
        // used the movie title that's passed in to search for it's details
        this.getMovieDetails(passedMovieTitle);
    }

    // 'getMovieList' is our 'helper' function that fetches and parses the details of the movie,
    // it is essentially the same as the 'getMovieList()' method in the search screen
     async getMovieDetails (movieTitle)  {
        // this is my key - please sign up to your web service if you need a key
        const key = '72453f3c';
        // create (concatenate) the URI for calling our service - based on the passed movie title
        const movieDetailsURL = 'http://www.omdbapi.com/?t=' + movieTitle + '&apikey=' + key;

        // call the 'fetch()' method of the fetch API to make a RESTful GET call to the OMDB api
        await fetch(movieDetailsURL)
            // as this requires synchronisation - promises are sued to make sure data is returned before parsing to JSON format
            .then((response) => response.json())
            // ... and only then can the data required (array of movie objects) be extracted from the JSON
            .then((json) =>
            {
                // this time the while of the returned JSON object is needed
                this.setState({movieDetails: json});
                this.setState({sentimentscore: json.sentimentscore});

                // Call the server to save to db along with sentiment
                console.log("RES:"+json.sentimentscore);
               // console.log(JSON.stringify(json));
                this.saveMovieDetails( JSON.stringify(json));
                //this.saveMovieDetails( json);
            })
            // deal with any errors...
            .catch((error) => console.error(error))
    }

  async saveMovieDetails(movieDetails) {
       //
       console.log("saving...");
       // const response = await fetch('http://10.33.200.27:8080/api/movies/', {// Edurom
        //const response = await fetch('http://10.250.171.57:8080/api/movies/', { // BCU OPEN WIFI
        const response = await fetch('http://192.168.0.20:8080/api/movies/', { //HOME

            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              'Last-Modified': (new Date()).toUTCString()
            },
           /* body: JSON.stringify({
            id:  '"'+movieDetails.id+'"',
              title: '"'+movieDetails.title+'"',
              plot:  '"'+movieDetails.plot+'"',
            })*/
            body: movieDetails
            
          });
          console.log("::::::::::::::::::::::::::::::::::::::::" );
          const msg = await response.json();
          //console.log("rtn"  +msg);
          this.setState({sentimentscore: 999})
        
    }
    render() {
       // const {navigate} = this.props.navigation;
        const {movieDetails, sentimentscore} = this.state;

        return (
            <View>
            <View style={styles.itemStyle}>
                <Image
                    style={styles.imageStyle}
                    source={{
                        uri: movieDetails.Poster,
                    }}
                />
                <Text style={styles.textStyle}>{movieDetails.Plot}</Text>
            </View>
            <View style={styles.itemStyle}>
                <Button
                    style={styles.buttonStyle}
                    title="View Recommended Movies>>"
                    onPress={() => this.props.navigation.navigate("RecommendationScreen",  { sentimentscore:this.state.sentimentscore})}
                />
            </View>

            </View>
        );
    }
}

// here we define the styles used by our component ...
// ...through the 'create()' method of the StyleSheet component
const styles = StyleSheet.create
({
    itemStyle:
        {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'lightgreen',
            flexDirection: 'column',
            padding: 10,
            margin: 10,
        },
    textStyle:
        {
            fontSize: 20,
            textAlign: 'justify',
            margin: 10,
        },
    imageStyle:
        {
            width: 300,
            height: 250,
            resizeMode: 'stretch',
        },
});
