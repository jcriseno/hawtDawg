import React from 'react';
import { ScrollView, StyleSheet, FlatList, ActivityIndicator, Platform, View, Text } from 'react-native';
import { Location, Permissions, Constants } from 'expo';


export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links',
  };

    constructor(props){
        super(props);
        this.state = {
            isLoadingWeather: false,
            isLoadingSolar: false,
            latitude: null,
            longitude: null,
            weatherDataSource: null,
            solarDataSource: null,
            allData: {
                Time: 3,
                Temperature: 60,
                TempPrediction: 8
                }
            
        }
    }
    
    componentWillMount() {
        if(Platform.OS === 'android' && !Constants.isDevice){
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an android emulator. Try it on your device!',
            });
        }
        else {
            this._getLocationAsync();
            //this._dataBaseCall();
            //this._getWeather();
        }
    }
    
    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied',
            });
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ latitude: location.coords.latitude, longitude: location.coords.longitude });
        console.log(JSON.stringify(this.state));
        console.log(this.state.latitude);
        console.log(this.state.longitude);
        //await this._getData();
        //this._testFlask()
        this._dataBaseCall();
        //console.log(JSON.stringify(this.state.allData));
        //this._getSolar();
        //console.log(this.state.weatherDataSource);
        //console.log(this.state.solarDataSource);
        //console.log(JSON.stringify(this.state.dateSource));
    }
    _dataBaseCall() {
    let flaskData = 'http://10.0.0.5:5000/get_data?latitude=' + this.state.latitude + '&longitude=' + this.state.longitude;
    console.log(flaskData);
    return fetch(flaskData)
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(JSON.stringify(responseJson));
            this.setState({
                isLoading: false,
                allData: responseJson,
                //gsr: responseJson.gsr,
                //emg: responseJson.emg
            },
            function() {
                
            });
            
    })
        .catch((error) => {
            console.error(error);
    });
}
   /* 
    _testFlask() {
        let url = 'http://127.0.0.1:5000/multiple10'
        console.log(url);
        const response = await fetch(url);
        const responseJson = await response.json();
        console.log(responseJson);
    }

    async _getWeather() {
        let darkSkiesURL = 'https://api.darksky.net/forecast/765f733fc6eda3815f80b32033f91a67/' + this.state.latitude + ',' + this.state.longitude;
        const response = await fetch(darkSkiesURL);
        const responseJson = await response.json();
        let solarURL = 'https://api.solcast.com.au/radiation/forecasts?longitude=' + this.state.longitude + '&latitude=' + this.state.latitude + '&api_key=XEojYcws9-nvIY4oODCZsZPsvXUGLaAz&format=json';
        const response2 = await fetch(solarURL);
        const responseJson2 = await response2.json();
        this.setState({
                    isLoadingWeather: false,
                    isLoadingSolar: false,
                    weatherDataSource: responseJson,
                    solarDataSource: responseJson2
                    
                });
        //<Text> This is the temperature in your area: {this.state.weatherDataSource.currently.temperature} </Text>
        
    }
/*
    async _getSolar() {
        let solarURL = 'https://api.solcast.com.au/radiation/forecasts?longitude=' + this.state.longitude + '&latitude=' + this.state.latitude + '&api_key=XEojYcws9-nvIY4oODCZsZPsvXUGLaAz&format=json';
        const response = await fetch(solarURL);
        const responseJson = await response.json();
        this.setState({
                    isLoadingSolar: false,
                    solarDataSource: responseJson
                    
                });
        //console.log(JSON.stringify(this.state.solarDataSource.forecasts[0].ghi))
        //<Text> This is the solar radiation in your area right now: {this.state.solarDataSource.forecasts[0].ghi} </Text>
    }

    _getWeather() {
       let darkSkiesURL = 'https://api.darksky.net/forecast/765f733fc6eda3815f80b32033f91a67/' + this.state.latitude + ',' + this.state.longitude;
        console.log(darkSkiesURL);
        return fetch(darkSkiesURL)
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(JSON.stringify(responseJson.currently.temperature));
                this.setState({
                    isLoadingWeather: false,
                    weatherDataSource: responseJson
                    
                },
                function(){
                    
                });
        })
            .catch((error) => {
                console.error(error);
        }); 
        //this._getSolar();
    }

    _getSolar() {
       let api_key = 'XEojYcws9-nvlY4oODCZsZPsvXUGLaAz';
       let solarURL = 'https://api.solcast.com.au/radiation/forecasts?longitude=' + this.state.longitude + '&latitude=' + this.state.latitude + '&api_key=XEojYcws9-nvIY4oODCZsZPsvXUGLaAz&format=json'; 
        console.log(solarURL);
        return fetch(solarURL)
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(JSON.stringify(responseJson.currently.temperature));
                this.setState({
                    isLoadingSolar: false,
                    solarDataSource: responseJson
                    
                },
                function(){
                    
                });
        })
            .catch((error) => {
                console.error(error);
        });
        console.log(JSON.stringify(this.state.solarDataSource.forecasts[0].ghi));
    }
    
    componentDidMount() {
        let darkSkiesURL = 'https://api.darksky.net/forecast/765f733fc6eda3815f80b32033f91a67/' + this.state.latitude + ',' + this.state.longitude;
        return fetch(darkSkiesURL)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataSource: responseJson,
                }, function(){
                    
                });
        })
            .catch((error) => {
                console.error(error);
        });
    }
          <ScrollView style={styles.container}>
        <Text> This is the solar radiation in your area right now: {this.state.solarDataSource.forecasts['0'].ghi} </Text>
        <Text> This is the solar radiation in your area right now: {this.state.solarDataSource.forecasts['0'].azimuth} </Text>
        <Text> This is the solar radiation in your area right now: {this.state.solarDataSource.forecasts['0'].zenith} </Text>
        <Text> This is the temperature in your area: {this.state.weatherDataSource.currently.temperature} </Text>
      </ScrollView>
      
              <View>
            <FlatList
                data={this.state.allData}
                renderItem={({item}) => (
                    <View>
                    <Text> Time: {item.Time} </Text>
                    <Text> Temperature outside: {item.Temperature} </Text>
                    <Text> Predicted Temperature in your car: {item.TempPrediction} </Text>
                    </View>
                        
                )}
            />
        </View>
    
    */

_keyExtractor = (item, index) => String(item.Time);
    
_getTime(time) {
    var temp = 0;
    
    if (time > 12) {
        temp = time - 12;
        return temp;
    }
    
    if (time == 0) {
        temp = 12;
        return temp;
    }
    return time;
}

  render() {
    //this._getWeather();
    if((this.state.isLoadingWeather) && (this.state.isLoadingSolar)){
        //this._getWeather();
        return(
            <View style={styles.container}>
                <ActivityIndicator/>
            </View>
        )
    }
    return (
        <View>
            <FlatList
                data={this.state.allData}
                keyExtractor={this._keyExtractor}
                renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                    <Text> Time: {this._getTime(item.Time)} </Text>
                    <Text> Temperature outside: {item.Temperature} </Text>
                    <Text> Predicted Temperature in your car: {item.TempPrediction + item.Temperature} </Text>
                    <Text> Rad: {item.Radiation}</Text>
                    <Text> Pred: {item.TempPrediction}</Text>
                    </View>
                        
                )}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
    itemContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#FFBDBD',
  },
});
