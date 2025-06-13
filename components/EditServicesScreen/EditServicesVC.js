import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import styles from './EditServicesStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditServicesVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Services',
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
      SwitchValue: false,
      checked2: [],
      loading: true,
      SelectedServices: [
        { key: 'Street Parking' },
        { key: 'Valet Parking' },
        { key: 'Outdoor seating' },
        { key: 'Good for groups' },
        { key: 'Good for kids' },
        { key: 'Serves Breakfast' },
        { key: 'Serves Lunch' },
        { key: 'Serves Dinner' },
        { key: 'Playing area' },
      ],
      servicesVar: '',
      CurrentResID: '',
    };
  }

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

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      this.props.navigation.setParams({
        headerRight: () => (
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.saveBtn}
            onPress={this.onClickService}>
            <Text style={styles.SaveBtntext}>Save</Text>
          </TouchableOpacity>
        ),
      });
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          CurrentResID: e,
        });
        this.getResturantData();
      });
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
        this.setState({
          loading: false,
        });

        for (
          let i = 0;
          i < Object.values(responseJson[0].ResFeatures).length;
          i++
        ) {
          for (
            let j = 0;
            j < Object.values(this.state.SelectedServices).length;
            j++
          ) {
            if (
              this.state.SelectedServices[j].key ==
              responseJson[0].ResFeatures[i].ServiceName
            ) {
              let newArray = [...this.state.checked2];
              newArray[j] = true;
              this.setState({ checked2: newArray });
            }
          }

          if (Object.values(responseJson[0].ResFeatures).length - 1 == i) {
            this.setState({
              servicesVar:
                this.state.servicesVar +
                responseJson[0].ResFeatures[i].ServiceName,
            });
          } else {
            this.setState({
              servicesVar:
                this.state.servicesVar +
                responseJson[0].ResFeatures[i].ServiceName +
                ',',
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleChange2 = (index, item) => {
    let checked2 = [...this.state.checked2];
    checked2[index] = !checked2[index];
    this.setState({ checked2 });
    if (checked2[index] == true) {
      if (this.state.servicesVar == '') {
        this.setState({
          servicesVar: this.state.servicesVar + item.key,
        });
      } else {
        this.setState({
          servicesVar: this.state.servicesVar + ',' + item.key,
        });
      }
    } else if (checked2[index] == false) {
      if (this.state.servicesVar.includes(item.key + ',') == true) {
        var SampleText = this.state.servicesVar.toString();
        this.setState({
          servicesVar: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.servicesVar.includes(',' + item.key) == true) {
        var SampleText = this.state.servicesVar.toString();
        this.setState({
          servicesVar: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.servicesVar.includes(item.key) == true) {
        var SampleText = this.state.servicesVar.toString();
        this.setState({
          servicesVar: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  // on click save services button
  onClickService = () => {
    if (this.state.servicesVar == '') {
      Alert.alert('Please select at least 1 service');
    } else {
      fetch('http://' + global.AmeIp + '//api/Resturant/UpdateResturantInfo/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Service: this.state.servicesVar,
          ResturantInfoID: this.state.CurrentResID,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message == 'Resturant updated') {
            Alert.alert('Alert', 'Updated Successfully', [
              { text: 'Ok', onPress: () => this.props.navigation.goBack() },
            ]);
          } else {
            Alert.alert('Alert', responseJson.message);
          }
        })
        .catch(error => {
          console.error(error);
        });
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
        <ScrollView style={styles.view1}>
          {/* service check box section */}
          <View style={styles.view10}>
            <FlatList
              data={this.state.SelectedServices}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <CheckBox
                  style={styles.checkbox2}
                  onClick={() => {
                    this.handleChange2(index, item);
                  }}
                  rightText={item.key}
                  rightTextStyle={styles.checkboxtext2}
                  isChecked={this.state.checked2[index]}
                  checkedImage={
                    <Image
                      source={require('../Assets/check.png')}
                      style={styles.img2}
                    />
                  }
                  unCheckedImage={
                    <Image
                      source={require('../Assets/uncheck.png')}
                      style={styles.img2}
                    />
                  }
                />
              )}
            />
          </View>

          {/* Save btn section */}
          {/* <TouchableOpacity
            activeOpacity={0.5}
            style={styles.nextBtn}
            onPress={() => this.onClickService()}>
            <Text style={styles.nextBtntext}>Save</Text>
          </TouchableOpacity> */}
        </ScrollView>
      );
    }
  }
}
