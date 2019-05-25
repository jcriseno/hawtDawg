import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View, Button, ScrollView, StyleSheet } from 'react-native';

export default class Login extends Component {
    
    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text style={styles.container}>
                    Login: 
                </Text>
                <TextInput
                    style={styles.logContainer}
                    placeholder='Username'
                />
                <TextInput
                    style={styles.logContainer}
                    placeholder='Password'
                />
                <View style={{margin:7}} />
                <Button
                    title="Submit"
                    onPress={console.log("logged in")}
                />
            </ScrollView>   
        );
    }
}

const styles = StyleSheet.create({
    container : {
        alignItems: 'center',
        fontSize: 27,
    },
    logContainer : {
        paddingTop: 30,
        alignItems: 'center',
        fontSize: 20,
        position: 'relative'
    }
});