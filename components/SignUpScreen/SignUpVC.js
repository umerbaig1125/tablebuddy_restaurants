import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import styles from './SignUpStyleVC';
import CheckBox from 'react-native-check-box';
import Modal from 'react-native-modal';

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default class SignUpVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isChecked: false,
      isVisible1: false,
    };
  }

  // press notification signIn button
  onPressSignInBtn = () => {
    this.props.navigation.navigate('SignIn');
  };

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

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  };

  // press Signup button
  onPressSignUpBtn = () => {
    this.setState({
      loading: true,
    });
    if (
      this.firstName == undefined ||
      this.lastName == undefined ||
      this.Email == undefined ||
      this.firstPassword == undefined ||
      this.secondPassword == undefined ||
      this.firstName == '' ||
      this.lastName == '' ||
      this.Email == '' ||
      this.firstPassword == '' ||
      this.secondPassword == ''
    ) {
      Alert.alert('Alert', 'Please fill all fields', [{ text: 'Ok' }]);
      this.setState({
        loading: false,
      });
    } else {
      if (this.firstPassword == this.secondPassword) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.Email) === false) {
          this.setState({
            loading: false,
          });
          Alert.alert('Alert', 'Please enter the correct email address', [
            { text: 'Ok' },
          ]);
          return false;
        } else {
          if (this.state.isChecked == true) {
            fetch('http://' + global.AmeIp + '//api/User/SaveUserInfo/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                FirstName: this.firstName,
                LastName: this.lastName,
                EmailAddress: this.Email,
                Password: this.firstPassword,
                UserRoleID: '2',
                InitialSetup: '0',
              }),
            })
              .then(response => response.json())
              .then(responseJson => {
                console.log("api response", responseJson);
                this.setState({
                  loading: false,
                });
                if (responseJson.message == 'User Created') {
                  Alert.alert(
                    'Alert',
                    'Your account has been created',
                    [
                      {
                        text: 'Ok',
                        onPress: () => this.props.navigation.navigate('SignIn'),
                      },
                    ],
                  );
                } else {
                  this.setState({
                    loading: false,
                  });
                  Alert.alert('Alert', responseJson.message, [{ text: 'Ok' }]);
                  console.log("failed", responseJson.message)
                }
              })
              .catch(error => {
                console.error(error);
              });
          } else {
            this.setState({
              loading: false,
            });
            Alert.alert(
              'Alert',
              'You must agree to the terms and conditions in order to continue',
              [{ text: 'Ok' }],
            );
          }
        }
      } else {
        this.setState({
          loading: false,
        });
        Alert.alert('Alert', 'Password did not match', [{ text: 'Ok' }]);
      }
    }
  };

  OnClicktermCondtion = () => {
    console.log('umer baig');
    this.setState({
      isVisible1: true,
    });
  };

  OnClickCanceltermCondtion = () => {
    this.setState({
      isVisible1: false,
      isChecked: false,
    });
  };

  OnClickConfirmtermCondtion = () => {
    this.setState({
      isVisible1: false,
    });
  };

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
            {/* term&condition popup */}
            <Modal
              isVisible={this.state.isVisible1}
              style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  height: 500,
                  width: '95%',
                  backgroundColor: '#2B3252',
                  alignItems: 'center',
                  borderRadius: 5,
                }}>
                <Text style={styles.TCtext1}>Terms & Condition</Text>
                <View style={styles.TCView2}>
                  <ScrollView
                    style={styles.TCView3}
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.TCtext2}>
                      Terms and Conditions agreements act as a legal contract
                      between you (the company) who has the website or mobile
                      app and the user who access your website and mobile app.
                      Having a Terms and Conditions agreement is completely
                      optional. No laws require you to have one. Not even the
                      super-strict and wide-reaching General Data Protection
                      Regulation (GDPR). It’s up to you to set the rules and
                      guidelines that the user must agree to. You can think of
                      your Terms and Conditions agreement as the legal agreement
                      where you maintain your rights to exclude users from your
                      app in the event that they abuse your app, where you
                      maintain your legal rights against potential app abusers,
                      and so on. Terms and Conditions agreements act as a legal
                      contract between you (the company) who has the website or
                      mobile app and the user who access your website and mobile
                      app. Having a Terms and Conditions agreement is completely
                      optional. No laws require you to have one. Not even the
                      super-strict and wide-reaching General Data Protection
                      Regulation (GDPR). It’s up to you to set the rules and
                      guidelines that the user must agree to. You can think of
                      your Terms and Conditions agreement as the legal agreement
                      where you maintain your rights to exclude users from your
                      app in the event that they abuse your app, where you
                      maintain your legal rights against potential app abusers,
                      and so on.
                    </Text>
                  </ScrollView>
                </View>
                <View style={styles.TCView5}>
                  <CheckBox
                    style={styles.checkbox}
                    onClick={() => {
                      this.setState({
                        isChecked: !this.state.isChecked,
                      });
                    }}
                    rightText={'I Agree with terms and conditions'}
                    rightTextStyle={styles.checkboxtext}
                    isChecked={this.state.isChecked}
                    checkedImage={
                      <Image
                        source={require('../Assets/image4.png')}
                        style={styles.img1}
                      />
                    }
                    unCheckedImage={
                      <Image
                        source={require('../Assets/image3.png')}
                        style={styles.img1}
                      />
                    }
                  />
                </View>
                <View style={styles.TCView1}>
                  <TouchableOpacity
                    style={styles.TCView4}
                    activeOpacity={0.5}
                    onPress={this.OnClickCanceltermCondtion}>
                    <Text style={styles.TCtext3}>CANCEL</Text>
                  </TouchableOpacity>
                  {this.state.isChecked == false ? (
                    <View style={styles.TCView4}>
                      <Text style={styles.TCtext4}>CONFIRM</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.TCView4}
                      activeOpacity={0.5}
                      onPress={this.OnClickConfirmtermCondtion}>
                      <Text style={styles.TCtext3}>CONFIRM</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </Modal>
            <ScrollView>
              <View style={styles.view22}>
                <Image
                  source={require('../Assets/logo.png')}
                  style={styles.img11}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.Heading1View}>
                <Text style={styles.text1}>Create New Account</Text>
              </View>
              <View style={styles.view3}>
                <TextInput
                  style={styles.input1}
                  placeholder="Enter First Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#A3A3A3"
                  onChangeText={text => (this.firstName = text)}
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Enter Last Name"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#A3A3A3"
                  onChangeText={text => (this.lastName = text)}
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Enter Email"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#A3A3A3"
                  onChangeText={text => (this.Email = text)}
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Enter Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#A3A3A3"
                  onChangeText={text => (this.firstPassword = text)}
                  secureTextEntry={true}
                />
                <TextInput
                  style={styles.input1}
                  placeholder="Re-Enter Password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#A3A3A3"
                  onChangeText={text => (this.secondPassword = text)}
                  secureTextEntry={true}
                />
                <View style={styles.view7}>
                  <Text style={styles.text5}>
                    By creating an account, you agree to our
                  </Text>
                  <TouchableOpacity onPress={this.OnClicktermCondtion}>
                    <Text style={styles.text6}>terms & conditions</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.btn1}
                onPress={this.onPressSignUpBtn}>
                <Text style={styles.btn1text}>SIGN UP</Text>
              </TouchableOpacity>

              {/* Register Btn */}
              <View style={styles.view5}>
                <Text style={styles.text3}>Already have an account?</Text>
                <TouchableOpacity
                  onPress={this.onPressSignInBtn}
                  style={styles.view6}>
                  <Text style={styles.text4}>Sign in!</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        </DismissKeyboard>
      );
    }
  }
}
