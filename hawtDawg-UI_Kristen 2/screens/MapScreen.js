import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {Location, Permissions, Constants} from 'expo';

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export default class MapScreen extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            initPos: {
                coordinates: {
                    latitude: 0,
                    longitude: 0
                },
                latitudeDelta: 0,
                longitudeDelta: 0,
                key: 0
            },
            markerPosition: {
                coordinate: {
                    latitude: 0,
                    longitude: 0
                },
                title: null,
                description: null
            },
            markers: [],
            startId: 0
        }
        this.handlePlaceMarker = this.handlePlaceMarker.bind(this);
    }
    /*
    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var lat = parserFloat(position.coords.latitude)
                var long = parserFloat(position.coords.longitude)
                
                var initialRegion = {
                    latitude: lat,
                    longitude: long,
                    latitudeDelta: 0,
                    longitudeDelta: 0
                }
                
                this.setState({initPos: initialRegion})
            }
        )
        console.log(JSON.stringify(this.initialRegion));                                     
    }
    */

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
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
    this.setState({ initPos: {coordinates: location.coords }});
    //console.log(JSON.stringify(this.state));
  }

  
  handlePlaceMarker(event) {
            //{...marker}
            let uniqueId = this.state.startId + 1;
            this.setState({startId: uniqueId});
            console.log(event.nativeEvent.coordinate);
            this.setState({
                markers: [
                ...this.state.markers,
                    {
                    coordinate: event.nativeEvent.coordinate,
                    title: 'Placed Marker',
                    description: 'You placed this marker',
                    id: uniqueId //'$${getRandomInt(50, 300)}'
                    }
                ]
            });
    };
    /*
    handlePlaceMarker(event) {
            let markInfo = {
                coordinate: event.nativeEvent.coordinate,
                title: 'Placed Marker',
                description: 'You placed this marker',
            }
            console.log(event.nativeEvent.coordinate);
            this.setState({
                markers: markInfo
            });
    };
*/
    render() {
        return(
            <MapView 
                style = {styles.map}
                provider = {PROVIDER_GOOGLE}
                region={{
                            latitude: this.state.initPos.coordinates.latitude,
                            longitude: this.state.initPos.coordinates.longitude,
                            latitudeDelta: 0.001,
                            longitudeDelta: 0.001,
                        }}
                    onLongPress={this.handlePlaceMarker}
                >
                {this.state.markers.map((marker) => {
                    return <Marker
                                key={marker.id}
                                coordinate={marker.coordinate}
                            >
                            </Marker>
                })}
            <Marker
                key = {'Home'}
                coordinate = {{
                        latitude: this.state.initPos.coordinates.latitude,
                        longitude: this.state.initPos.coordinates.longitude
                }}
                title = {'Location Marker'}
                description = {'This marks your location'}>
            </Marker>
            </MapView>
        );
    }
};
    /*
    render() {
        return (
                <MapView style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    region={{
                            latitude: this.state.initPos.latitude,
                            longitude: this.state.initPos.longitude,
                            latitudeDelta: 0.1,
                            longitudeDelta: 0.1,
                        }}
                    >
                </MapView>
        );
    }
};
*/



const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map : {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    }

});