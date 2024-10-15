/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Button, Text, FlatList, TouchableOpacity, Image} from 'react-native';

import RecommendationList from './RecommendationList';

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
            recommendedMovieList: [],
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
        this.getRecommendedMovieList();
    }
 
   
    async getRecommendedMovieList() {
console.log(this.state.sentimentscore);
        const requestOptions = {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              'Last-Modified': (new Date()).toUTCString(),
            },
            body: JSON.stringify({
                sentimentscore: 0.99,
                })
        };
        const response =await fetch('http://192.168.0.20:8080/api/movies/recommendation',requestOptions)
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const json = isJson && await response.json();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (json && json.Title) || response.status;
                return Promise.reject(error);
            }

            this.setState({recommendedMovieList: json});
          //console.log(json);
        })
        .catch(error => {
            this.setState({ errorMessage: error.toString() });
            console.error('There was an error!', error);
        })
        .finally(() => {
            // and when all is done, set the 'isLoading' flag down - so data can be displayed by render method
            this.setState({ isLoading: false });
        });
         
    // const response = await fetch('http://10.33.200.27:8080/api/movies/'+'USER_EMAIL') // Edurom
   // const response = await fetch('http://10.250.171.57:8080/api/movies/'+'USER_EMAIL') // BCU OPEN WIFI
   //const response = await fetch('http://192.168.0.20:8080/api/movies/'+'5') // Home
        // as this requires synchronisation - promises are sued to make sure data is returned before parsing to JSON format
     
    }

    render() {
        const { navigation } = this.props;
        const { recommendedMovieList, isLoading, searchTerm } = this.state;
        // an empty movie object is supplied in case we get no data back from our web service
        // ... it's used by the FlatList component, in the 'ListEmptyComponent' prop
        const emptyMovieObject =
            {
                "Title": "No movies found matching your search term!",
                "Poster": "https://tse1.mm.bing.net/th?id=OIP.xcUe39T78W7zZEZx4Vun8AHaE7&pid=Api&P=0&w=248&h=166"
            }
        return (
            <View style={{ flex: 1}}>
                
                {isLoading ? <ActivityIndicator/> : (
                    <FlatList
                        data={this.state.recommendedMovieList}
                        keyExtractor={item => item.ID}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => navigation.navigate(
                                'MovieDetailsScreen',
                                { passedMovieTitle:item.ID}
                                )}
                                onLongPress={()=> navigation.navigate(
                                    'FavouriteMoviesScreen',
                                    { passedMovie:item }
                                )}
                            >
                                <RecommendationList theRecMovie={item} itemStyle={'normalItemStyle'} sentimentscore={navigation.sentimentscore}/>
                            </TouchableOpacity>)}
                        ListEmptyComponent =  {<RecommendationList theRecMovie = {emptyMovieObject} itemStyle={'emptyItemStyle'} />}
                    />
                )}
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
        normalItemStyle:
        {
            backgroundColor: 'lightgreen',
            flexDirection: 'row',
            padding: 10,
            margin: 10,
        },
    emptyItemStyle:
        {
            backgroundColor: 'pink',
            flexDirection: 'row',
            padding: 10,
            margin: 10,
        },
    savedItemStyle:
        {
            backgroundColor: 'lightblue',
            flexDirection: 'row',
            padding: 10,
            margin: 10,
        },
});
