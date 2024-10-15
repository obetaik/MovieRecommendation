// InstructionsScreen.js: Additional screen for Version 2 of MovieExample
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This component acts as the Instructions screen of the improved Movie Example

// import the basic React component and library
import React, {Component} from 'react';
// import react-native specific components
import {ActivityIndicator, StyleSheet, View, Button, Text, TouchableOpacity, Image} from 'react-native';

export default class InstructionsScreen extends Component
{
    render() {
        const MovieImage = require('../Resources/Movies.jpg');
        return (
            <View style={styles.itemStyle}>
                <Image
                    style={styles.imageStyle}
                    source={MovieImage}
                />
                <Text style={styles.textStyle}>
                    Instructions:
                    {'\n'}
                    {'\n'}
                    1. On the Home Screen: You can got to the Search Screen to Search for Movies by a keyword.
                    {'\n'}
                    2. On the Home Screen: You can got to the Favourite Movies Screen to view all the previously favourited Movies.
                    {'\n'}
                    3. On the Search Screen: If you tap (press) on a Movie in the searched list, you will be shown details on it on the Movie Details Screen.
                    {'\n'}
                    4. On the Search Screen: If you press and hold (longpress) on a Movie, it will be saved as a Favourite, and the Favourites screen will be displayed listing all saved Movies.
                    {'\n'}
                    5. On the Favourite Movies Screen: If you press and hold (longpress) on a Favourite Movie, you can delete it from Favourites
                    {'\n'}
                </Text>
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
            backgroundColor: 'lightyellow',
            flexDirection: 'column',
            padding: 10,
            margin: 10,
        },
    textStyle:
        {
            fontSize: 15,
            fontStyle: 'italic',
            textAlign: 'left',
            margin: 10,
        },
    imageStyle:
        {
            width: 300,
            height: 250,
            resizeMode: 'stretch',
        },
});
