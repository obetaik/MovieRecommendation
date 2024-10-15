/* eslint-disable prettier/prettier */
// App.js: Entry point for the MovieExample2 app
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This component is the 'entry point' of the application,
//        It shows how to setup navigation, to allow for an elegant multi screen UI
//        Please read comments carefully to understand what this code does

import React, {Component} from 'react';
// these are the navigation packages - make sure you 'npm install' them first
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// create references to all the screens of the app
import HomeScreen from './Components/HomeScreen';
import InstructionsScreen from './Components/InstructionsScreen';
import MovieSearchScreen from './Components/MovieSearchScreen';
import MovieDetailsScreen from './Components/MovieDetailsScreen';
import FavouriteMoviesScreen from './Components/FavouriteMoviesScreen';
import RecommendationScreen from './Components/RecommendationScreen';

// we are going to use the 'stack' navigator component
const Stack = createStackNavigator();

export default class App extends Component {
    render()
    {
        // the 'NavigationContainer' component is used to hold the (stack) navigator component
        // ... which creates components for each of the screens
        return(
            <NavigationContainer>
                <Stack.Navigator initialRouteName="HomeScreen">
                    <Stack.Screen name="HomeScreen" component={HomeScreen}/>
                    <Stack.Screen name="InstructionsScreen" component={InstructionsScreen}/>
                    <Stack.Screen name="MovieSearchScreen" component={MovieSearchScreen}/>
                    <Stack.Screen name="MovieDetailsScreen" component={MovieDetailsScreen}/>
                    <Stack.Screen name="FavouriteMoviesScreen" component={FavouriteMoviesScreen}/>
                    <Stack.Screen name="RecommendationScreen" component={RecommendationScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}

