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
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import Logo from './Logo.js';
import { Location, Permissions, Constants, Accelerometer, LinearGradient, Notifications } from 'expo';
import TopScreenTemp from "../components/TopScreenTemp";
import Login from "../components/Login.js";
import CreateAccount from "../components/CreateAccount.js";

import { MonoText } from '../components/StyledText';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceInterval: 2 };
//const GEOLOCATION_OPTIONS = { Accuracy : 'BestForNavigation', distanceInterval: .5};
//const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';


class BlackFade extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: 'orange', flex: 1 }} />
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
          }}
        />
      </View>
    );
  }
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
    constructor(props){
        super(props);
        this.state = {
            latitude: null,
            longitude: null,
            location: { coords: {latitude: 0, longitude: 0}},
            allData: null,
            accelerometerData: {},
            isDriving: false,
            speed: 0,
            isLoading: true,
            isLoadingEstimate: true,
            notification: null,
            isLoggedIn: false,
            createAccount: false,
            user: "",
            token: null,
            reminderToggle: false,
            pushing: false,
            carTemp: 0
        }
    }

    componentWillMount() {
        if(Platform.OS === 'android' && !Constants.isDevice) {
            console.log("There is an error");
        }
        else {
            this._getLocationAsync();
            //this._registerForPushNotificationsAsync();
            this._notificationSubscription = Notifications.addListener(this._handleNotification);
            //Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
            //this._dataBaseCall();
            //this._toggle();
        }
    }

    _backScreenData = (data) => {
        this.setState({
            pushing: data
        });
    }

    _handleNotification = (notification) => {
        //this.setState({notification: notification});
        this._backScreenData(false);
        this.props.navigation.navigate('Unsafe');
        console.log("send");
        //Alert.alert (notification, "we recognized a change in speed");
    };
    
    _handleSetReminder() {
        if (!this.state.toggleReminder) {
            Alert.alert ("You hit set reminder!", "We will track you to see when you have stopped driving. If you would like to turn this off, hit reminder again.");
            //Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
            this._toggle();
            this.setState({
                speed: 15,
                toggleReminder: true
            });
        }
        else {
            Alert.alert ("We are already tracking you!", "Would you like to stop the reminder?", 
                        [{text: 'Yes', onPress: () => this._alertYes()},
                        {text: 'No', onPress: () => console.log('Ask me later pressed')}]);
        }
    }
    _alertYes() {
        this.setState({toggleReminder: false})
        this._toggle();
    }
    
    _registerForPushNotificationsAsync = async() => {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }

      // Stop here if the user did not grant permissions
      if (finalStatus !== 'granted') {
        return;
      }

      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      this.setState({
          token: token
      });
      //var url = 'http://10.0.0.5:5000/add_toDatabase?user=Ryan&token=' + token.toString();
      //console.log(url);
      // POST the token to your backend server from where you can retrieve it to send push notifications.
      //return fetch(url);
    return token;
    }

    _toggle = () => {
        if (this._subscription) {
            this._unsubscribe();
        }
        else {
            this._subscribe();
        }
    };
    
    _subscribe = async() => {
        this._subscription = await Location.watchPositionAsync(GEOLOCATION_OPTIONS, this.locationChanged);
    };
    _unsubscribe = () => {
        this._subscription.remove();
        this._subscription = null;
    };

    locationChanged = (location) => {
        console.log(location);
        var tempSpeed = 30;
        if (location.coords.speed > this.state.speed) {
            this.setState({
                speed: location.coords.speed
            });
        }
        else if (tempSpeed < this.state.speed) { //location.coords.speed
            Alert.alert ("Alert", "We noticed you might have stopped driving, is this correct",
                        [{text: 'Yes', onPress: () => this.setState({toggleReminder: false})}]);
        }
    /*
    region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.1,
      longitudeDelta: 0.05,
    },
    this.setState({location, region})
    */
    //this.setState({speed: location.coords.speed})
    //console.log(this.state)
    //fetch('http://10.0.0.5:5000/send_notification?user=Ryan')
}
    
    _getLocationAsync = async() => {
        let { status } = await
        Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            console.log("Error with access to location")
        }
        //Location.getCurrentPositionAsync({});
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude});
        console.log(this.state)
        this._dataBaseCall();
        this._dataBaseCallEstimate();
        //this.formateCarTemp();
    }
    
    //x: {Math.round(x)} y: {Math.round(y)} z: {Math.round(z)}
    
    _dataBaseCall() {
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        let url = 'http://10.0.0.5:5000/get_data?latitude=' + this.state.latitude + '&longitude=' + this.state.longitude;
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson['0'].Temperature ))
                this.setState({
                    isLoading: false,
                    allData: responseJson
                },
                function() {
                    
                });
        })
            .catch((error) => {
                //console.error(error);
                this.setState({
                    isLoading: false,
                });
        });
    }

    _dataBaseCallEstimate() {
        var day = new Date().getDate();
        var month = new Date().getMonth() + 1;
        let url = 'http://10.0.0.5:5000/estimated_temp?latitude=' + this.state.latitude + '&longitude=' + this.state.longitude;
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(JSON.stringify(responseJson['0'].TempPrediction ))
                this.setState({
                    //isLoadingEstimated: false,
                    estimatedData: responseJson
                },
                function() {
    
                });
            this.formateCarTemp();
        })
            .catch((error) => {
                //console.error(error);
                //this.setState({
                //    isLoadingEstimated: false,
                //});
        });
    }
    formateCarTemp() {
        var temp = 0;
        for (var i = 0; i < 6; i++) {
            temp += this.state.estimatedData[i].TempPrediction
        }
        this.setState({
            carTemp: parseInt(temp),
            isLoadingEstimated: false
        })
    }

    _keyExtractor = (item, index) => String(item.Time);



    _getTime(time) {
        var temp = 0;

        if (time > 12) {
            temp = time - 12;
            return temp.toString() + "pm";
        }

        if (time == 0) {
            temp = 12;
            return temp.toString() + "am";
        }
        temp = time.toString() + "am"
        return temp;
    }   

    _alertSpeedChange = () => {
        Alert.alert ("Saw change in speed", "we recognized a change in speed");
    }
