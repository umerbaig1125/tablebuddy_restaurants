import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  BackHandler,
} from 'react-native';

import styles from './EditProfileStyle';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-navigation';
import * as ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditProfileVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Profile',
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
      RPhoto: '',
      imageName: '',
      loading: true,

      imageData: [],
      dataArray: [],
      RCuisineType: '',
      isVisible1: false,
      checked: [],
      RCTypeArray: [
        { key: 'American' },
        { key: 'Chinese' },
        { key: 'Thai' },
        { key: 'FastFood' },
        { key: 'Japanese' },
        { key: 'Italian' },
        { key: 'Lebanese' },
        { key: 'Mediterranean' },
        { key: 'Mexican' },
        { key: 'Pakistani' },
      ],
      photoName: '',
      CurrentResID: '',
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.saveBtn}
          onPress={this.onPressSaveEditProfileBtn}>
          <Text style={styles.SaveBtntext}>Save</Text>
        </TouchableOpacity>
      ),
    });
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
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          CurrentResID: e,
        });
        this.getResturantData();
      });
    });
  }

  closeReasonModel1 = () => {
    this.setState({
      isVisible1: false,
    });
  };

  // save cuisines button
  SaveCuisineBtn = () => {
    if (this.state.cuisineTypes == '') {
      Alert.alert('Please Select Atleast on Cuisne');
    } else {
      this.setState({
        isVisible1: false,
      });
    }
  };

  handleChange = (index, item) => {
    let checked = [...this.state.checked];
    checked[index] = !checked[index];
    this.setState({ checked });

    if (checked[index] == true) {
      if (this.state.RCuisineType == '') {
        this.setState({
          RCuisineType: this.state.RCuisineType + item.key,
        });
      } else {
        this.setState({
          RCuisineType: this.state.RCuisineType + ',' + item.key,
        });
      }
    } else if (checked[index] == false) {
      if (this.state.RCuisineType.includes(item.key + ',') == true) {
        var SampleText = this.state.RCuisineType.toString();
        this.setState({
          RCuisineType: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.RCuisineType.includes(',' + item.key) == true) {
        var SampleText = this.state.RCuisineType.toString();
        this.setState({
          RCuisineType: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.RCuisineType.includes(item.key) == true) {
        var SampleText = this.state.RCuisineType.toString();
        this.setState({
          RCuisineType: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  openReasonModel1 = () => {
    this.setState({
      isVisible1: true,
    });
  };

  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, response => {
      //const source = { uri: "response.uri" };
      const source = { uri: response.assets[0].uri };
      this.setState({
        imageData: response.assets[0],
        RPhoto: source,
        imageName: response.assets[0].fileName,
      });
    });
  };

  // get restaurant data
  getResturantData = () => {
    fetch(
      'http://' + global.AmeIp + '/api/Resturant/GetResturantinfoByResID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("get resturant info")
        console.log(responseJson[0].ResturantInfo);
        this.setState({
          loading: false,
          dataArray: responseJson[0].ResturantInfo,
          photoName: responseJson[0].ResturantInfo.PhotoUrl,
          RPhoto: {
            uri:
              'http://' + global.AmeIp + '//GulpImages/Resturants/' +
              responseJson[0].ResturantInfo.PhotoUrl,
          },
        });
        console.log("at 0")
        console.log('http://' + global.AmeIp + '//GulpImages/Resturants/' + responseJson[0].ResturantInfo.PhotoUrl)
        for (
          let i = 0;
          i < Object.values(responseJson[0].ResCuisineType).length;
          i++
        ) {
          for (
            let j = 0;
            j < Object.values(this.state.RCTypeArray).length;
            j++
          ) {
            if (
              this.state.RCTypeArray[j].key ==
              responseJson[0].ResCuisineType[i].CuisineTypePara
            ) {
              let newArray = [...this.state.checked];
              newArray[j] = true;
              this.setState({ checked: newArray });
            }
          }
          if (Object.values(responseJson[0].ResCuisineType).length - 1 == i) {
            this.setState({
              RCuisineType:
                this.state.RCuisineType +
                responseJson[0].ResCuisineType[i].CuisineTypePara,
            });
          } else {
            this.setState({
              RCuisineType:
                this.state.RCuisineType +
                responseJson[0].ResCuisineType[i].CuisineTypePara +
                ',',
            });
          }
        }
      })
      .catch(error => {
        console.log("error")
        console.error(error);
      });
  };

  // on click save button
  onPressSaveEditProfileBtn = () => {
    var a = this.state.imageName.slice(-3);

    console.log("image name", this.state.imageName);
    var Name = this.state.dataArray.Name;
    var Num = this.state.dataArray.PhoneNumber;
    var year = this.state.dataArray.InaugrationDate;
    var Type = this.state.RCuisineType;
    var style = this.state.dataArray.DinningStyle;
    var SAddress = this.state.dataArray.StreetAddress;
    var code = this.state.dataArray.ZipCode;
    var city = this.state.dataArray.City;
    var country = this.state.dataArray.Country;
    if (this.resturantName != undefined) {
      Name = this.resturantName;
    }
    if (this.resturantNumber != undefined) {
      Num = this.resturantNumber;
    }
    if (this.resturantInaugrationYear != undefined) {
      year = this.resturantInaugrationYear;
    }
    if (this.resturantDiningStyle != undefined) {
      style = this.resturantDiningStyle;
    }
    if (this.resturantStreetAddress != undefined) {
      SAddress = this.resturantStreetAddress;
    }
    if (this.resturantZipCode != undefined) {
      code = this.resturantZipCode;
    }
    if (this.resturantCity != undefined) {
      city = this.resturantCity;
    }
    if (this.resturantCountry != undefined) {
      country = this.resturantCountry;
    }
    if (this.state.imageName == '') {
      if (
        Name == '' ||
        Num == '' ||
        year == '' ||
        style == '' ||
        SAddress == '' ||
        code == '' ||
        city == '' ||
        country == '' ||
        Type == ''
      ) {
        Alert.alert('Please fill all fields');
      } else {
        fetch('http://' + global.AmeIp + '//api/Resturant/UpdateResturantInfo/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ResturantInfoID: this.state.CurrentResID,
            PhotoUrl: this.state.photoName,
            Name: Name,
            PhoneNumber: Num,
            InaugrationDate: year,
            DinningStyle: style,
            StreetAddress: SAddress,
            ZipCode: code,
            City: city,
            Country: country,
            CuisineType: Type,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.message == 'Resturant updated') {
              console.log("PhotoUrl 1", this.state.photoName)
              Alert.alert('Alert', 'Updated Successfully', [
                { text: 'Ok', onPress: () => this.props.navigation.goBack() },
              ]);
            } else {
              Alert.alert(responseJson.message);
            }
          })
          .catch(error => {
            console.log("error")
            console.error(error);
          });
      }
    } else {
      if (
        Name == '' ||
        Num == '' ||
        year == '' ||
        style == '' ||
        SAddress == '' ||
        code == '' ||
        city == '' ||
        country == '' ||
        Type == ''
      ) {
        Alert.alert('Please Fill Empty Fields');
      } else {
        this.setState({
          loading: true,
        });
        fetch('http://' + global.AmeIp + '//api/Resturant/UpdateResturantInfo/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PhotoUrl: this.state.CurrentResID + '.' + a.replace('=', ''),
            ResturantInfoID: this.state.CurrentResID,
            Name: Name,
            PhoneNumber: Num,
            InaugrationDate: year,
            DinningStyle: style,
            StreetAddress: SAddress,
            ZipCode: code,
            City: city,
            Country: country,
            CuisineType: Type,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.message == 'Resturant updated') {
              console.log("PhotoUrl", this.state.CurrentResID + '.' + a.replace('=', ''))
              let photo = { uri: this.state.imageData.uri };
              let formdata = new FormData();
              formdata.append('product[images_attributes[0][file]]', {
                uri: photo.uri,
                name: this.state.CurrentResID + '.' + a.replace('=', ''),
                type: 'image/jpeg',
              });
              fetch('http://' + global.AmeIp + '//api/Resturant/PostResturants/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
                body: formdata,
              })
                .then(response => {
                  this.setState({
                    loading: false,
                  });
                  Alert.alert('Alert', 'Update Successfully', [{ text: 'Ok' }]);
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Alert.alert(responseJson.message);
            }
          })
          .catch(error => {
            console.error(error);
          });
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
          <Modal
            isVisible={this.state.isVisible1}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                width: '90%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <Text style={styles.text7}>Select Cuisine Type</Text>
              <ScrollView
                style={{
                  width: '100%',
                  marginTop: 10,
                }}>
                <FlatList
                  data={this.state.RCTypeArray}
                  extraData={this.state}
                  renderItem={({ item, index }) => (
                    <CheckBox
                      style={styles.checkbox2}
                      onClick={() => {
                        this.handleChange(index, item);
                      }}
                      rightText={item.key}
                      rightTextStyle={styles.checkboxtext2}
                      isChecked={this.state.checked[index]}
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

                {/* Save btn section */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btnsave}
                  onPress={() => this.SaveCuisineBtn()}>
                  <Text style={styles.nextBtntext}>Save</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>

          <ScrollView>
            {/* Resturant Image upload section */}
            <View style={styles.view3}>
              <Image
                //source={{this.state.RPhoto.uri}}
                source={this.state.RPhoto}
                style={styles.img1} />
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={this.chooseFile.bind(this)}>
                <Text style={styles.plusBtntext}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Phone number input section */}

            <View style={styles.view4}>
              <Text style={styles.text3}>Restaurant Name</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter resturant name"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantName = text)}
                defaultValue={this.state.dataArray.Name}
              />
            </View>

            {/* Phone number input section */}

            <View style={styles.view4}>
              <Text style={styles.text3}>Phone Number</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter phone number"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantNumber = text)}
                defaultValue={this.state.dataArray.PhoneNumber}
                keyboardType={'numeric'}
              />
            </View>

            <View style={styles.view4}>
              <Text style={styles.text3}>Inauguration year</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter Inauguration year"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantInaugrationYear = text)}
                defaultValue={this.state.dataArray.InaugrationDate}
                keyboardType={'numeric'}
              />
            </View>

            {this.state.RCuisineType.includes(',') == true ? (
              <View style={styles.view4}>
                <Text style={styles.text3}>Cuisine type</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Cuisine type"
                  placeholderTextColor="#d0cece"
                  value="Multi Cuisine"
                  onTouchStart={() => this.openReasonModel1()}
                />
              </View>
            ) : (
              <View style={styles.view4}>
                <Text style={styles.text3}>Cuisine type</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Cuisine type"
                  placeholderTextColor="#d0cece"
                  value={this.state.RCuisineType}
                  onTouchStart={() => this.openReasonModel1()}
                />
              </View>
            )}

            <View style={styles.view4}>
              <Text style={styles.text3}>Dining Style</Text>
              <TextInput
                style={styles.input4}
                placeholder="Choose Dining Style"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantDiningStyle = text)}
                defaultValue={this.state.dataArray.DinningStyle}
              />
            </View>

            {/* Address input section */}

            <View style={styles.view4}>
              <Text style={styles.text3}>Street Address</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter street address"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantStreetAddress = text)}
                defaultValue={this.state.dataArray.StreetAddress}
              />
            </View>

            <View style={styles.view4}>
              <Text style={styles.text3}>Zip code</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter Zip code"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantZipCode = text)}
                defaultValue={this.state.dataArray.ZipCode}
              />
            </View>

            <View style={styles.view4}>
              <Text style={styles.text3}>City</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter City"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantCity = text)}
                defaultValue={this.state.dataArray.City}
              />
            </View>

            <View style={styles.view4}>
              <Text style={styles.text3}>Country</Text>
              <TextInput
                style={styles.input4}
                placeholder="Enter Country"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.resturantCountry = text)}
                defaultValue={this.state.dataArray.Country}
              />
            </View>

            {/* Save btn section */}
            {/* <TouchableOpacity
              activeOpacity={0.5}
              style={styles.nextBtn}
              onPress={() => this.onPressSaveEditProfileBtn()}>
              <Text style={styles.nextBtntext}>Save</Text>
            </TouchableOpacity> */}
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
