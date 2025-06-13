import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './ChangePasswordStyleVC';

export default class ChangePasswordVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Change Password',
      headerStyle: {
        backgroundColor: '#C16563',
      },
      headerTintColor: '#E5E5E5',
      headerTitleStyle: {
        fontWeight: '600',
        color: '#E5E5E5',
        fontSize: 18,
      },
      headerRight:
        navigation.state.params && navigation.state.params.headerRight,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      CurrentUserPassword: '',
      CurrentUserInfoID: '',
      loading: true,
    };
  }

  handleBackButtonClick = () => {
    this.props.navigation.goBack();
    return true;
  };

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.navigation.setParams({
        headerRight: () => (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.saveBtn}
            onPress={this.OnClickChangePassword}>
            <Text style={styles.text2}>Save</Text>
          </TouchableOpacity>
        ),
      });
      this.GetOldPassword();
    });
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  GetOldPassword = () => {
    var restId = AsyncStorage.getItem('CurrentUserID');
    restId.then(e => {
      fetch('http://' + global.AmeIp + '//api/User/GetPasswordbyResID?ResID=' + e)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            CurrentUserPassword: responseJson[0].Password,
            CurrentUserInfoID: responseJson[0].UserInfoID,
            loading: false,
          });
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  OnClickChangePassword = () => {
    this.setState({
      loading: true,
    });
    if (
      this.OldPassword == undefined ||
      this.OldPassword == '' ||
      this.NewConfirmPassword == undefined ||
      this.NewConfirmPassword == '' ||
      this.NewPassword == '' ||
      this.NewPassword == undefined
    ) {
      this.setState({
        loading: false,
      });
      Alert.alert('Alert', 'Please fill all fields');
    } else {
      if (this.state.CurrentUserPassword == this.OldPassword) {
        if (this.NewConfirmPassword == this.NewPassword) {
          fetch('http://' + global.AmeIp + '//api/User/UpdateResturantPassword/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              UserID: this.state.CurrentUserInfoID,
              Password: this.NewPassword,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log(responseJson);
              this.setState({
                loading: false,
              });
              if (responseJson.message == 'Rest Password Updated') {
                this.GetOldPassword();
                Alert.alert('Password updated successfully');
              } else {
                Alert.alert('Alert', responseJson.message);
              }
            })
            .catch(error => {
              console.error(error);
            });
        } else {
          Alert.alert('Password did not match');
        }
      } else {
        Alert.alert('Please enter the correct old password');
      }
    }
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
        <SafeAreaView style={styles.view1}>
          <View style={styles.view2}>
            <Text style={styles.text1}>Old Password</Text>
            <TextInput
              style={styles.input1}
              placeholder="Enter Old Password"
              placeholderTextColor="#d0cece"
              onChangeText={text => (this.OldPassword = text)}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.view2}>
            <Text style={styles.text1}>New Password</Text>
            <TextInput
              style={styles.input1}
              placeholder="Enter New Password"
              placeholderTextColor="#d0cece"
              onChangeText={text => (this.NewPassword = text)}
              secureTextEntry={true}
            />
          </View>
          <View style={styles.view2}>
            <Text style={styles.text1}>Confirm Password</Text>
            <TextInput
              style={styles.input1}
              placeholder="Enter Confirm Password"
              placeholderTextColor="#d0cece"
              onChangeText={text => (this.NewConfirmPassword = text)}
              secureTextEntry={true}
            />
          </View>
        </SafeAreaView>
      );
    }
  }
}
