import * as React from 'react';
import { createAppContainer } from 'react-navigation'; // Version can be specified in package.json
import { createStackNavigator } from 'react-navigation-stack';
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
        headerShown: false,
      },
    },
    Landing: {
      screen: LandingVC,
      navigationOptions: {
        headerShown: false,
      },
    },
    SignIn: {
      screen: SignInVC,
      navigationOptions: {
        headerShown: false,
      },
    },
    RecoverPassword: {
      screen: RecoverPassword,
    },
    SignUp: {
      screen: SignUpVC,
      navigationOptions: {
        headerShown: false,
      },
    },

    TabNavigation: {
      screen: TabNavigation,
      navigationOptions: {
        headerShown: false,
      },
    },
    RegisterForm: {
      screen: RegisterForm,
      navigationOptions: {
        headerShown: false,
      },
    },

    EditProfile: {
      screen: EditProfile,
    },
    EditDescription: {
      screen: EditDescription,
      navigationOptions: {
        headerShown: false,
      },
    },
    EditServices: {
      screen: EditServices,
      navigationOptions: {
        headerShown: false,
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        headerShown: false,
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
