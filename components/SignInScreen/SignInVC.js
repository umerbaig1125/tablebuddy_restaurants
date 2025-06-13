import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import styles from './SignInStyleVC';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default class SignInVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  // handle back button
  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  };

  // on press sign button
  onPressSignInBtn = () => {
    this.setState({
      loading: true,
    });
    if (
      this.userEmail == undefined ||
      this.userEmail == '' ||
      this.userPassword == undefined ||
      this.userPassword == ''
    ) {
      this.setState({
        loading: false,
      });
      Alert.alert('Alert', 'please write empty field', [{ text: 'Ok' }]);
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(this.userEmail) === false) {
        this.setState({
          loading: false,
        });
        Alert.alert('Alert', 'please write correct email address', [
          { text: 'Ok' },
          ,
        ]);
        return false;
      } else {
        fetch('http://' + global.AmeIp + '//api/User/CheckResturantLogin/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            EmailAddress: this.userEmail,
            Password: this.userPassword,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            this.setState({
              loading: false,
            });
            console.log("login api response", responseJson)
            if (responseJson.UserInfoID == 0) {
              this.setState({
                loading: false,
              });
              Alert.alert('Alert', 'Invalid User', [{ text: 'Ok' }]);
            } else {
              if (responseJson.UserRole == 'Restraunt') {
                if (responseJson.ResturantInfoID == '') {
                  this.props.navigation.navigate('RegisterForm', {
                    UserInfoID: responseJson.UserInfoID,
                  });
                  AsyncStorage.setItem(
                    'ResturantUserId',
                    responseJson.UserInfoID,
                  );
                } else {
                  AsyncStorage.setItem(
                    'CurrentUserID',
                    responseJson.ResturantInfoID,
                  );
                  this.RefereshToken(responseJson.ResturantInfoID);
                  this.props.navigation.navigate('TabNavigation');
                  this.updateSection();
                  AsyncStorage.setItem(
                    'ResturantUserId',
                    responseJson.UserInfoID,
                  );
                }
                //}
              }
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  // refresh token on DB for notification
  RefereshToken = e1 => {
    console.log('refresh');
    var Token = AsyncStorage.getItem('fcmToken');
    Token.then(e => {
      console.log(e);
      console.log(e1);
      fetch('http://' + global.AmeIp + '//api/Resturant/UpdateResInfoDeviceToken/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: e1,
          DeviceToken: e,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(`update res info ${responseJson}`);
          console.log(e1);
          console.log(e);
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  // on press register button
  onPressRegisterHereBtn = () => {
    this.props.navigation.navigate('SignUp');
  };

  // on press click forget password
  onPressClickHereBtn = () => {
    this.props.navigation.navigate('RecoverPassword');
  };

  // update user session on DB
  updateSection() {
    var ID = AsyncStorage.getItem('CurrentUserID');
    ID.then(e => {
      fetch('http://' + global.AmeIp + '//api/Resturant/UpdateResturantSession/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: e,
          SessionFlag: 1,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          AsyncStorage.setItem('isLogin', 'true');
        })
        .catch(error => {
          console.error(error);
        });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.indicator}>
          <ActivityIndicator size="large" color="#C16563" />
        </View>
      );
    } else {
      return (
        <DismissKeyboard>
          <SafeAreaView style={styles.view1}>
            <ScrollView>
              <View>
                {/* logo Section            */}
                <View style={styles.view2}>
                  <Image
                    source={require('../Assets/logo.png')}
                    style={styles.img1}
                    resizeMode="contain"
                  />
                </View>

                {/* TextField section */}
                <View style={styles.view3}>
                  <TextInput
                    style={styles.input1}
                    placeholder="Enter Email"
                    autoCapitalize="none"
                    placeholderTextColor="#A3A3A3"
                    onChangeText={text => (this.userEmail = text)}
                  />
                  <TextInput
                    style={styles.input1}
                    placeholder="Enter Password"
                    autoCapitalize="none"
                    placeholderTextColor="#A3A3A3"
                    onChangeText={text => (this.userPassword = text)}
                    secureTextEntry={true}
                  />

                  {/* SignBTN */}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.btn1}
                    onPress={this.onPressSignInBtn}>
                    <Text style={styles.btn1text}>Sign In</Text>
                  </TouchableOpacity>

                  <View style={styles.view5}>
                    <Text style={styles.text1}>Forgot your password?</Text>

                    <TouchableOpacity onPress={this.onPressClickHereBtn}>
                      <Text style={styles.text2}>Click Here!</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.view4}>
                    <Text style={styles.text1}>Don’t have an account?</Text>

                    {/* Register Btn */}
                    <TouchableOpacity onPress={this.onPressRegisterHereBtn}>
                      <Text style={styles.text2}>Register Here!</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </DismissKeyboard>
      );
    }
  }
}
