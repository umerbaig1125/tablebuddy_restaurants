import React, { Component } from 'react';
import {
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import styles from './RecoverPasswordStyle';

export default class RecoverPasswordVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Forget Password',
      headerStyle: {
        backgroundColor: '#C16563',
      },
      headerTintColor: '#E5E5E5',
      headerTitleStyle: {
        fontWeight: '700',
        color: '#E5E5E5',
        fontSize: 20,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  OnConfirmBtn = () => {
    Alert.alert('Coming soon');
    if (this.EmailAddress == undefined || this.EmailAddress == "") {
      Alert.alert("Please Write Email");
    } else {
      fetch(
        'http://' + global.AmeIp + '//api/User/UserPasswordRecoverByEmail?userEmail=' +
        this.EmailAddress
      )
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message == "Password Recover Email Send") {
            Alert.alert("Alert", "Email Sent successfully", [
              { text: "Ok", onPress: () => this.props.navigation.goBack() }
            ]);
          } else {
            Alert.alert("Please Write Correct Email");
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  componentWillMount() {
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

  render() {
    return (
      <SafeAreaView style={styles.view1}>
        <TextInput
          style={styles.input1}
          placeholder="Enter Email"
          placeholderTextColor="#A3A3A4"
          onChangeText={text => (this.EmailAddress = text)}
          autoCapitalize='none'
        />
        <Text style={styles.text1}>A link will be sent to your email</Text>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.btn1}
          onPress={() => this.OnConfirmBtn()}>
          <Text style={styles.btn1text}>Confirm</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}
