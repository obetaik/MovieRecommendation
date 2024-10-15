// FavouriteMoviesScreen.js: Additional Screen for Version 2 of MovieExample
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This screen is used to display all the 'favourite' (saved) movies
//        It illustrates how AsyncStorage can be implemented for 3 purposes:
//          - to add a movie to local storage (triggered from a 'longpress' on the SearchScreen)
//          - to list the newly added movie along with all the previously saved ones
//          - to allow the user to delete a movie by a 'longpress' on it

// import the basic React component and library
import React, {Component} from 'react';
// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Button, Text, TextInput, FlatList, Alert, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
// import our own (custom) component (see 'ListItem.js' in this folder)
import ListItem from './ListItem';

export default class FavouriteMoviesScreen extends Component
{
    // you can use the Component's constructor for setting up props and states
    constructor(props)
    {
        // must call the base class (Component's) constructor first
        super(props);
        // set up state variables...
        this.state = {
            // 'movieList' will hold the array of saved movies returned from AsyncStorage
            movieList: [],
            // 'isLoading' is used as a flag to indicate if data has been returned from AsyncStorage yet
            isLoading: true,
        };
    }

    // componentDidMount is one of the 'lifecycle' methods of React Native -
    // ... invoked automatically when the App component has first been rendered
    // ... so can be used for initialisation stuff
    // In this case we make it 'async' as it calls async functions that call AsyncStorage methods
    async componentDidMount()
    {
        // if we are coming from thr SearchScreen, we will have an Movie that needs saving first
        if (this.props.route.params) {
            // on first loading thids page, we save the incoming movie
            // then retrieve and display all saved movies
            const {passedMovie} = this.props.route.params;
            await this.saveToFavourites(passedMovie);
        }
        // call the method that sets the 'movieList' array with all the movies save on-device
        await this.getMovieListFromStorage();
    }

    // 'getMovieListFromStorage' is our 'helper' function that reads and extracts ...
    // the array of (Favourite) movies from AsyncStorage, and sets it to our 'movieList' state variable
    // it is called automatically when this page is loaded (through the 'componentDidMount' component lifecycle method)
    async getMovieListFromStorage()
    {
        // use a temporary local variable for holding the movies retrieved from AsyncStorage
        let movieArray = [];
        try
        {
            // reading bulk data from AsyncStorage is a 2 step process...
            // first we need to read in all the keys (only) from AsyncStorage, using the 'getAllKeys()' method
            const allKeys = await AsyncStorage.getAllKeys();
            // may need to remove first element of key list - if it is used by the Reactotron debugger tool
            allKeys.shift();
            // then we call the 'multiGet()' with the retrieved keys...
            await AsyncStorage.
                multiGet(allKeys, (err, allMovieRecords) =>
                {
                    // ... providing a callback to then go through the returned results
                    allMovieRecords.map((result, i, aMovieRecord) =>
                    {
                        // get at each store's value - indexed by [i][1] - so you can work with it
                        // as we 'stringified' each object before storage, we now need to reverse that
                        let value = aMovieRecord[i][1];
                        // and eventually append it to our movieArray
                        movieArray.push(JSON.parse(value));
                    });
                });
        }
        catch (error)
        {
            console.log(error, 'error')
        }
        finally
        {
            // finally, set the complete retrieved array to the state variable - movieList
            this.setState({movieList: movieArray});
            // ... and the flag to say that the array is fully loaded for display
            this.setState({isLoading: false});
        }
    }

    // this is our save method - that takes a movie object,
    // ... to be used as to extract the key and provide the record to be saved
    async saveToFavourites(movieObject)
    {
        try
        {
            // we set the key of the item to it's Title,
            // and a 'stringified' version of the whole movie (JSON) object as the value
            await AsyncStorage.setItem(movieObject.Title, JSON.stringify(movieObject));
            // notify the user that the item has been successfully saved
            alert(movieObject.Title + ' saved!');
        } catch (e)
        {
            alert(e.message);
        }
    }

    // this is our delete method - that takes a movie title, to be used as the key to find the record to delete
    // it is invoked by a 'longpress' action on the list of favourite items displayed on this screen
    deleteFromFavourites(movieTitle) {
        try
        {
            // we set the key of the item -  it's Title - to delete it
            AsyncStorage.removeItem(movieTitle);
            return true;
        }
        catch(exception) {
            return false;
        }
        finally
        {
            // reload movieList to force a re-render
            this.getMovieListFromStorage();
        }
    }


    // the render method is called (frequently) by React Native to maintain the UI
    // ... it will display the FlatList based on the custom ListItem component
    render() {
        // we may need a reference to the 'navigation' prop passed in
        const { navigation } = this.props;
        // and also create local constants for the 2 state variables
        const { movieList, isLoading } = this.state;
        // an empty movie object is supplied in case we get no data back from our web service
        // ... it's used by the FlatList component, in the 'ListEmptyComponent' prop
        const emptyMovieObject =
            {
                "Title": "No movies SAVED in AsyncStorage Yet!",
                "Poster": "https://tse1.mm.bing.net/th?id=OIP.xcUe39T78W7zZEZx4Vun8AHaE7&pid=Api&P=0&w=248&h=166"
            }
        return (
            <View style={{ flex: 1}}>
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={movieList}
                        keyExtractor={item => item.imdbID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onLongPress={()=>{this.deleteFromFavourites(item.Title)}}
                            >
                                <ListItem theMovie={item} itemStyle={'savedItemStyle'}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent =  {<ListItem theMovie={emptyMovieObject} itemStyle={'emptyItemStyle'}/>}
                    />
                )}
            </View>
        );
    }
};

