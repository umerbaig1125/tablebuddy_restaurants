/** @format */

import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './AddTimingStyle';
import { ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import Swipeout from 'react-native-swipeout';
// import DateTimePicker from '@react-native-community/datetimepicker';

var dayopenID1;
var dayopenID2;
var ShiftId2;

export default class AddTimingVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Add Timing',
      headerStyle: {
        backgroundColor: '#C16563',
      },
      headerTintColor: '#E5E5E5',
      headerTitleStyle: {
        fontWeight: '600',
        color: '#E5E5E5',
        fontSize: 18,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      ShiftArray: [],
      CurrentResID: '',
      isVisible1: false,
      isVisible2: false,
      OpeningTime: '8:00AM',
      CloseTiming: '8:00AM',
      OpeningTime1: '8:00AM',
      CloseTiming1: '8:00AM',
      isChecked: false,
      allIds: '',
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisibl2: false,
      isDateTimePickerVisible3: false,
      loading: true,
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

  // handle back button
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
        this.getResturantShift();
      });
    });
  }

  // getting resturant sifts
  getResturantShift = () => {
    this.setState({
      allIds: '',
    });
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoByResID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log("shift responnse", responseJson[0])
        console.log("shiftArray", responseJson[0].OpenDays)
        this.setState({
          ShiftArray: responseJson[0].OpenDays,
          loading: false,
        });
        for (
          let i = 0;
          i < Object.values(responseJson[0].OpenDays).length;
          i++
        ) {
          this.setState({
            allIds: this.state.allIds.concat(
              responseJson[0].OpenDays[i].DaysOpenID + ',',
            ),
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // add new shift
  AddNewShift = e => {
    dayopenID1 = e;
    this.setState({
      isVisible2: true,
    });
  };

  // edit shifts
  EditShift = (e1, e2, e3, e4) => {
    dayopenID2 = e1;
    ShiftId2 = e2;
    this.setState({
      isVisible1: true,
      OpeningTime1: e4,
      CloseTiming1: e3,
    });
  };

  // close edit shift modal
  onclickCloseEditShiftModal = e => {
    this.setState({
      isVisible1: false,
    });
  };

  // close add new shift modal
  onclickCloseAddNewShiftModal = e => {
    this.setState({
      isVisible2: false,
      OpeningTime: '8:00AM',
      CloseTiming: '8:00AM',
      isChecked: false,
    });
  };

  // show date pciker
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
    AsyncStorage.setItem("openingTime", this.state.OpeningTime);
  };

  // show time picker
  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  // hide time picker
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

  // show date picker
  showDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: true });
  };

  // hide date picker
  hideDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: false });
  };

  // handle date pciker
  handleDatePicked2 = date => {
    var date = new Date(date);
    this.hideDateTimePicker2();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      OpeningTime1: hours + ':' + minutes + ':' + '00',
    });
    AsyncStorage.setItem("openingTime1", this.state.OpeningTime1);
  };

  // show time picker
  showDateTimePicker3 = () => {
    this.setState({ isDateTimePickerVisible3: true });
  };

  // hide date picker
  hideDateTimePicker3 = () => {
    this.setState({ isDateTimePickerVisible3: false });
  };

  // handle date picker
  handleDatePicked3 = date => {
    var date = new Date(date);
    this.hideDateTimePicker3();
    var hours = ('0' + date.getHours()).slice(-2);
    var minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      CloseTiming1: hours + ':' + minutes + ':' + '00',
    });
    AsyncStorage.setItem("closeTime1", this.state.CloseTiming1);
  };

  // sava new shift
  onClickAddNewSave = () => {
    if (this.state.isChecked == true) {
      if (this.state.CloseTiming == '' || this.state.OpeningTime == '') {
        Alert.alert('Please Select Both Time');
      } else {
        if (this.state.OpeningTime == this.state.CloseTiming) {
          Alert.alert('opening and closing time must be different');
        } else {
          fetch('http://' + global.AmeIp + '//api/Resturant/SaveShift/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ResturantInfoID: this.state.CurrentResID,
              DaysOpenID: this.state.allIds.slice(0, -1),
              OpeningTime: this.state.OpeningTime,
              ClosingTime: this.state.CloseTiming,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.message == 'shift Added') {
                this.getResturantShift();
                this.setState({
                  isVisible2: false,
                  OpeningTime: '8:00AM',
                  CloseTiming: '8:00AM',
                  isChecked: false,
                  allIds: '',
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
    } else {
      if (this.state.CloseTiming == '' || this.state.OpeningTime == '') {
        Alert.alert('Please Select Both Time');
      } else {
        if (this.state.OpeningTime == this.state.CloseTiming) {
          Alert.alert('Please enter correct opening and closing time');
        } else {
          fetch('http://' + global.AmeIp + '//api/Resturant/SaveShift/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ResturantInfoID: this.state.CurrentResID,
              DaysOpenID: dayopenID1,
              OpeningTime: this.state.OpeningTime,
              ClosingTime: this.state.CloseTiming,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.message == 'shift Added') {
                this.getResturantShift();
                this.setState({
                  isVisible2: false,
                  OpeningTime: '8:00AM',
                  CloseTiming: '8:00AM',
                  isChecked: false,
                  allIds: '',
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
    }
  };

  // save edit shift
  onClickEditSave = () => {
    fetch('http://' + global.AmeIp + '//api/Resturant/UpdateShift/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResturantInfoID: this.state.CurrentResID,
        DaysOpenID: dayopenID2,
        OpeningTime: this.state.OpeningTime1,
        ClosingTime: this.state.CloseTiming1,
        ShiftID: ShiftId2,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'shift Updated') {
          this.getResturantShift();
          this.setState({
            isVisible1: false,
          });
        } else {
          Alert.alert(responseJson.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // convert time 12 to 24 hours
  convertTime12to24 = time12h => {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  };

  // convert time 24 to 12
  timeTo12HrFormat(time) {
    // Take a time in 24 hour format and format it in 12 hour format
    var time_part_array = time.split(':');
    var ampm = 'AM';

    if (time_part_array[0] >= 12) {
      ampm = 'PM';
    }

    if (time_part_array[0] > 12) {
      time_part_array[0] = time_part_array[0] - 12;
    }

    // eslint-disable-next-line no-undef
    formatted_time =
      time_part_array[0] +
      ':' +
      time_part_array[1] +
      ':' +
      time_part_array[2] +
      ' ' +
      ampm;

    // eslint-disable-next-line no-undef
    return formatted_time;
  }

  // delete shift
  // onClickDeleteShift = (e1, e2, e3) => {
  //   console.log("e3", e3)
  //   console.log("e1", e1)
  //   console.log("e2", e2)
  //   console.log("OpeningTime", this.state.OpeningTime)
  //   console.log("ClosingTime", this.state.CloseTiming)
  //   console.log("OpeningTime 1", this.state.OpeningTime1)
  //   console.log("ClosingTime 2", this.state.CloseTiming1)
  //   if (e3 == 0) {
  //     Alert.alert('You Should Have Atleast One Shift In A Day');
  //   } else {
  //     fetch('http://' + global.AmeIp + '//api/Resturant/DeleteShift/', {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         ShiftID: e1,
  //         DaysOpenID: e2,
  //       }),
  //     })
  //       .then(response => response.json())
  //       .then(responseJson => {
  //         if (responseJson.message == 'shift Delete') {
  //           this.getResturantShift();
  //         } else {
  //           Alert.alert(responseJson.message);
  //         }
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }
  // };

  onClickDeleteShift = (shiftIdToDelete, daysOpenID, indexOfShiftToDelete) => {
    // Find the specific day in ShiftArray
    const dayIndex = this.state.ShiftArray.findIndex(
      day => day.DaysOpenID === daysOpenID
    );

    if (dayIndex !== -1) {
      const currentDayShifts = this.state.ShiftArray[dayIndex].OpenDayShift;

      // Check if this is the last shift for the day
      if (currentDayShifts.length <= 1) {
        Alert.alert('You Should Have Atleast One Shift In A Day');
        return; // Stop the function if it's the last shift
      }
    }

    // If not the last shift, proceed with deletion
    fetch('http://' + global.AmeIp + '//api/Resturant/DeleteShift/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ShiftID: shiftIdToDelete,
        DaysOpenID: daysOpenID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message === 'shift Delete') {
          this.getResturantShift(); // Refresh data after successful deletion
        } else {
          Alert.alert(responseJson.message);
        }
      })
      .catch(error => {
        console.error(error);
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
        <ScrollView style={styles.view1}>
          {/* Edit shift Model */}
          <Modal
            isVisible={this.state.isVisible1}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickCloseEditShiftModal()}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 240,
                width: '85%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onclickCloseEditShiftModal()}
                style={styles.CancleboostItemModel}>
                <Text style={styles.CancleboostItemModeltext}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text4}>Edit Shift</Text>
              <View style={styles.view7}>
                {/* opening time Section */}
                <View style={styles.view8}>
                  <Text style={styles.text5}>Opening time</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view9}
                    onPress={() => this.showDateTimePicker2()}>
                    <Text style={styles.text3}>
                      {this.timeTo12HrFormat(this.state.OpeningTime1).replace(
                        ':00',
                        '',
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Close time Section */}

                <View style={styles.view8}>
                  <Text style={styles.text5}>Closing time</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view9}
                    onPress={() => this.showDateTimePicker3()}>
                    <Text style={styles.text3}>
                      {this.timeTo12HrFormat(this.state.CloseTiming1).replace(
                        ':00',
                        '',
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.btn2}
                onPress={() => this.onClickEditSave()}>
                <Text style={styles.btn2text}>Save</Text>
              </TouchableOpacity>
            </View>

            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible2}
              onConfirm={this.handleDatePicked2}
              onCancel={this.hideDateTimePicker2}
              mode="time"
            />
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible3}
              onConfirm={this.handleDatePicked3}
              onCancel={this.hideDateTimePicker3}
              mode="time"
            />
          </Modal>

          {/* add New shift Model */}
          <Modal
            isVisible={this.state.isVisible2}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickCloseAddNewShiftModal()}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 300,
                width: '85%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onclickCloseAddNewShiftModal()}
                style={styles.CancleboostItemModel}>
                <Text style={styles.CancleboostItemModeltext}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text4}>Add New Shift</Text>
              <View style={styles.view7}>
                {/* opening time Section */}
                <View style={styles.view8}>
                  <Text style={styles.text5}>Opening time</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view9}
                    onPress={() => this.showDateTimePicker()}>
                    <View style={styles.view10}>
                      {/* <Text style={styles.text3}>
                        {this.timeTo12HrFormat(this.state.OpeningTime).replace(
                          ':00',
                          '',
                        )}
                      </Text> */}
                      <Text style={styles.text3}>
                        {this.state.OpeningTime}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Close time Section */}

                <View style={styles.view8}>
                  <Text style={styles.text5}>Closing time</Text>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view9}
                    onPress={() => this.showDateTimePicker1()}>
                    <View style={styles.view10}>
                      {/* <Text style={styles.text3}>
                        {this.timeTo12HrFormat(this.state.CloseTiming).replace(
                          ':00',
                          '',
                        )}
                      </Text> */}
                      <Text style={styles.text3}>
                        {this.state.CloseTiming}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <CheckBox
                style={styles.checkbox}
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                  });
                }}
                rightText={'Apply on all days'}
                rightTextStyle={styles.checkboxtext}
                isChecked={this.state.isChecked}
                checkedImage={
                  <Image
                    source={require('../Assets/image4.png')}
                    style={styles.img2}
                  />
                }
                unCheckedImage={
                  <Image
                    source={require('../Assets/image3.png')}
                    style={styles.img2}
                  />
                }
              />

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.btn3}
                onPress={() => this.onClickAddNewSave()}>
                <Text style={styles.btn2text}>Save</Text>
              </TouchableOpacity>
            </View>

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
          </Modal>

          {/* list of shift section */}
          <View>
            <FlatList
              data={this.state.ShiftArray}
              extraData={this.state}
              renderItem={({ item, index }) => (
                <View style={styles.view6}>
                  <View style={styles.view2}>
                    <Text style={styles.text1}>{item.DayTitle}</Text>
                    <TouchableOpacity
                      style={styles.btn1}
                      onPress={() => this.AddNewShift(item.DaysOpenID)}>
                      <Image
                        source={require('../Assets/add.png')}
                        style={styles.img1}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.view3}>
                    <FlatList
                      data={item.OpenDayShift}
                      extraData={this.state}
                      renderItem={({ item, index }) => (
                        <Swipeout
                          autoClose="true"
                          right={[
                            {
                              text: 'Delete',
                              color: 'white',
                              backgroundColor: '#FF5F5F',
                              onPress: () => {
                                this.onClickDeleteShift(
                                  item.ShiftID,
                                  item.DaysOpenID,
                                  index,
                                );
                              },
                            },
                          ]}
                          style={styles.leftSwip}>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.view4}
                            onPress={() =>
                              this.EditShift(
                                item.DaysOpenID,
                                item.ShiftID,
                                item.ClosingTime,
                                item.OpeningTime,
                              )
                            }>
                            <View style={styles.view5}>
                              <Text style={styles.text2}>Opening Time</Text>
                              <Text style={styles.text3}>
                                {this.timeTo12HrFormat(
                                  item.OpeningTime,
                                ).replace(':00', '')}
                              </Text>
                            </View>
                            <View style={styles.view5}>
                              <Text style={styles.text2}>Closing Time</Text>
                              <Text style={styles.text3}>
                                {this.timeTo12HrFormat(
                                  item.ClosingTime,
                                ).replace(':00', '')}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </Swipeout>
                      )}
                    />
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
      );
    }
  }
}
