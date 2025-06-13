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
import { Picker } from '@react-native-picker/picker';
import CheckBox from 'react-native-check-box';
import styles from './EditDescriptionStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class EditDescriptionVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Edit Description',
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
      loading: true,
      dataArray: [],
      checked1: [],
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      timeDataArray: ['10', '20', '30', '40'],
      chosenEstimateTime: '10',
      OpeningTime: '8:00AM',
      CloseTiming: '8:00AM',
      OpenDays: '',
      openDaysArray: [
        { key: 'Monday' },
        { key: 'Tuesday' },
        { key: 'Wednesday' },
        { key: 'Thursday' },
        { key: 'Friday' },
        { key: 'Saturday' },
        { key: 'Sunday' },
      ],
      CurrentResID: '',
    };
  }

  componentWillMount() {
    this.props.navigation.setParams({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.saveBtn}
          onPress={this.onClickSave}>
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

  // getting resturant data
  getResturantData = () => {
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoByResID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({
          dataArray: responseJson[0].ResturantInfo,
          OpeningTime: responseJson[0].ResturantInfo.OpeningTime,
          CloseTiming: responseJson[0].ResturantInfo.ClosingTime,
          chosenEstimateTime: responseJson[0].ResturantInfo.EstimatesWait,
          loading: false,
        });
        for (
          let i = 0;
          i < Object.values(responseJson[0].OpenDays).length;
          i++
        ) {
          for (
            let j = 0;
            j < Object.values(this.state.openDaysArray).length;
            j++
          ) {
            if (
              this.state.openDaysArray[j].key ==
              responseJson[0].OpenDays[i].DayTitle
            ) {
              let newArray = [...this.state.checked1];
              newArray[j] = true;
              this.setState({ checked1: newArray });
            }
          }

          if (Object.values(responseJson[0].OpenDays).length - 1 == i) {
            this.setState({
              OpenDays:
                this.state.OpenDays + responseJson[0].OpenDays[i].DayTitle,
            });
          } else {
            this.setState({
              OpenDays:
                this.state.OpenDays +
                responseJson[0].OpenDays[i].DayTitle +
                ',',
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // show date picker
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
  // hide date picker
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };
  // handle date picker
  handleDatePicked = date => {
    var date = new Date(date);
    this.hideDateTimePicker();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      OpeningTime: hours + ':' + minutes + ':' + '00',
    });
  };

  // show time picker
  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  // hide time picker
  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };

  // handle date picker
  handleDatePicked1 = date => {
    var date = new Date(date);
    this.hideDateTimePicker1();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      CloseTiming: hours + ':' + minutes + ':' + '00',
    });
  };

  // open time picker
  openTimePicker = () => {
    this.setState({
      showTimePicker: true,
    });
  };

  // click time picker
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
      if (this.state.OpenDays == '') {
        this.setState({
          OpenDays: this.state.OpenDays + item.key,
        });
      } else {
        this.setState({
          OpenDays: this.state.OpenDays + ',' + item.key,
        });
      }
    } else if (checked1[index] == false) {
      if (this.state.OpenDays.includes(item.key + ',') == true) {
        var SampleText = this.state.OpenDays.toString();
        this.setState({
          OpenDays: SampleText.replace(item.key + ',', ''),
        });
      } else if (this.state.OpenDays.includes(',' + item.key) == true) {
        var SampleText = this.state.OpenDays.toString();
        this.setState({
          OpenDays: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.OpenDays.includes(item.key) == true) {
        var SampleText = this.state.OpenDays.toString();
        this.setState({
          OpenDays: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  // on click save edit data
  onClickSave = () => {
    var minTable = this.state.dataArray.MinTableSize;
    var maxTable = this.state.dataArray.MaxTableSize;
    var descrip = this.state.dataArray.Description;

    if (this.maxTabelSize != undefined) {
      maxTable = this.maxTabelSize;
    }
    if (this.minTabelSize != undefined) {
      minTable = this.minTabelSize;
    }
    if (this.Description != undefined) {
      descrip = this.Description;
    }

    if (
      (minTable == '' || maxTable == '' || descrip == '',
        this.state.OpenDays == '')
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
          Day: this.state.OpenDays,
          MaxTableSize: maxTable,
          MinTableSize: minTable,
          OpeningTime: this.state.OpeningTime,
          ClosingTime: this.state.CloseTiming,
          EstimatesWait: this.state.chosenEstimateTime,
          Description: descrip,
          ResturantInfoID: this.state.CurrentResID,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson)
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
          {/* <ScrollView> */}
          <View style={styles.view10}>
            <Text style={styles.text33}>Max Table Size</Text>
            <TextInput
              style={styles.input6}
              placeholder="00"
              placeholderTextColor="#d0cece"
              onChangeText={text => (this.maxTabelSize = text)}
              defaultValue={this.state.dataArray.MaxTableSize}
              keyboardType={'numeric'}
            />
          </View>
          <View style={styles.view10}>
            <Text style={styles.text33}>Min Table Size</Text>
            <TextInput
              style={styles.input6}
              placeholder="00"
              placeholderTextColor="#d0cece"
              onChangeText={text => (this.minTabelSize = text)}
              defaultValue={this.state.dataArray.MinTableSize}
              keyboardType={'numeric'}
            />
          </View>

          {/* estimate time Section */}
          <View style={styles.view101}>
            <Text style={styles.text33}>Estimated wait time</Text>
            <TouchableOpacity
              style={styles.view111}
              onPress={() => this.openTimePicker()}>
              <Text style={styles.text66}>{this.state.chosenEstimateTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.view6}>
            {/* opening time Section */}
            <View style={styles.view7}>
              <Text style={styles.text33}>Opening time</Text>
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
              <Text style={styles.text33}>Closing time</Text>
              <TextInput
                style={styles.input5}
                placeholder="8:00AM"
                placeholderTextColor="#d0cece"
                onTouchStart={() => this.showDateTimePicker1()}
                value={this.state.CloseTiming}
              />
            </View>
          </View>

          <View style={styles.view12}>
            <Text style={styles.text33}>Descriptions</Text>
            <TextInput
              multiline={true}
              style={styles.input3}
              onChangeText={text => (this.Description = text)}
              defaultValue={this.state.dataArray.Description}
            />
          </View>

          <View style={styles.view11}>
            <Text style={styles.text33}>Days Open</Text>
            {/* day Check Box Section */}
            <View style={styles.view9}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={this.state.openDaysArray}
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
          </View>

          {/* Save btn section */}
          {/* <TouchableOpacity
            activeOpacity={0.5}
            style={styles.nextBtn}
            onPress={() => this.onClickSave()}>
            <Text style={styles.nextBtntext}>Save</Text>
          </TouchableOpacity> */}
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
            </View>
          ) : null}
        </ScrollView>
      );
    }
  }
}
