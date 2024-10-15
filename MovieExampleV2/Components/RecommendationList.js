// ListItem.js: Code for the ListItem Component as used by Version 1 of MovieExample
// Author: Harjinder Singh
// Last Updated: 29/04/2020
// The ListItem component receives a movie (or empty) object, and a display style, depending where it's called from
// Notes: Please read comments carefully to understand what this code does

// ...still need to import the React library as before
import React, {Component} from 'react';
// ... and any react-native standard components needed by our custom component
import {StyleSheet, View, Image, Text, TouchableHighlight} from 'react-native';

// general note: if you use 'export default' in your definition - it is the (only) component that is exported by default
export default class ListItem extends Component
{
    // each item in a list is a View component, that contains a small image and some text
    // the caller (FlatList) will pass in the movie JSON object to be displayed,
    // and a prop to indicate the item's style (colour) - green = searched, pink = empty, blue = saved
    render()
    {
        return (
            <View style={styles[this.props.itemStyle]}>
                <Image
                    style={styles.imageStyle}
                    source={{
                        uri: this.props.theRecMovie.Poster,
                    }}
                />
                <Text style = {styles.textStyle}>{this.props.theRecMovie.Title}, {this.props.theRecMovie.Year}, {this.props.sentimentscore}</Text>
            </View>)
    }

}

// Here we define the styles used by our component through the 'create()' method of the StyleSheet component
// You will note that I have created 3 different styles for the list item (view) itself:
// ... pink for when there are no items to display (empty array / list)
// ... lightgreen for items received from the Web Service (searched items)
// ... lightblue for items retrieved from AsyncStorage - saved on-device (favourite items)
const styles = StyleSheet.create
({
    textStyle:
        {
            fontSize: 20,
            textAlign: 'center',
            margin: 10,
        },
    imageStyle:
        {
            width: 50,
            height: 50,
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


