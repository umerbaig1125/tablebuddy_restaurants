import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import {
  Image,
} from 'react-native';

import DashBoard from './DashboardScreen/DashBoardVC';
import Boost from './BoostScreen/BoostVC';
import Setting from './SettingScreen/SettingVC';
import Analytic from './AnalyticScreen/AnalyticVC';
import styles from './NavigationStyle';
import EditProfileVC from '../EditProfileScreen/EditProfileVC';
import EditDescriptionVC from '../EditDescriptionScreen/EditDescriptionVC';
import EditServicesVC from '../EditServicesScreen/EditServicesVC';
import ResturantMenuVC from '../ResturantMenuScreen/ResturantMenuVC';
import AddTimingVC from '../AddTimingScreen/AddTimingVC';
import ChangePassword from '../ChangePasswordScreen/ChangePasswordVC';

export const DashBoardStack = createStackNavigator(
  {
    Home: DashBoard,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

DashBoardStack.navigationOptions = {
  tabBarLabel: 'Reservation',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../Assets/home.png')}
      style={[{ tintColor: tintColor, height: 25, width: 25 }]}
    />
  ),
};

export const BoostStack = createStackNavigator(
  {
    Home: Boost,
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  },
);

BoostStack.navigationOptions = {
  tabBarLabel: 'Happy Hours',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../Assets/megaphone.png')}
      style={[{ tintColor: tintColor, height: 25, width: 25 }]}
    />
  ),
};

export const AnalyticStack = createStackNavigator(
  {
    Home: Analytic,
  },
  {
    initialRouteName: 'Home',
  },
);

AnalyticStack.navigationOptions = {
  tabBarLabel: 'Analytic',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../Assets/analytic.png')}
      style={[{ tintColor: tintColor, height: 25, width: 25 }]}
    />
  ),
};

export const SettingStack = createStackNavigator(
  {
    Home: Setting,
    EditProfileVC: EditProfileVC,
    EditDescriptionVC: EditDescriptionVC,
    EditServicesVC: EditServicesVC,
    ResturantMenuVC: ResturantMenuVC,
    AddTimingVC: AddTimingVC,
    ChangePasswordVC: ChangePassword,
  },
  {
    initialRouteName: 'Home',
  },
);

SettingStack.navigationOptions = {
  tabBarLabel: 'Setting',
  tabBarIcon: ({ tintColor }) => (
    <Image
      source={require('../Assets/settingsIcon.png')}
      style={[{ tintColor: tintColor, height: 25, width: 25 }]}
    />
  ),
};

const TabNav = createBottomTabNavigator(
  {
    DashBoard: { screen: DashBoardStack },
    Boost: { screen: BoostStack },
    //Analytic: { screen: AnalyticStack },
    Setting: { screen: SettingStack },
  },
  {
    key: 'DashBoard',
    tabBarPosition: 'bottom',
    initialRouteName: 'DashBoard',
    animationEnabled: true,
    headerMode: 'none',
    tabBarOptions: {
      style: styles.tabBar,
      labelStyle: styles.tabBarLabel,
      activeTintColor: '#2B3252',
      inactiveTintColor: '#E5E5E5',
    },
  },
);
export default TabNav;
