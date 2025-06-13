import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import styles from './LandingStyleVC';

export default class LandingVC extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressSignInBtn = () => {
    this.props.navigation.navigate('SignIn');
  };

  onPressSignUpBtn = () => {
    this.props.navigation.navigate('SignUp');
  };

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp(); // works best when the goBack is async
      return true;
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.view1}>
        <View style={styles.view2}>
          <Image
            source={require('../Assets/logo.png')}
            style={styles.img1}
            resizeMode="contain"
          />
        </View>
        <View style={styles.view3}>
          {/* SignBTN */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.btn1}
            onPress={this.onPressSignInBtn}>
            <Text style={styles.btn1text}>Sign In</Text>
          </TouchableOpacity>
          {/* SignUp Btn */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.btn1}
            onPress={this.onPressSignUpBtn}>
            <Text style={styles.btn1text}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
