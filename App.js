import * as React from 'react';
import {Button, View, Text, AppState, AppRegistry} from 'react-native';
import {createAppContainer} from 'react-navigation'; // Version can be specified in package.json
import {createStackNavigator} from 'react-navigation-stack';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import LandingVC from './components/LandingScreen/LandingVC';
import SignInVC from './components/SignInScreen/SignInVC';
import SignUpVC from './components/SignUpScreen/SignUpVC';
import TabNavigation from './components/TabBar/TabNavigation';
import RecoverPassword from './components/RecoverPasswordScreen/RecoverPasswordVC';
import RegisterForm from './components/RegisterDetailFormScreen/RegisterFormVC';
import EditProfile from './components/EditProfileScreen/EditProfileVC';
import EditDescription from './components/EditDescriptionScreen/EditDescriptionVC';
import EditServices from './components/EditServicesScreen/EditServicesVC';
import ChangePassword from './components/ChangePasswordScreen/ChangePasswordVC';

import SplashScreen from './components/SplashScreen';

const RootStack = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
    Landing: {
      screen: LandingVC,
      navigationOptions: {
        header: null,
      },
    },
    SignIn: {
      screen: SignInVC,
      navigationOptions: {
        header: null,
      },
    },
    RecoverPassword: {
      screen: RecoverPassword,
    },
    SignUp: {
      screen: SignUpVC,
      navigationOptions: {
        header: null,
      },
    },

    TabNavigation: {
      screen: TabNavigation,
      navigationOptions: {
        header: null,
      },
    },
    RegisterForm: {
      screen: RegisterForm,
      navigationOptions: {
        header: null,
      },
    },

    EditProfile: {
      screen: EditProfile,
    },
    EditDescription: {
      screen: EditDescription,
      navigationOptions: {
        header: null,
      },
    },
    EditServices: {
      screen: EditServices,
      navigationOptions: {
        header: null,
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'SplashScreen',
  },
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
