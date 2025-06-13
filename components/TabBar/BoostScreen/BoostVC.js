import React, { Component } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import styles from './BoostStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import CountDown from 'react-native-countdown-component';
import DateTimePicker from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';
import Moment from 'moment';

export default class BoostVC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      flag1: true,
      flag2: false,
      flag3: false,
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      startSelectedTimer: '00:00:00',
      startSelectedDate: '',
      endSelectedTimer: '00:00:00',
      endSelectedDate: '',

      startSelectedTimerOfMenu: '00:00:00',
      startSelectedDateOfMenu: '',
      endSelectedTimerOfMenu: '00:00:00',
      endSelectedDateOfMenu: '',

      isPromotionActive: false,
      isPromotionNotActive: false,
      isPromotionUpcoming: false,
      restID: '',
      promotionID: '',
      CountDown: '',
      menuArray: [],
      isVisible1: false,
      checked1: [],
      SelectPromotionType: '',
      typeCount: 0,
      MenuID: '',
      boostHistoryArray: [],
      RunningPromotion: [],
      RunningPromotionAmount: '',
      RunningPromotionName: '',
    };
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      this.setState({
        flag1: true,
        flag2: false,
        flag3: false,
      });
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          restID: e,
        });
        this.CheckPromotionFnc();
        this.GetMenuFnc();
        this.GetBoostHistory();
      });
    });
  }

  // on click all menu boost option
  onClickBoost = () => {
    this.setState({
      flag1: true,
      flag2: false,
      flag3: false,
    });
  };

  // on click item discount option
  onClickBoostItem = () => {
    this.setState({
      flag1: false,
      flag2: true,
      flag3: false,
    });
  };

  // on click boost history option
  onClickBoostHistroy = () => {
    this.GetBoostHistory();
    this.setState({
      flag1: false,
      flag2: false,
      flag3: true,
    });
  };

  // count down func
  onDoneCountdown = () => {
    this.setState({
      isPromotionActive: false,
      isPromotionNotActive: true,
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
    // eslint-disable-next-line no-undef
    hours = ('0' + date.getHours()).slice(-2);
    // eslint-disable-next-line no-undef
    minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      // eslint-disable-next-line no-undef
      startSelectedTimer: hours + ':' + minutes + ':' + '00',
      startSelectedDate: moment(new Date(date.toString().substr(0, 16))).format(
        'YYYY-MM-DD',
      ),
    });
  };

  // show date picker
  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  // hide date picker
  hideDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: false });
  };

  // handle date picker
  handleDatePicked1 = date => {
    var date = new Date(date);
    this.hideDateTimePicker1();
    // eslint-disable-next-line no-undef
    hours = ('0' + date.getHours()).slice(-2);
    // eslint-disable-next-line no-undef
    minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      // eslint-disable-next-line no-undef
      endSelectedTimer: hours + ':' + minutes + ':' + '00',
      endSelectedDate: moment(new Date(date.toString().substr(0, 16))).format(
        'YYYY-MM-DD',
      ),
    });
  };

  // show date picker
  showDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: true });
  };

  //hide date picker
  hideDateTimePicker2 = () => {
    this.setState({ isDateTimePickerVisible2: false });
  };

  //handle date picker
  handleDatePicked2 = date => {
    var date = new Date(date);
    this.hideDateTimePicker2();
    // eslint-disable-next-line no-undef
    hours = ('0' + date.getHours()).slice(-2);
    // eslint-disable-next-line no-undef
    minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      // eslint-disable-next-line no-undef
      startSelectedTimerOfMenu: hours + ':' + minutes + ':' + '00',
      startSelectedDateOfMenu: moment(
        new Date(date.toString().substr(0, 16)),
      ).format('YYYY-MM-DD'),
    });
  };

  //show date picker
  showDateTimePicker3 = () => {
    this.setState({ isDateTimePickerVisible3: true });
  };

  // hide date pikcer
  hideDateTimePicker3 = () => {
    this.setState({ isDateTimePickerVisible3: false });
  };

  // handle date picker
  handleDatePicked3 = date => {
    var date = new Date(date);
    this.hideDateTimePicker3();
    // eslint-disable-next-line no-undef
    hours = ('0' + date.getHours()).slice(-2);
    // eslint-disable-next-line no-undef
    minutes = ('0' + date.getMinutes()).slice(-2);
    this.setState({
      // eslint-disable-next-line no-undef
      endSelectedTimerOfMenu: hours + ':' + minutes + ':' + '00',
      endSelectedDateOfMenu: moment(
        new Date(date.toString().substr(0, 16)),
      ).format('YYYY-MM-DD'),
    });
  };

  // convert time 24 to 12 horus
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

  // on click start boost
  OnClickStartbtn = () => {
    this.setState({
      loading: true,
    });
    if (
      this.state.startSelectedTimer == '00:00:00' ||
      this.state.endSelectedTimer == '00:00:00' ||
      this.PAmount == undefined ||
      this.PAmount == ''
    ) {
      Alert.alert('Alert', 'Please fill all fields');
      this.setState({
        loading: false,
      });
    } else {
      fetch('http://' + global.AmeIp + '//api/Resturant/SavePromotion/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: this.state.restID,
          PromotionAmount: this.PAmount,
          PromotionStartTime:
            this.state.startSelectedDate + ' ' + this.state.startSelectedTimer,
          PromotionEndTime:
            this.state.endSelectedDate + ' ' + this.state.endSelectedTimer,
          Active: '0',
          PromotionType: 'Discount',
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            loading: false,
          });
          if (responseJson.message == 'Promotion Added') {
            fetch('http://' + global.AmeIp + '//api/Resturant/SendNotification/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ResturantInfoID: this.state.restID,
                PromotionType: 'Discount',
                PromotionAmount: this.PAmount,
              }),
            })
              .then(response => response.json())
              .then(responseJson => {
                console.log(responseJson);
              })
              .catch(error => {
                console.error(error);
              });

            this.CheckPromotionFnc();
            // this.setState({
            //   isPromotionActive: true,
            //   isPromotionNotActive: false,
            // });
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  // checking running promotion
  CheckPromotionFnc() {
    this.setState({
      loading: true,
    });
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetPromotionByResturantID?ResturantID=' +
      this.state.restID,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          loading: false,
        });
        console.log(responseJson);
        if (Object.values(responseJson).length == 0) {
          this.setState({
            isPromotionNotActive: true,
            isPromotionActive: false,
            isPromotionUpcoming: false,
          });
        } else {
          if (responseJson[0].PromotionStatus == 'Running') {
            var b = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            var a = moment(responseJson[0].EndTime);
            this.setState({
              isPromotionNotActive: false,
              isPromotionActive: true,
              isPromotionUpcoming: false,
              promotionID: responseJson[0].PromotionID,
              CountDown: a.diff(b, 'seconds'),
              RunningPromotion: responseJson[0],
            });
          } else if (responseJson[0].PromotionStatus == 'Upcoming') {
            var b = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            var a = moment(responseJson[0].EndTime);
            this.setState({
              isPromotionUpcoming: true,
              isPromotionNotActive: false,
              isPromotionActive: false,
              promotionID: responseJson[0].PromotionID,
              CountDown: a.diff(b, 'seconds'),
              RunningPromotion: responseJson[0],
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // on click stop running boost
  onClickStopBtn = () => {
    fetch('http://' + global.AmeIp + '//api/Resturant/UpdatePromotion/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResturantInfoID: this.state.restID,
        PromotionID: this.state.promotionID,
        Active: '0',
        PromotionStatus: 'Stop',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'Promotion Updated') {
          this.setState({
            isPromotionActive: false,
            isPromotionNotActive: true,
            isPromotionUpcoming: false,
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // get resturant menu fun
  GetMenuFnc() {
    fetch(
      'http://' + global.AmeIp + '//api/Menu/GetMenuByResturantID?ResturantID=' +
      this.state.restID,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          menuArray: responseJson,
          loading: false,
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // on click menu boost button
  onclickBoostMenuItem = e => {
    this.setState({
      isVisible1: true,
      MenuID: e,
    });
  };

  // on cick close boost menu button
  onclickCloseBoostMenuItem = e => {
    this.setState({
      isVisible1: false,
      checked1: [],
    });
  };

  handleChange1 = (index, item) => {
    let checked1 = [...this.state.checked1];
    checked1[index] = !checked1[index];
    this.setState({ checked1 });

    if (checked1[index] == true) {
      if (this.state.SelectPromotionType == '') {
        this.setState({
          SelectPromotionType: this.state.SelectPromotionType + item.key,
        });
      } else {
        this.setState({
          SelectPromotionType: this.state.SelectPromotionType + ',' + item.key,
        });
      }
    } else if (checked1[index] == false) {
      if (this.state.SelectPromotionType.includes(item.key + ',') == true) {
        var SampleText = this.state.SelectPromotionType.toString();
        this.setState({
          SelectPromotionType: SampleText.replace(item.key + ',', ''),
        });
      } else if (
        this.state.SelectPromotionType.includes(',' + item.key) == true
      ) {
        var SampleText = this.state.SelectPromotionType.toString();
        this.setState({
          SelectPromotionType: SampleText.replace(',' + item.key, ''),
        });
      } else if (this.state.SelectPromotionType.includes(item.key) == true) {
        var SampleText = this.state.SelectPromotionType.toString();
        this.setState({
          SelectPromotionType: SampleText.replace(item.key, ''),
        });
      }
    }
  };

  // save menu boost button
  SaveItemPromotion = () => {
    this.setState({
      loading: true,
    });
    if (
      this.state.startSelectedTimerOfMenu == '00:00:00' ||
      this.state.endSelectedTimerOfMenu == '00:00:00' ||
      this.state.SelectPromotionType == ''
    ) {
      Alert.alert('Alert', 'Please fill all fields');
      this.setState({
        loading: false,
      });
    } else {
      if (this.state.SelectPromotionType.includes(',') != true) {
        fetch('http://' + global.AmeIp + '//api/Resturant/SavePromotion/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ResturantInfoID: this.state.restID,
            PromotionStartTime:
              this.state.startSelectedDateOfMenu +
              ' ' +
              this.state.startSelectedTimerOfMenu,
            PromotionEndTime:
              this.state.endSelectedDateOfMenu +
              ' ' +
              this.state.endSelectedTimerOfMenu,
            Active: '0',
            PromotionType: this.state.SelectPromotionType,
            MenuID: this.state.MenuID,
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            this.setState({
              loading: false,
            });
            if (responseJson.message == 'Promotion Added') {
              fetch('http://' + global.AmeIp + '//api/Resturant/SendNotification/', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ResturantInfoID: this.state.restID,
                  PromotionType: this.state.SelectPromotionType,
                  MenuID: this.state.MenuID,
                }),
              })
                .then(response => response.json())
                .then(responseJson => {
                  console.log(responseJson);
                })
                .catch(error => {
                  console.error(error);
                });

              this.CheckPromotionFnc();
              this.setState({
                // isPromotionActive: true,
                // isPromotionNotActive: false,
                isVisible1: false,
                checked1: [],
                SelectPromotionType: '',
                startSelectedTimerOfMenu: '00:00:00',
                startSelectedDateOfMenu: '',
                endSelectedTimerOfMenu: '00:00:00',
                endSelectedDateOfMenu: '',
              });
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        Alert.alert('please Select Only One Type');
      }
    }
  };

  // getting promotion history
  GetBoostHistory() {
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetPromotionByResturantIDNActive?ResturantID=' +
      this.state.restID,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          boostHistoryArray: responseJson,
          loading: false,
        });
      })
      .catch(error => {
        console.error(error);
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
        <SafeAreaView style={styles.view1}>
          {/* modal for item boost */}
          <Modal
            isVisible={this.state.isVisible1}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickCloseBoostMenuItem()}
            style={{ alignItems: 'center', justifyContent: 'center' }}
            useNativeDriver={true}>
            <View
              style={{
                height: 330,
                width: '90%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <View
                style={{
                  width: '100%',
                  //marginTop: 10
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => this.onclickCloseBoostMenuItem()}
                  style={{
                    width: 40,
                    height: 40,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    //elevation: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopRightRadius: 20,
                  }}>
                  <Text style={styles.CancleboostItemModel}>X</Text>
                </TouchableOpacity>

                <View style={styles.view17}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view6}
                    onPress={() => this.showDateTimePicker2()}>
                    <View style={styles.view7}>
                      <Image
                        source={require('../../../components/Assets/stopwatch.png')}
                        style={styles.img1}
                      />
                      <Text style={styles.text2}>Start Date&Time</Text>
                      <Text style={styles.text3}>
                        {this.timeTo12HrFormat(
                          this.state.startSelectedTimerOfMenu,
                        ).replace(':00', '')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.line2} />

                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.view6}
                    onPress={() => this.showDateTimePicker3()}>
                    <View style={styles.view7}>
                      <Image
                        source={require('../../../components/Assets/stopwatch.png')}
                        style={styles.img1}
                      />
                      <Text style={styles.text2}>End Date&Time</Text>
                      <Text style={styles.text3}>
                        {this.timeTo12HrFormat(
                          this.state.endSelectedTimerOfMenu,
                        ).replace(':00', '')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={styles.text12}>Select Promotion Type</Text>
                {/* day Check Box Section */}
                <View style={styles.view18}>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[
                      { key: 'B1G1' },
                      { key: 'B1G2' },
                      { key: 'B2G1' },
                      { key: 'B2G2' },
                    ]}
                    extraData={this.state}
                    keyExtractor={(item, index) => item.key}
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
                            source={require('../../Assets/check.png')}
                            style={styles.img3}
                          />
                        }
                        unCheckedImage={
                          <Image
                            source={require('../../Assets/uncheck.png')}
                            style={styles.img3}
                          />
                        }
                      />
                    )}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                  //keyExtractor={(item, index) => index.toString()}
                  />
                </View>
                {/* Save btn section */}
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btnsave}
                  onPress={() => this.SaveItemPromotion()}>
                  <Text style={styles.nextBtntext}>Start Happy Hour</Text>
                </TouchableOpacity>
              </View>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible2}
              onConfirm={this.handleDatePicked2}
              onCancel={this.hideDateTimePicker2}
              mode="datetime"
            />
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible3}
              onConfirm={this.handleDatePicked3}
              onCancel={this.hideDateTimePicker3}
              mode="datetime"
            />
          </Modal>

          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
            mode="datetime"
          />
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible1}
            onConfirm={this.handleDatePicked1}
            onCancel={this.hideDateTimePicker1}
            mode="datetime"
          />

          {/* if promotion is active section */}

          {this.state.isPromotionActive ? (
            <View style={styles.CountView}>
              {this.state.RunningPromotion.PromotionType == 'Discount' ? (
                <Text style={styles.heading1}>
                  {this.state.RunningPromotion.PromotionAmount}% Discount on
                  Whole Menu
                </Text>
              ) : (
                <Text style={styles.heading1}>
                  {this.state.RunningPromotion.PromotionType} on{' '}
                  {this.state.RunningPromotion.Name}
                </Text>
              )}

              <CountDown
                until={this.state.CountDown}
                onFinish={this.onDoneCountdown}
                size={RFValue(25)}
                timeLabelStyle={{ color: '#E5E5E5', fontWeight: 'bold' }}
                digitStyle={{ backgroundColor: '#C16563' }}
                digitTxtStyle={{ color: '#E5E5E5' }}
              />
              {/* start btn */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.btn1}
                onPress={() => this.onClickStopBtn()}>
                <Text style={styles.text4}>Stop</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* if promotion is upcoming section */}
          {this.state.isPromotionUpcoming ? (
            <View style={styles.CountView}>
              <Text style={styles.heading4}>Upcoming Promotion</Text>
              {this.state.RunningPromotion.PromotionType == 'Discount' ? (
                <Text style={styles.heading3}>
                  {this.state.RunningPromotion.PromotionAmount}% Discount on
                  Whole Menu
                </Text>
              ) : (
                <Text style={styles.heading3}>
                  {this.state.RunningPromotion.PromotionType} on{' '}
                  {this.state.RunningPromotion.Name}
                </Text>
              )}
              {/* start btn */}
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.btn1}
                onPress={() => this.onClickStopBtn()}>
                <Text style={styles.text4}>Stop</Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {/* if there is no promotion section */}
          {this.state.isPromotionNotActive ? (
            <View>
              {/* tab bar -> boost, item boost, boost histroy */}
              <View style={styles.view2}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.view3}
                  onPress={this.onClickBoost}>
                  <Text style={styles.text1}>Menu Discount </Text>
                  {this.state.flag1 ? <View style={styles.line1} /> : null}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.view3}
                  onPress={this.onClickBoostItem}>
                  <Text style={styles.text1}>Item Discount</Text>
                  {this.state.flag2 ? <View style={styles.line1} /> : null}
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.view33}
                  onPress={this.onClickBoostHistroy}>
                  <Text style={styles.text1}>History</Text>
                  {this.state.flag3 ? <View style={styles.line1} /> : null}
                </TouchableOpacity>
              </View>

              <ScrollView>
                {/* Boost */}
                {this.state.flag1 ? (
                  <View>
                    {/* end time and start time */}
                    <View style={styles.view5}>
                      <TouchableOpacity
                        style={styles.view6}
                        onPress={() => this.showDateTimePicker()}>
                        <View style={styles.view7}>
                          <Image
                            source={require('../../../components/Assets/stopwatch.png')}
                            style={styles.img1}
                          />
                          <Text style={styles.text2}>Start Date&Time</Text>
                          <Text style={styles.text3}>
                            {this.timeTo12HrFormat(
                              this.state.startSelectedTimer,
                            ).replace(':00', '')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.line2} />
                      <TouchableOpacity
                        style={styles.view6}
                        onPress={() => this.showDateTimePicker1()}>
                        <View style={styles.view7}>
                          <Image
                            source={require('../../../components/Assets/stopwatch.png')}
                            style={styles.img1}
                          />
                          <Text style={styles.text2}>End Date&Time</Text>
                          <Text style={styles.text3}>
                            {this.timeTo12HrFormat(
                              this.state.endSelectedTimer,
                            ).replace(':00', '')}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      style={styles.input1}
                      placeholder="Enter Percentage Discount"
                      placeholderTextColor="#d0cece"
                      onChangeText={text => (this.PAmount = text)}
                      keyboardType={'numeric'}
                    />
                    {/* start btn */}
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={styles.btn1}
                      onPress={() => this.OnClickStartbtn()}>
                      <Text style={styles.text4}>Start Happy Hour</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* item Boost */}
                {this.state.flag2
                  ? (console.log(this.state.menuArray),
                    (
                      <View style={styles.view10}>
                        {Object.values(this.state.menuArray).length == 0 ? (
                          <View style={styles.ifnotMenu}>
                            <Text style={styles.heading2}>
                              No Menu in list for boost
                            </Text>
                          </View>
                        ) : (
                          <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={this.state.menuArray}
                            keyExtractor={(item, index) => item.Name}
                            renderItem={({ item }) => (
                              <View style={styles.view11}>
                                <View style={styles.view13}>
                                  <Text numberOfLines={1} style={styles.text6}>
                                    {item.Name}
                                  </Text>
                                  <Text numberOfLines={2} style={styles.text11}>
                                    {item.Description}
                                  </Text>
                                </View>
                                <View style={styles.view12}>
                                  <TouchableOpacity
                                    onPress={() =>
                                      this.onclickBoostMenuItem(item.MenuID)
                                    }>
                                    <Image
                                      source={require('../../../components/Assets/boost.png')}
                                      style={styles.img2}
                                    />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          />
                        )}
                      </View>
                    ))
                  : null}

                {/* History Boost */}
                {this.state.flag3 ? (
                  <View style={styles.view16}>
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      data={this.state.boostHistoryArray}
                      renderItem={({ item }) => (
                        <View style={styles.view14}>
                          <View style={styles.view15}>
                            {item.PromotionType == 'Discount' ? (
                              <Text style={styles.text7} numberOfLines={1}>
                                {item.PromotionAmount}% {item.PromotionType} on
                                Whole Menu
                              </Text>
                            ) : (
                              <Text style={styles.text7} numberOfLines={1}>
                                {item.PromotionType} on {item.Name}{' '}
                              </Text>
                            )}
                            <Text style={styles.text8}>
                              Start Date:{' '}
                              {Moment(item.StartTime).format(
                                'DD MMM YYYY  hh:mm a',
                              )}
                            </Text>
                            <Text style={styles.text8}>
                              End Date:{' '}
                              {Moment(item.EndTime).format(
                                'DD MMM YYYY  hh:mm a',
                              )}
                            </Text>
                          </View>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />
                  </View>
                ) : null}
              </ScrollView>
            </View>
          ) : null}
        </SafeAreaView>
      );
    }
  }
}
