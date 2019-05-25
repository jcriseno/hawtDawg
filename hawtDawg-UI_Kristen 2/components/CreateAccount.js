import React, { Component } from 'react';
import { AppRegistry, Text, TextInput, View, Button, ScrollView, StyleSheet } from 'react-native';

export default class CreateAccount extends Component {
    state = {
        text: ""
    }
    
    
    _handleSubmit = () => {
        console.log(this.state.text);
        this.props.onCreateAccountPress;
    }
    
    render() {
        return (
            <ScrollView style={{padding: 50}}>
                <Text style={styles.container}>
                    Create Account: 
                </Text>
                <TextInput
                    style={styles.logContainer}
                    placeholder='Username'
                    onChangeText={(text) => this.setState({text})}
                />
                <TextInput
                    style={styles.logContainer}
                    placeholder='Password'
                />
                <View style={{margin:7}} />
                <Button
                    title="Submit"
                    onPress={() => this._handleSubmit()}
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