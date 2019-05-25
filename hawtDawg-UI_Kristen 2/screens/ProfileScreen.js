import React, {Component} from 'react';
import {AppRegistry, Text, TextInput, View} from 'react-native';

export default class ProfileSetup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: 'Useless Place holder',
            name: 'Name goes here',
            carType: 'Your car type goes here',
            dogType: 'Your dog type goes here'
        };
    }
    
    render() {
        return (
            <View>
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({name})}
                value={this.state.name}
            />
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({carType})}
                value={this.state.carType}
            />
            <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({dogType})}
                value={this.state.dogType}
            />
            </View>
        );
    }
}

AppRegistry.registerComponent('AwesomeProject', () => UselessTextInput);