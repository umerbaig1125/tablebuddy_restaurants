import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './RegisterFormStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import CheckBox from 'react-native-check-box';
import * as ImagePicker from "react-native-image-picker"
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RegisterFormVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag1: true,
      flag2: false,
      flag3: false,
      flag4: false,
      isVisible1: false,
      avatarSource: require('../Assets/userIcon1.png'),
      imageName: '',
      imageData: [],

      checked: [],
      checked1: [],
      checked2: [],

      cuisineTypes: '',
      SelectedServices: '',

      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,

      OpeningTime: '8:00AM',
      CloseTiming: '8:00AM',
      showTimePicker: false,
      timeDataArray: ['10', '20', '30', '40'],
      chosenEstimateTime: '10',
      SelectDays: '',
      UID: this.props.navigation.state.params.UserInfoID,
      Dtoken: '',
      loading: false,
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      var Token = AsyncStorage.getItem('fcmToken');
      Token.then(e => {
        console.log(this.state.UID);
        this.setState({
          Dtoken: e,
        });
      });
    });
  }

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
      console.log(response)
      //const source = { uri: "response.uri" };
      //const source = {uri: 'data:image/jpeg;base64,' + response.data};
      const source = { uri: response.assets[0].uri }
      this.setState({
        //imageData: response,
        imageData: response.assets[0],
        avatarSource: source,
        imageName: response.assets[0].fileName,
        //imageName: response.assets.map(url => url.uri),
      });
    });
  };

  onClickflag1Next = () => {
    if (
      this.RphoneNumber == undefined ||
      this.RphoneNumber == '' ||
      this.RStreetAddress == undefined ||
      this.RStreetAddress == '' ||
      this.RZipCode == undefined ||
      this.RZipCode == '' ||
      this.RCity == undefined ||
      this.RCity == '' ||
      this.RCountry == undefined ||
      this.RCountry == '' ||
      this.ResturantName == '' ||
      this.ResturantName == undefined
    ) {
      Alert.alert('Please fill all fields');
    } else if (this.RZipCode.length < 5) {
      Alert.alert('Zip code must have 5 digits');
    }
    else {
      this.setState({
        flag1: false,
        flag2: true,
        flag3: false,
        flag4: false,
      });
    }
  };

  onClickflag2Next = () => {
    if (
      this.RInaugurationYear == undefined ||
      this.RInaugurationYear == '' ||
      this.RDescription == undefined ||
      this.RDescription == '' ||
      this.RDiningStyle == undefined ||
      this.RDiningStyle == '' ||
      this.RMaxTable == undefined ||
      this.RMaxTable == '' ||
      this.RMinTable == undefined ||
      this.RMinTable == '' ||
      this.state.cuisineTypes == ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      if (parseInt(this.RMaxTable) < parseInt(this.RMinTable)) {
        Alert.alert(
          'Maximum table size should be greater than minimum table size',
        );
      } else {
        this.setState({
          flag1: false,
          flag2: false,
          flag3: true,
          flag4: false,
        });
      }
    }
  };

  onClickflag3Next = () => {
    console.log("opening and closing time");
    console.log(this.state.OpeningTime);
    console.log(this.state.CloseTiming);
    if (
      this.state.SelectDays == '' ||
      this.state.OpeningTime == '' ||
      this.state.CloseTiming == ''
      //this.state.chosenEstimateTime == ''
    ) {
      Alert.alert('Please fill all fields');
    } else {
      if (this.state.OpeningTime == this.state.CloseTiming) {
        Alert.alert('closing time must be less than closing time');
      } else {
        this.setState({
          flag1: false,
          flag2: false,
          flag3: false,
          flag4: true,
        });
      }
    }
  };

  onClickFinishBtn = () => {
    this.setState({
      loading: true,
    });
    var a = this.state.imageName.slice(-3);
    console.log(
      a.toString().replace('=', ''), //'TypeScript'
    );
    if (this.state.SelectedServices == '') {
      Alert.alert('Please Select at least one Service');
    } else {
      if (this.state.avatarSource == require('../Assets/userIcon1.png')) {
        fetch('http://' + global.AmeIp + '//api/Resturant/SaveResturantInfo/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PhotoUrl: '',
            UserInfoID: this.state.UID,
            UserRoleID: '2',
            Name: this.ResturantName,
            PhoneNumber: this.RphoneNumber,
            InaugrationDate: this.RInaugurationYear,
            DinningStyle: this.RDiningStyle,
            Description: this.RDescription,
            OpeningTime: this.state.OpeningTime,
            ClosingTime: this.state.CloseTiming,
            Points: '0',
            MaxTableSize: this.RMaxTable,
            MinTableSize: this.RMinTable,
            EstimatesWait: this.state.chosenEstimateTime,
            InitialSetup: '1',
            StreetAddress: this.RStreetAddress,
            ZipCode: this.RZipCode,
            City: this.RCity,
            Country: this.RCountry,
            CuisineType: this.state.cuisineTypes,
            Service: this.state.SelectedServices,
            Day: this.state.SelectDays,
            DeviceToken: this.state.Dtoken,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            this.setState({
              loading: true,
            });
            if (responseJson.message == 'Resturant Created') {
              this.props.navigation.navigate('TabNavigation', {
                MaxTableSize: this.RMaxTable,
                MinTableSize: this.RMinTable
              });
              AsyncStorage.setItem('isLogin', 'true');
            } else {
              Alert.alert('Alert', responseJson.message, [{ text: 'Ok' }]);
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        console.log(this.state.UID + '.' + a.toString().replace('=', ''));
        fetch('http://' + global.AmeIp + '//api/Resturant/SaveResturantInfo/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            PhotoUrl: '.' + a.toString().replace('=', ''),
            UserInfoID: this.state.UID,
            UserRoleID: '2',
            Name: this.ResturantName,
            PhoneNumber: this.RphoneNumber,
            InaugrationDate: this.RInaugurationYear,
            DinningStyle: this.RDiningStyle,
            Description: this.RDescription,
            OpeningTime: this.state.OpeningTime,
            ClosingTime: this.state.CloseTiming,
            Points: '0',
            MaxTableSize: this.RMaxTable,
            MinTableSize: this.RMinTable,
            EstimatesWait: this.state.chosenEstimateTime,
            InitialSetup: '1',
            StreetAddress: this.RStreetAddress,
            ZipCode: this.RZipCode,
            City: this.RCity,
            Country: this.RCountry,
            CuisineType: this.state.cuisineTypes,
            Service: this.state.SelectedServices,
            Day: this.state.SelectDays,
            DeviceToken: this.state.Dtoken,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.message == 'Resturant Created') {
              AsyncStorage.setItem(
                'CurrentUserID',
                responseJson.ResturantInfoID.toString(),
              );
              let photo = { uri: this.state.imageData.uri };
              let formdata = new FormData();
              formdata.append('product[images_attributes[0][file]]', {
                uri: photo.uri,
                name:
                  responseJson.ResturantInfoID.toString() +
                  '.' +
                  a.toString().replace('=', ''),
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
                    loading: true,
                  });
                  console.log('image uploaded');
                  console.log(response);
                  this.props.navigation.navigate('TabNavigation', {
                    MaxTableSize: this.RMaxTable,
                    MinTableSize: this.RMinTable
                  });
                  AsyncStorage.setItem('isLogin', 'true');
                })
                .catch(err => {
                  console.log(err);
                });
            } else {
              Alert.alert('Alert', responseJson.message, [{ text: 'Ok' }]);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  closeReasonModel1 = () => {
    this.setState({
      isVisible1: false,
    });
  };

  openReasonModel1 = () => {
    this.setState({
      isVisible1: true,
    });
  };

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
      if (this.state.cuisineTypes == '') {
        this.setState({
          cuisineTypes: this.state.cuisineTypes + item.key,
        });
      } else {
        this.setState({
          cuisineTypes: this.state.cuisineTypes + ',' + item.key,
        });
      }
    } else if (checked[index] == false) {
      if (this.state.cuisineTypes.includes(item.key + ',') == true) {
        var SampleText = this.state.cuisineTypes.toString();
        this.setState({
          cuisineTypes: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.cuisineTypes.includes(',' + item.key) == true) {
        var SampleText = this.state.cuisineTypes.toString();
        this.setState({
          cuisineTypes: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.cuisineTypes.includes(item.key) == true) {
        var SampleText = this.state.cuisineTypes.toString();
        this.setState({
          cuisineTypes: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    var date = new Date(date);
    this.hideDateTimePicker();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      OpeningTime: hours + ':' + minutes + ':' + '00',
    });
    AsyncStorage.setItem("openingTime", this.state.OpeningTime);
  };

  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };

  handleDatePicked1 = date => {
    var date = new Date(date);
    this.hideDateTimePicker1();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      CloseTiming: hours + ':' + minutes + ':' + '00',
    });
    AsyncStorage.setItem("closingTime", this.state.CloseTiming);
  };

  openTimePicker = () => {
    this.setState({
      showTimePicker: true,
    });
  };

  closeTimePicker = () => {
    this.setState({
      showTimePicker: false,
    });
  };

  handleChange1 = (index, item) => {
    let checked1 = [...this.state.checked1];
    checked1[index] = !checked1[index];
    this.setState({ checked1 });
    if (checked1[index] == true) {
      if (this.state.SelectDays == '') {
        this.setState({
          SelectDays: this.state.SelectDays + item.key,
        });
      } else {
        this.setState({
          SelectDays: this.state.SelectDays + ',' + item.key,
        });
      }
    } else if (checked1[index] == false) {
      if (this.state.SelectDays.includes(item.key + ',') == true) {
        var SampleText = this.state.SelectDays.toString();
        this.setState({
          SelectDays: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.SelectDays.includes(',' + item.key) == true) {
        var SampleText = this.state.SelectDays.toString();
        this.setState({
          SelectDays: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.SelectDays.includes(item.key) == true) {
        var SampleText = this.state.SelectDays.toString();
        this.setState({
          SelectDays: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  handleChange2 = (index, item) => {
    let checked2 = [...this.state.checked2];
    checked2[index] = !checked2[index];
    this.setState({ checked2 });
    if (checked2[index] == true) {
      if (this.state.SelectedServices == '') {
        this.setState({
          SelectedServices: this.state.SelectedServices + item.key,
        });
      } else {
        this.setState({
          SelectedServices: this.state.SelectedServices + ',' + item.key,
        });
      }
    } else if (checked2[index] == false) {
      if (this.state.SelectedServices.includes(item.key + ',') == true) {
        var SampleText = this.state.SelectedServices.toString();
        this.setState({
          SelectedServices: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.SelectedServices.includes(',' + item.key) == true) {
        var SampleText = this.state.SelectedServices.toString();
        this.setState({
          SelectedServices: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.SelectedServices.includes(item.key) == true) {
        var SampleText = this.state.SelectedServices.toString();
        this.setState({
          SelectedServices: SampleText.replace(item.key, ''),
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
          <ScrollView>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode="time"
            />
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible1}
              onConfirm={this.handleDatePicked1}
              onCancel={this.hideDateTimePicker1}
              mode="time"
            />
            <ScrollView>
              {/* first page */}
              {this.state.flag1 ? (
                <View style={styles.view2}>
                  {/* First Heading */}
                  <Text style={styles.text1}>
                    You are just a few more steps away!
                  </Text>

                  {/* Screen dots Section */}
                  <View style={styles.view4}>
                    <View style={styles.dot1} />
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                  </View>

                  {/* Resturant Image upload section */}
                  <View style={styles.view3}>
                    <Image
                      source={this.state.avatarSource}
                      style={styles.img1}
                    />
                    <TouchableOpacity
                      style={styles.plusBtn}
                      onPress={this.chooseFile.bind(this)}>
                      <Text style={styles.plusBtntext}>+</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Resturant Name input section */}

                  <TextInput
                    style={styles.input1}
                    placeholder="Enter restaurant name"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.ResturantName = text)}
                  />

                  {/* Phone number input section */}

                  <TextInput
                    style={styles.input1}
                    placeholder="Enter phone number"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RphoneNumber = text)}
                    keyboardType={'numeric'}
                  />

                  {/* Address input section */}

                  <Text style={styles.text2}>Address</Text>
                  <TextInput
                    style={styles.input2}
                    autoCorrect={false}
                    placeholder="Enter street address"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RStreetAddress = text)}
                  />
                  <TextInput
                    style={styles.input2}
                    placeholder="Enter Zip code"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RZipCode = text)}
                    maxLength={5}
                    keyboardType={'numeric'}
                  />
                  <TextInput
                    style={styles.input2}
                    placeholder="Enter City"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RCity = text)}
                  />
                  <TextInput
                    style={styles.input2}
                    placeholder="Enter Country"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RCountry = text)}
                  />

                  {/* next btn section */}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.nextBtn}
                    onPress={() => this.onClickflag1Next()}>
                    <Text style={styles.nextBtntext}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* second Page */}

              {this.state.flag2 ? (
                <View style={styles.view2}>
                  <Modal
                    isVisible={this.state.isVisible1}
                    animationOutTiming={1}
                    animationInTiming={1}
                    backdropOpacity={0.7}
                    style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <View
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        height: 550,
                        width: '90%',
                        backgroundColor: '#2B3252',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.text7}>Select Cuisine Type</Text>
                      <ScrollView
                        // eslint-disable-next-line react-native/no-inline-styles
                        style={{
                          width: '100%',
                          marginTop: 10,
                        }}>
                        <FlatList
                          data={[
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
                          ]}
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

                  {/* First Heading */}
                  <Text style={styles.text1}>
                    You are just a few more steps away!
                  </Text>

                  {/* Screen dots Section */}
                  <View style={styles.view4}>
                    <View style={styles.dot2} />
                    <View style={styles.dot1} />
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                  </View>

                  <TextInput
                    style={styles.input1}
                    placeholder="Enter Inauguration year"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RInaugurationYear = text)}
                    keyboardType={'numeric'}
                  />
                  <TextInput
                    style={styles.input1}
                    placeholder="Select Cuisine type"
                    placeholderTextColor="#A3a3a3"
                    value={this.state.cuisineTypes}
                    onTouchStart={() => this.openReasonModel1()}
                  />
                  <Text style={styles.text2}>Descriptions</Text>
                  <TextInput
                    multiline={true}
                    style={styles.input3}
                    // onChangeText={text => (this.Remarks = text)}
                    onChangeText={text => (this.RDescription = text)}
                  />
                  <TextInput
                    style={styles.input1}
                    placeholder="Choose Dining Style"
                    placeholderTextColor="#A3a3a3"
                    onChangeText={text => (this.RDiningStyle = text)}
                  />
                  <View style={styles.view5}>
                    <Text style={styles.text3}>Max Table Size:</Text>
                    <TextInput
                      style={styles.input4}
                      placeholder="00"
                      placeholderTextColor="#A3a3a3"
                      onChangeText={text => (this.RMaxTable = text)}
                    />
                  </View>
                  <View style={styles.view5}>
                    <Text style={styles.text3}>Min Table Size:</Text>
                    <TextInput
                      style={styles.input4}
                      placeholder="00"
                      placeholderTextColor="#A3a3a3"
                      onChangeText={text => (this.RMinTable = text)}
                    />
                  </View>
                  {/* next btn section */}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.nextBtn}
                    onPress={() => this.onClickflag2Next()}>
                    <Text style={styles.nextBtntext}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Third Page */}

              {this.state.flag3 ? (
                <View style={styles.view2}>
                  <Text style={styles.text1}>
                    You are just a few more steps away!
                  </Text>

                  {/* Screen dots Section */}
                  <View style={styles.view4}>
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                    <View style={styles.dot1} />
                    <View style={styles.dot2} />
                  </View>

                  {/* timing section */}
                  <View style={styles.view6}>
                    {/* opening time Section */}
                    <View style={styles.view7}>
                      <Text style={styles.text4}>Opening time</Text>
                      <TextInput
                        style={styles.input5}
                        placeholder="8:00AM"
                        placeholderTextColor="#d0cece"
                        onTouchStart={() => this.showDateTimePicker()}
                        value={this.state.OpeningTime}
                      />
                    </View>

                    {/* Close time Section */}

                    <View style={styles.view7}>
                      <Text style={styles.text4}>Closing time</Text>
                      <TextInput
                        style={styles.input5}
                        placeholder="8:00AM"
                        placeholderTextColor="#d0cece"
                        onTouchStart={() => this.showDateTimePicker1()}
                        value={this.state.CloseTiming}
                      />
                    </View>
                  </View>

                  {/* estimate time Section */}
                  <View style={styles.view8}>
                    <Text style={styles.text5}>Estimated wait time</Text>
                    <TouchableOpacity onPress={() => this.openTimePicker()}>
                      <Text style={styles.text6}>
                        {this.state.chosenEstimateTime}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.text3}>Days Open</Text>

                  {/* day Check Box Section */}
                  <View style={styles.view9}>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      data={[
                        { key: 'Monday' },
                        { key: 'Tuesday' },
                        { key: 'Wednesday' },
                        { key: 'Thursday' },
                        { key: 'Friday' },
                        { key: 'Saturday' },
                        { key: 'Sunday' },
                      ]}
                      extraData={this.state}
                      renderItem={({ item, index }) => (
                        <CheckBox
                          style={styles.checkbox3}
                          onClick={() => {
                            this.handleChange1(index, item);
                          }}
                          rightText={item.key}
                          rightTextStyle={styles.checkboxtext}
                          isChecked={this.state.checked1[index]}
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

                  {/* next btn section */}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.nextBtn}
                    onPress={() => this.onClickflag3Next()}>
                    <Text style={styles.nextBtntext}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Fourth Page section */}
              {this.state.flag4 ? (
                <View style={styles.view2}>
                  <Text style={styles.text1}>
                    You are just a few more steps away!
                  </Text>

                  {/* Screen dots Section */}
                  <View style={styles.view4}>
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                    <View style={styles.dot2} />
                    <View style={styles.dot1} />
                  </View>
                  <Text style={styles.text3}>Services</Text>

                  {/* service check box section */}
                  <View style={styles.view10}>
                    <FlatList
                      data={[
                        { key: 'Street Parking' },
                        { key: 'Valet Parking' },
                        { key: 'Outdoor seating' },
                        { key: 'Good for groups' },
                        { key: 'Good for kids' },
                        { key: 'Serves Breakfast' },
                        { key: 'Serves Lunch' },
                        { key: 'Serves Dinner' },
                        { key: 'Playing area' },
                      ]}
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
                  {/* next btn section */}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.nextBtn}
                    onPress={() => this.onClickFinishBtn()}>
                    <Text style={styles.nextBtntext}>Finish</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>
            {this.state.showTimePicker ? (
              <View style={styles.timePickerStyle}>
                <TouchableOpacity
                  style={styles.donebtn}
                  onPress={() => this.closeTimePicker()}>
                  <Text style={styles.donebtnText}>Done</Text>
                </TouchableOpacity>

                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.state.chosenEstimateTime}
                  onValueChange={(itemValue, itemPosition) => {
                    console.log(itemValue);
                    this.setState({
                      chosenEstimateTime: itemValue,
                      choosenIndex: itemPosition,
                    });
                  }}>
                  {this.state.timeDataArray.map((item, index) => {
                    return <Picker.Item label={item} value={item} />;
                  })}
                </Picker>

                {/* <Picker
                values={this.state.timeDataArray}
                selected={this.state.language3}
                style={{width: '100%', height: 200}}
                enableInput={false}
                onSelect={(value, index) => {
                  this.setState({chosenEstimateTime: value});
                  this.setState({language3: index});
                }}
              /> */}
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      );
    }
  }
}
