import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import styles from './SettingStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationActions, StackActions } from 'react-navigation';

export default class SettingVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#C16563',
      },
      headerTintColor: '#C16563',
      headerTitleStyle: {
        fontWeight: '600',
        color: '#E5E5E5',
        fontSize: 22,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      RestImage: '',
      CurrentResID: '',
      ResturantPoints: '',
      loading: true,
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          CurrentResID: e,
        });
        this.getResturantData();
      });
    });

    this.props.navigation.setParams({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.logoutBtn}
          onPress={this.logOutBtn}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }

  // getting resturant data
  getResturantData = () => {
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoByResID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("response json", responseJson);
        console.log("response json 0", responseJson[0].ResturantInfo.Points);

        this.setState({
          loading: false,
          RestImage: responseJson[0].ResturantInfo.PhotoUrl,
          ResturantPoints: responseJson[0].ResturantInfo.Points,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  // onclick logout button
  logOutBtn = () => {
    this.setState({
      loading: true,
    });
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
          SessionFlag: 0,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          this.setState({
            loading: false,
          });
          if (responseJson.message == 'Resturant session Updated') {
            this.reset();
            this.props.navigation.navigate('Landing');
            AsyncStorage.setItem('isLogin', 'true');
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  };

  // reset staks
  reset() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'TabNavigation' })],
    });

    this.props.navigation.dispatch(resetAction);
  }

  // on click edit profile
  onPressEditProfile = () => {
    this.props.navigation.navigate('EditProfileVC');
  };

  // onclick description button
  onPressEditDescription = () => {
    this.props.navigation.navigate('EditDescriptionVC');
  };

  // onclick edit services
  onPressEditServices = () => {
    this.props.navigation.navigate('EditServicesVC');
  };

  // onclick edit menu
  onPressEditMenu = () => {
    this.props.navigation.navigate('ResturantMenuVC');
  };

  // on click add timings
  onPressAddTimings = () => {
    this.props.navigation.navigate('AddTimingVC');
  };

  // on click Change Password
  onPressChangePassword = () => {
    this.props.navigation.navigate('ChangePasswordVC');
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
          <ScrollView>
            <View style={styles.view2}>
              {this.state.RestImage == '' ? (
                <View>
                  <Image
                    source={require('../../Assets/restaurant.png')}
                    style={styles.img4}
                  />
                </View>
              ) : (
                <View>
                  <Image
                    source={{
                      uri:
                        'http://' + global.AmeIp + '/GulpImages/Resturants/' +
                        this.state.RestImage,
                    }}
                    style={styles.img1}
                  />
                </View>
              )}
              <Text style={styles.text1}>
                {Number(this.state.ResturantPoints).toFixed(0)} Points
              </Text>
            </View>

            <Text style={styles.text2}>Accounts</Text>
            <View style={styles.view5}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressEditProfile}>
                <Image
                  source={require('../../Assets//userIcon1.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressEditDescription}>
                <Image
                  source={require('../../Assets/exam.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Description</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressEditServices}>
                <Image
                  source={require('../../Assets/serviceslIcon.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressEditMenu}>
                <Image
                  source={require('../../Assets/menuIcon.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Menu</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressAddTimings}>
                <Image
                  source={require('../../Assets/timing.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Add Timing</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.onPressChangePassword}>
                <Image
                  source={require('../../Assets/lock.png')}
                  style={styles.img3}
                />
                <Text style={styles.text4}>Change Password</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view6}
                onPress={this.logOutBtn}>
                <Image
                  source={require('../../Assets/logout.jpeg')}
                  style={styles.img5}
                />
                <Text style={styles.text5}>Logout</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
