// home screen for reminder feature; dismiss leads to home screen until destination is reached.
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
import { NavigationActions } from 'react-navigation';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgb(232,232,232)',
    },
    contentContainer: {
      paddingTop: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeImage: {
      width: 100,
      height: 80,
      resizeMode: 'contain',
      marginTop: 3,
      marginLeft: -10,
    },
    getStartedContainer: {
      marginTop: 60,
      marginBottom: 30,
      textAlign: 'center',
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

export default class DismissReminderScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        header: null
    };
    constructor(props) {
        super(props);
        const { navigation } = this.props;
        this.state = {
            allData: navigation.getParam('data'),
            time: 0,
            user: navigation.getParam('user'),
            setTimer: navigation.getParam('push'),
            navigation: this.props
        }
    }
    componentWillMount() {
        this._checkUnsafeTemp();
    }
    _setTimer() {
        if (this.state.time >= 5 && !this.state.setTimer) {
            var temp = 1;
            var url = 'http://10.0.0.5:5000/set_timer?user='+ this.state.user + '&time=' + temp;//this.state.time.toString();
            this.setState({setTimer: true});
            console.log(url);
            fetch(url);
        }
    }

    _checkUnsafeTemp() {
        // Get how much temp is gained every minute
        var x = parseInt(this.state.allData[0].TempPrediction) / 60;
        // The Temp we are adding to everytime
        var finalPred = this.state.allData[0].Temperature;
        var itr = 0;
        // Total time that we are adding too
        var time = 0;
        // Runs this loop until our Oven car temp reaches dangerouse levels
        while (finalPred < 90) {
            // 5 minute intervals
            finalPred += x * 5;
            // Add 5 minutes to total time
            time += 5;
            // This is a check that makes sure we are using the right temp pred 
            // when we go over the hour time
            if (time % 60 == 0) {
                itr += 1;
                x = parseInt(this.state.allData[itr].TempPrediction) / 60;
            }
        }
        // implement plus sign if greater that n60 minutes
        this.setState({
            time: parseInt(time)
        })
        //return parseInt(time);
    }
// Implement opacity for set timer button this.props.navigation.navigate('Home')
  
    render() {

      if(this.state.hide)
      return(
        <View style={styles.container}>
          <ScrollView style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
          
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>You will be reminded to remove your passengers in {this.state.time} minutes.</Text>
          </View>  
          <View style={styles.getStartedContainer}>
            <TouchableHighlight style={styles.buttonContainer} onPress={() => {this.props.navigation.state.params.onGoBack(this.state.setTimer);
                                                                                this.props.navigation.goBack();}}>
            <Text style={styles.buttonText}>Done</Text>
            </TouchableHighlight>
          </View>

          </ScrollView>
        </View>
      )
      return (
        <View style={styles.container}>
          <ScrollView style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
          
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>You will be reminded to remove your passengers in {this.state.time} minutes.</Text>
          </View>  
          <View style={styles.getStartedContainer}>
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Done</Text>
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.buttonContainer} onPress={() => {this._setTimer(), this.setState({hide: true})}}>
            <Text style={styles.buttonText}>Leaving Car</Text>
            </TouchableHighlight>
            </View>

          </ScrollView>
        </View>
      );
    }
  }
  
  
  
  /*
  render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.getStartedContainer} contentContainerStyle={styles.contentContainer}>
          
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>You will be reminded to remove your passengers in {this.state.time}.</Text>
            
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Home')}>
            <Text style={styles.buttonText}>Dismiss</Text>
            </TouchableHighlight>
            
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this._setTimer()}>
            <Text style={styles.buttonText}>Set Timer</Text>
            </TouchableHighlight>
          </View>

          </ScrollView>
        </View>
      );
    }
*/