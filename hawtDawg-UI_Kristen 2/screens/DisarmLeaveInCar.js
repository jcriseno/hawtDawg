// Screen marking a dangerous temperature condition trigger. Disarm button returns to home screen.
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
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    marginHorizontal: 20,
    marginTop: 40,
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
    marginTop:30,
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "rgb(224,0,0)",
  },
  buttonText: {
    fontSize: 19,
    color: 'white',
  },
});

export default class DisarmLeaveInCarScreen extends React.Component {
    static navigationOptions = {
      header: null,
    };
  
    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
          
            <View style={styles.getStartedContainer}>
              <Text style={styles.getStartedText}>DANGER!</Text>
              <Text style={styles.getStartedText}>Conditions are becoming unsafe for passengers in your car. Return to your vehicle now.</Text>
            
              <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Home')}>
              <Text style={styles.buttonText}>Disarm</Text>
              </TouchableHighlight>
            </View>

          </ScrollView>
        </View>
      );
    }
  }