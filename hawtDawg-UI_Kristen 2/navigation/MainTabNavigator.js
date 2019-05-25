import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DismissLeaveInCar from '../screens/DismissLeaveInCar';
import DismissReminder from '../screens/DismissReminder';
import StateLaw from '../screens/StateLaw';
import DisarmLeaveInCar from '../screens/DisarmLeaveInCar';
import DisarmReminder from '../screens/DisarmReminder';
import LowBattery from '../screens/LowBattery';
import Unsafe from '../screens/Unsafe';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  //Profile: { screen: ProfileScreen},
  Profile: ProfileScreen,
  LeaveInCar: DismissLeaveInCar,
  Reminder: DismissReminder,
  StateLaw: StateLaw,
  DisarmReminder: DisarmReminder,
  DisarmLeave: DisarmLeaveInCar,
  Unsafe: Unsafe,
  LowBattery: LowBattery,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const MapStack = createStackNavigator({
    Maps: MapScreen,
});

MapStack.navigationOptions = {
    tabBarLabel: 'Map',
    tabBarIcon: ({focused}) => (
        <TabBarIcon 
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
        />
    ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  Home:{screen: HomeStack, navigationOptions: {tabBarVisible:false}, Visible:false},
  MapStack,
  LinksStack,
  SettingsStack,
});

