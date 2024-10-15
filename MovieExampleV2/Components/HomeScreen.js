// HomeScreen.js: Root Screen for Version 2 of MovieExample
// Author: Harjinder Singh
// Last Updated: 01/05/2020
// Notes: This is the second release of the MovieExample based on the app idea I originally presented
//        This component acts as the First (root) screen of the improved Movie Example,
//        It allows users to navigate throughout the application Screens
//        Please read comments carefully to understand what this code does

import React, {Component} from 'react';
import {Button, Text, View, Image, StyleSheet} from 'react-native';

export default class HomeScreen extends Component {
    render() {
        const MovieImage = require('../Resources/Movies.jpg');
        const { navigation } = this.props;
        return (
            <View style={styles.containerStyle}>
                <Text style={styles.textStyle} >
                    The Movie Search App
                </Text>
                <Button
                    style={styles.buttonStyle}
                    title="Search for Movies >>"
                    onPress={() => navigation.navigate('MovieSearchScreen')}
                />
                <Button
                    style={styles.buttonStyle}
                    title="View Favourite Movies >>"
                    onPress={() => navigation.navigate('FavouriteMoviesScreen')}
                />
                <Image
                    style={styles.imageStyle}
                    source={MovieImage}
                />
                <Button
                    style={styles.buttonStyle}
                    title="Instructions >>"
                    onPress={() => navigation.navigate('InstructionsScreen')}
                />
                <Text style={styles.textStyle} style={{ fontSize: 15}} >
                    Created by: Harjinder Singh (2020)
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textStyle: {
        fontSize: 25,
        fontFamily: 'Times New Roman',
        color: 255,
    },
    buttonStyle: {
        width: 50,
        height: 50,
        backgroundColor: 'powderblue',
    },
    imageStyle: {
        resizeMode: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        width: 300,
        height: 300,
    },
});
