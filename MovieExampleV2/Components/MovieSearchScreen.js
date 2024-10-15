// MovieSearchScreen.js: Core Additional Screen for Version 2 of MovieExample
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This component acts as the Core screen of the improved Movie Example, and adds navigation to a details page
//        It shows how items in a list view can act as 'buttons' and how to pass data when navigating between screens
//        Also, as before, It reads data from the OMDB web service, based on a search term entered by the user
//        Please read comments carefully to understand what this code does

// import the basic React component and library
import React, {Component} from 'react';
// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Button, Text, TextInput, FlatList, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import our own (custom) component (see 'ListItem.js' in this folder)
import ListItem from './ListItem';

// App.js usually acts as the entry-point for your react-native app
export default class MovieSearchScreen extends Component{
    // you can use the Component's constructor for setting up props and states
    constructor(props) {
        // must call the base class (Component's) constructor first
        super(props);
        // set up state variables...
        this.state = {
            // 'movieData' will hold the array of movies returned from our web service
            movieList: [],
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
        // on first loading page, display movies for the default searchTerm - e.g. Batman (see constructor)
        this.getMovieList();
    }

    // 'getMovieList' is our 'helper' function that fetches, parses and extracts ...
    // the array of movies from the OMDB web service, and sets it to our 'movieData' state variable
    getMovieList() {
        // this is my key - please sign up to your web service if you need a key
        const key = '72453f3c';
        let movieSearchURL = '';

        // create (concatenate) the URI for calling our service - based on the 'searchTerm' state variable
        movieSearchURL = 'http://www.omdbapi.com/?s=' + this.state.searchTerm + '&apikey=' + key;

            // call the 'fetch()' method of the fetch API to make a RESTful GET call to the OMDB api
        fetch (movieSearchURL)
            // as this requires synchronisation - promises are sued to make sure data is returned before parsing to JSON format
            .then((response) => response.json())
            // ... and only then can the data required (array of movie objects) be extracted from the JSON
            .then((json) => {
                // what you look for inside the returned data depends on structure of the JSON ...
                // ...being returned by your web service (mine has an array of movie objects inside a 'Search' key)
                this.setState({movieList: json.Search});
            })
            // deal with any errors...
            .catch((error) => console.error(error))
            .finally(() => {
                // and when all is done, set the 'isLoading' flag down - so data can be displayed by render method
                this.setState({ isLoading: false });
            });
    }

    // the render method is called (frequently) by React Native to maintain the UI
    // ... it will display the FlatList based on the custom ListItem component
    render() {
        const { navigation } = this.props;
        const { movieList, isLoading, searchTerm } = this.state;
        // an empty movie object is supplied in case we get no data back from our web service
        // ... it's used by the FlatList component, in the 'ListEmptyComponent' prop
        const emptyMovieObject =
            {
                "Title": "No movies found matching your search term!",
                "Poster": "https://tse1.mm.bing.net/th?id=OIP.xcUe39T78W7zZEZx4Vun8AHaE7&pid=Api&P=0&w=248&h=166"
            }
        return (
            <View style={{ flex: 1}}>
                <TextInput
                    style={{height: 40, borderColor: 'black', borderWidth: 5}}
                    placeholder='Enter a Keyword to find Movies ...'
                    // onChangeText is used to set up the searchTerm state
                    onChangeText={(text)=>this.setState({searchTerm:text})}
                    // onSubmitEditing is used when the Enter key is pressed to submit
                    onSubmitEditing={()=>this.getMovieList()}
                    value = {searchTerm}
                />
                <Button
                    title='Search for Movies'
                    // the 'Search for Movies' button fires off our getMovieData method -
                    //... passing it the search term updated by the TextInput
                    onPress={()=>this.getMovieList()}
                />
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={movieList}
                        keyExtractor={item => item.imdbID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                'MovieDetailsScreen',
                                { passedMovieTitle:item.Title}
                                )}
                                onLongPress={()=> navigation.navigate(
                                    'FavouriteMoviesScreen',
                                    { passedMovie:item }
                                )}
                            >
                                <ListItem theMovie={item} itemStyle={'normalItemStyle'}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent =  {<ListItem theMovie = {emptyMovieObject} itemStyle={'emptyItemStyle'} />}
                    />
                )}
            </View>
        );
    }
};