//<View style={styles.container}>
    /*
    <View style={styles.getStartedContainer}>
          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Reminder')}>
            <Text style={styles.buttonText}>Passenger Reminder</Text>
            </TouchableHighlight>

          <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('LowBattery')}>
            <Text style={styles.buttonText}>Leave Passenger In Car</Text>
            </TouchableHighlight>
    </View>
    */
    
    _handleSubmit = async() => {
        if (this.state.user == "") {
            Alert.alert ("No user name", "please enter in a user name");
        }
        else {
            //let token = await Notifications.getExpoPushTokenAsync();
            var token = await this._registerForPushNotificationsAsync();
            var url = 'http://10.0.0.5:5000/add_toDatabase?user=' + this.state.user + '&token=' + this.state.token.toString();
            console.log(url);
            fetch(url);
            this.setState({
                isLoggedIn: true,
                createAccount: true
            });
        }
    }
    
    
  render() {
    
    let {
        x,
        y,
        z,
    } = this.state.accelerometerData;
    
    if (this.state.isLoading) {
        return(
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        )
    }
    if (!this.state.isLoggedIn && !this.state.createAccount && !this.state.isLoadingEstimated) {
        return (
            <ScrollView style={{padding: 50}}>
                <Text style={styles.containerLog}>
                    Create Account: 
                </Text>
                <TextInput
                    style={styles.logContainer}
                    placeholder='Username'
                    onChangeText={(text) => this.setState({user: text})}
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
      
    return (
      <View style={styles.container}>
          <View style={styles.getStartedContainer}>
            <Text style={styles.getStartedText}>Current Temperature:</Text>
          </View>
          <View style={styles.welcomeContainer}>
            <TopScreenTemp carTemp={this.state.carTemp} temp={parseInt(this.state.allData[0].Temperature + this.state.allData[0].TempPrediction)}/>
          </View>
          
          <View style={styles.weatherContainer}>
            <FlatList
                data={this.state.allData}
                keyExtractor={this._keyExtractor}
                renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                    <Text style={styles.weatherText}> {this._getTime(item.Time)} </Text>
                    <Text style={styles.weatherText}> {item.Temperature} °F</Text>
                    </View>      
                )}
            />
            </View>
            
            <View style={styles.getStartedContainer}>
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Reminder', {data: this.state.allData, user: this.state.user, push: this.state.pushing, onGoBack:this._backScreenData})}>
            <Text style={styles.buttonText}>Leave Passenger</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.buttonContainer} onPress={() => this._handleSetReminder()}>
            <Text style={styles.buttonText}>Set Reminder</Text>
            </TouchableHighlight>
            </View>
      </View>
    );
    
    

  }

  /*
  
  <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Unsafe')}>
  
  
  
  <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>

         <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
          
          containerLog : {
        alignItems: 'center',
        fontSize: 27,
    },
    logContainer : {
        paddingTop: 30,
        alignItems: 'center',
        fontSize: 20,
        position: 'relative'
    },
  */
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'rgb(232,232,232)',
  },
    itemContainer: {
    //borderRadius: 4,
    borderBottomWidth: 1,
    borderColor: '#d6d7da',
    backgroundColor: 'rgb(232,232,232)',
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    width:250,
  },
  containerLog : {
        alignItems: 'center',
        fontSize: 27,
    },
    logContainer : {
        paddingTop: 30,
        alignItems: 'center',
        fontSize: 20,
        position: 'relative'
    },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    marginTop:45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Image:{
    flex: 1,
    resizeMode: 'contain',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 20,
    textAlign: 'center',
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 19,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 10,
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  buttonContainer: {
    height:45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
    marginBottom:15,
    width:250,
    borderRadius:30,
    backgroundColor: "rgb(224,0,0)",
  },
  buttonText: {
    fontSize: 19,
    color: 'white',
  },
  weatherText: {
    fontSize: 14,
    color: 'rgba(96,100,109, 1)',
  },
  weatherContainer: {
    marginTop: 20,
    marginBottom: 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
});




/*
return (
      <View style={styles.container}>
          <View style={styles.welcomeContainer}>
            <TopScreenTemp temp={parseInt(this.state.allData[0].Temperature + this.state.allData[0].TempPrediction)}/>
            <View style={{flexDirection: 'row'}}>
                <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('Reminder', {data: this.state.allData, user: this.state.user})}>
                <Text style={styles.buttonText}>Passenger Reminder</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.buttonContainer} onPress={() => this.props.navigation.navigate('LowBattery')}>
                <Text style={styles.buttonText}>Leave Passenger In Car</Text>
                </TouchableHighlight>
            </View>
          </View>

            <FlatList
                data={this.state.allData}
                keyExtractor={this._keyExtractor}
                renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                    <Text> {this._getTime(item.Time)} </Text>
                    <Text> {item.Temperature} </Text>
                    <Text> Predicted Temperature in your car: {parseInt(item.TempPrediction + item.Temperature)} </Text>
                    <Text> Rad: {item.Radiation}</Text>
                    </View>
                        
                )}
            />
        
      </View>
    );
*/
