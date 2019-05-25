// screen telling user it is too dangerous to use the leave-in0car feature. Acknoledge returns to home screen.
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  Button,
} from 'react-native';
import { MonoText } from '../components/StyledText';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(232,232,232)',
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center'
  },
  getStartedText: {
    fontSize: 19,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  android: {
   elevation: 20,   
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:120,
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "rgb(224,0,0)",
  },
  buttonText: {
    fontSize: 19,
    color: 'white',
  },
  redBarContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:60,
    marginBottom:30,
    backgroundColor: "rgb(224,0,0)",
  },
  redBarText: {
    fontSize: 22,
    color: 'white',
  },
});

export default class UnsafeScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };
    
    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>

          <View style ={styles.redBarContainer}>
            <Text style={styles.redBarText}>ATTENTION!</Text>
          </View>

          <View style ={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Conditions are too dangerous to leave passengers unattended in your vehicle at this time.</Text>
          
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Acknowledge</Text>
            </TouchableHighlight>
          </View>

          </ScrollView>
        </View>
      );
    }
  }