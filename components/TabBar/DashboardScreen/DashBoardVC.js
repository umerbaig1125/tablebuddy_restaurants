import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  SafeAreaView,
  BackHandler,
  LogBox
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './DashBoardStyleVC';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment';
import SearchInput, { createFilter } from 'react-native-search-filter';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
var Sound = require('react-native-sound');

LogBox.ignoreLogs(['Warning: ReactNative.createElement']); // Ignore log notification by message
LogBox.ignoreAllLogs()

const KEYS_TO_FILTERS1 = ['ReservationCode', 'ResFirstName'];
const KEYS_TO_FILTERS2 = ['ReservationCode', 'ResFirstName'];
const KEYS_TO_FILTERS3 = ['ReservationCode', 'ResFirstName'];
const KEYS_TO_FILTERS4 = ['ReservationCode', 'ResFirstName'];

var weekday = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

var newDate;
var arrCount;
var whoosh = new Sound('alert_ringtune.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // loaded successfully
  console.log(
    'duration in seconds: ' +
    whoosh.getDuration() +
    'number of channels: ' +
    whoosh.getNumberOfChannels(),
  );
});
// var maxSize = '';
// var minSize = ''

export default class DashBoardVC extends Component {
  constructor(props) {
    super(props);
    Sound.setCategory('Playback');
    this.state = {
      flag1: true,
      flag2: false,
      flag3: false,
      flag4: false,
      isVisible1: false,
      isVisible2: false,
      isVisible3: false,
      isVisible4: false,
      loading: true,
      personCount: 1,
      upcomingArray: [],
      InprocessArray: [],
      FinishArrary: [],
      NoShowArray: [],
      gettingReservationDate: Moment(new Date()).format('YYYY-MM-DD'),
      CurrentResID: '',
      searchTerm1: '',
      chosenDate: 'Select Date',
      chosenTime: 'Select Time',
      isDateTimePickerVisible: false,
      isDateTimePickerVisible1: false,
      isDateTimePickerVisible2: false,
      isDateTimePickerVisible3: false,
      showTimePicker: false,
      timeDataArray: [],
      noTimeAvailableFlag: false,
      TimeAvailableFlag: true,
      customerID: '',

      edit_person_Count: '',
      edit_person_Name: '',
      edit_person_Number: '',
      edit_Date: '',
      edit_Time: '',
      edit_UserID: '',
      edit_ReservationID: '',
      NewReservationAlert: false,
      NewArrayCount: 0,
      max: '',
      min: '',
      // max: AsyncStorage.getItem("maxTableSize"),
      // min: AsyncStorage.getItem("minTableSize")
    };
  }

  componentDidMount() {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp(); // works best when the goBack is async
      return true;
    });

    // var max = AsyncStorage.getItem("maxTableSize")
    // var min = AsyncStorage.getItem("minTableSize")
    // max.then(e => {
    //   maxSize = e
    //   console.log(`e ${e}`)
    //   console.log(maxSize)
    // })
    // min.then(e => {
    //   minSize = e
    //   console.log(`e ${e}`)
    //   console.log(minSize)
    // })
    this._subscribe = this.props.navigation.addListener('willFocus', () => {
      this.setState({
        flag1: true,
        flag2: false,
        flag3: false,
        flag4: false,
      });
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          CurrentResID: e,
        });
        this.getReservation();
        //this.getTimeFunc();
      });
    });

    try {
      setInterval(async () => {
        this.refreshingFunc();
      }, 10000);
    } catch (e) {
      console.log(e);
    }
  }

  // resData = () => {
  //   console.log("resData")
  //   fetch(
  //     'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoByResID?ResturantID=' +
  //       this.state.CurrentResID,
  //   )
  //   .then(response => response.json())
  //   .then(responseJson => {
  //     this.setState({
  //       max: responseJson[0].ResturantInfo.MaxTableSize,
  //       min: responseJson[0].ResturantInfo.MinTableSize
  //     })
  //     // this.state.max = responseJson[0].ResturantInfo.MaxTableSize
  //     // this.state.min = responseJson[0].ResturantInfo.MinTableSize
  //     console.log("<<<<<<<<<<>>>>>>>")
  //     console.log(this.state.max)
  //     console.log(this.state.min)
  //     console.log("<<<<<<<<>>>>>>>>")
  //     console.log(responseJson)
  //     console.log(responseJson[0].ResturantInfo)
  //     console.log(responseJson[0].ResturantInfo.MaxTableSize)
  //     console.log(responseJson[0].ResturantInfo.MinTableSize)
  //   })
  // }

  // refresing new reservations func
  refreshingFunc = () => {
    fetch(
      'http://' + global.AmeIp + '//api/Reservation/GetReservationByResturantInfoID/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: this.state.CurrentResID,
          Date: '',
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        var a = Object.values(responseJson).length;
        if (arrCount < Object.values(responseJson).length) {
          whoosh.stop();
          whoosh.play();
          this.setState({
            NewReservationAlert: true,
            NewArrayCount: this.state.NewArrayCount + 1,
          });
          this.getReservation();
          this.getTimeFunc();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  closeReasonModel1 = () => {
    this.setState({
      isVisible1: false,
    });
  };

  // on click upcoming option
  onClickUpcoming = () => {
    this.setState({
      flag1: true,
      flag2: false,
      flag3: false,
      flag4: false,
    });
  };

  // on click inprocess option
  onClickInprocess = () => {
    this.setState({
      flag1: false,
      flag2: true,
      flag3: false,
      flag4: false,
    });
  };

  // on click completed option
  onClickCompleted = () => {
    this.setState({
      flag1: false,
      flag2: false,
      flag3: true,
      flag4: false,
    });
  };

  // on click no show option
  onClickNo_Show = () => {
    this.setState({
      flag1: false,
      flag2: false,
      flag3: false,
      flag4: true,
    });
  };

  // walking person plus count
  plusPerson = () => {
    this.setState({
      personCount: this.state.personCount + 1,
    });
  };

  // walking person minus count
  minusPerson = () => {
    if (this.state.personCount > 1) {
      this.setState({
        personCount: this.state.personCount - 1,
      });
    }
  };

  // getting resturant reservations
  getReservation = () => {
    this.setState({
      upcomingArray: [],
      InprocessArray: [],
      FinishArrary: [],
      NoShowArray: [],
      loading: true,
    });
    fetch(
      'http://' + global.AmeIp + '//api/Reservation/GetReservationByResturantInfoID/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: this.state.CurrentResID,
          Date: '',
        }),
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        arrCount = Object.values(responseJson).length;
        this.setState({
          loading: false,
        });
        for (let i = 0; i < Object.values(responseJson).length; i++) {
          if (responseJson[i].Status == 'Past') {
            this.setState({
              FinishArrary: this.state.FinishArrary.concat(responseJson[i]),
            });
          } else if (
            responseJson[i].Status == 'Upcoming' ||
            responseJson[i].Status == 'TimeOut' ||
            responseJson[i].Status == 'Confirmed'
          ) {
            console.log(responseJson[i]);
            this.setState({
              upcomingArray: this.state.upcomingArray.concat(responseJson[i]),
            });
          } else if (responseJson[i].Status == 'InProcess') {
            this.setState({
              InprocessArray: this.state.InprocessArray.concat(responseJson[i]),
            });
          } else if (responseJson[i].Status == 'NoShow') {
            this.setState({
              NoShowArray: this.state.NoShowArray.concat(responseJson[i]),
            });
          }
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // do reservation in process
  onpressInprocessBtn = (a, b) => {
    Alert.alert('Alert', 'Are you sure your customer has arrived', [
      {
        text: 'No',
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () =>
          fetch(
            'http://' + global.AmeIp + '//api/Reservation/UpdateReservationStatus/',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ResturantInfoID: b,
                ReservationID: a,
                Status: 'InProcess',
              }),
            },
          )
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.message == 'Reservation Status Updated') {
                this.getReservation();
                this.setState({
                  searchTerm1: '',
                });
              } else {
                Alert.alert(responseJson.message);
              }
            })
            .catch(error => {
              console.error(error);
            }),
      },
    ]);
  };

  // do resturant finish
  onpressFinishBtn = (a, b) => {
    console.log("a,b")
    console.log(b)
    console.log(a)
    fetch('http://' + global.AmeIp + '//api/Reservation/UpdateReservationStatus/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ResturantInfoID: b,
        ReservationID: a,
        Status: 'Past',
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'Reservation Status Updated') {
          this.getReservation();
          this.setState({
            searchTerm1: '',
          });
        } else {
          Alert.alert(responseJson.message);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  searchUpdated1(term) {
    this.setState({ searchTerm1: term });
  }

  // convert time 24 to 12 hours
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

  // close modal for making reservation
  onclickClosemakereservationModel = e => {
    this.setState({
      isVisible3: false,
    });
  };
  // close modal for making reservation
  onclickClose_edit_reservationModel = e => {
    this.setState({
      isVisible4: false,
    });
  };

  onclickClose_NewReservationAlert = () => {
    whoosh.stop();
    this.setState({
      NewReservationAlert: false,
      NewArrayCount: 0,
    });
  };

  // make on plus for making resturant reservation
  onClickEditReservation = (e1, e2, e3, e4, e5, e6, e7, e8) => {
    if (e8 == null) {
      this.setState({
        isVisible4: true,
        edit_person_Count: e4,
        edit_person_Name: e7,
        edit_Date: e6,
        edit_Time: e5,
        edit_UserID: e3,
        edit_ReservationID: e1,
      });
    } else {
      this.setState({
        isVisible4: true,
        edit_person_Count: e4,
        edit_person_Name: e8,
        edit_Date: e6,
        edit_Time: e5,
        edit_UserID: e3,
        edit_ReservationID: e1,
      });
    }
    console.log(e5);
    console.log(e6);
  };

  // person count plus
  Edit_plusPerson = () => {
    this.setState({
      edit_person_Count: this.state.edit_person_Count + 1,
    });
  };

  // person count minus
  Edit_minusPerson = () => {
    if (this.state.edit_person_Count > 1) {
      this.setState({
        edit_person_Count: this.state.edit_person_Count - 1,
      });
    }
  };

  // getting times
  getTimeFunc = () => {
    this.setState({
      timeDataArray: [],
    });

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var sec = new Date().getSeconds(); //Current Seconds

    if (newDate == undefined) {
      fetch(
        'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoTimeByResID',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ResturantInfoID: this.state.CurrentResID,
            TodayDate: year + '-' + month + '-' + date,
          }),
        },
      )
        .then(response => response.json())
        .then(responseJson => {
          console.log("if")
          console.log("get resturant info")
          console.log("......................")
          console.log(responseJson[0].TimeChunks)
          console.log(responseJson[1].TimeChunks)
          console.log("......................")
          console.log(responseJson)
          console.log("data")
          console.log(this.state.CurrentResID)
          if (responseJson == 'No Time Available') {
            Alert.alert('Alert', 'Restaurant is closed on a selected date', [{ text: 'Ok' }]);
            this.setState({
              noTimeAvailableFlag: true,
              TimeAvailableFlag: false,
            });
          } else {
            for (let i = 0; i < Object.values(responseJson).length; i++) {
              console.log(`timeeeee ${this.state.chosenTime}`)
              // if(this.state.chosenTime < this.state.timeDataArray[0] || this.state.chosenTime >  this.state.timeDataArray.length - 1 ){
              //   Alert.alert('Alert', 'Restaurant is closed at that time', [{ text: 'Ok' }]);
              // }
              // else {
              //   this.setState({
              //     noTimeAvailableFlag: false,
              //     TimeAvailableFlag: true,
              //     timeDataArray: this.state.timeDataArray.concat(
              //       this.timeTo12HrFormat(responseJson[i].TimeChunks),
              //     ),
              //   });
              // }
              console.log("####################################")
              console.log(this.state.timeDataArray)
              console.log("####################################")
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    else {
      fetch('http://' + global.AmeIp + '//api/Resturant/GetResturantinfoTimeByResID', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: this.state.CurrentResID,
          TodayDate: newDate
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          console.log("....................................................................")
          console.log(newDate)
          console.log("....................................................................")
          if (responseJson == 'No Time Available') {
            Alert.alert('Alert', 'Restaurant is closed on a selected date', [{ text: 'Ok' }]);
            this.setState({
              noTimeAvailableFlag: true,
              TimeAvailableFlag: false,
              //timeDataArray: [],
            });
          } else {
            for (let i = 0; i < Object.values(responseJson).length; i++) {
              // if(this.state.chosenTime < this.state.timeDataArray[0] || this.state.chosenTime >  this.state.timeDataArray.length - 1 ){
              //   Alert.alert('Alert', 'Restaurant is closed at that time', [{ text: 'Ok' }]);
              // }
              // else {
              //   this.setState({
              //     noTimeAvailableFlag: false,
              //     TimeAvailableFlag: true,
              //     timeDataArray: this.state.timeDataArray.concat(
              //       this.timeTo12HrFormat(responseJson[i].TimeChunks),
              //     ),
              //   });
              // }
              this.setState({
                noTimeAvailableFlag: false,
                TimeAvailableFlag: true,
                timeDataArray: this.state.timeDataArray.concat(
                  this.timeTo12HrFormat(responseJson[i].TimeChunks),
                ),
              });
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  // open time picker
  openTimePicker = () => {
    if (this.state.chosenDate == 'Select Date') {
      Alert.alert('Alert', 'Please select a date first.', [{ text: 'Ok' }]);
    } else {
      this.setState({
        showTimePicker: true,
      });
    }
  };

  // close time picker
  closeTimePicker = () => {
    this.setState({
      showTimePicker: false,
    });
  };

  // show date picker
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  // hide date picker
  hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisible: false });
  };

  // handle date picker
  handleDatePicked = date => {
    newDate = moment(new Date(date.toString().substr(0, 16))).format(
      'YYYY-MM-DD',
    );
    this.setState({
      isDateTimePickerVisible: false,
      chosenDate: moment(new Date(date.toString().substr(0, 16))).format(
        'YYYY-MM-DD',
      ),
    });
    this.getTimeFunc();
  };

  showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible1: true });
  };

  // hide date picker
  hideDateTimePicker1 = time => {
    this.setState({ isDateTimePickerVisible1: false });
  };

  // handle date picker
  handleDatePicked1 = time => {
    console.log("timeee")
    console.log(this.state.chosenTime)
    console.log(".@.@.@")
    console.log(this.state.timeDataArray[0])
    console.log(".@.@.@")
    console.log(this.state.timeDataArray.length - 1)
    this.setState({
      isDateTimePickerVisible1: false,
      chosenTime:
        time.getHours() +
        ':' +
        (time.getMinutes() > 9
          ? time.getMinutes().toString()
          : '0' + time.getMinutes()),
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

  // click on confirm reservation
  onClickConfirmBtn = () => {
    console.log("btn click")
    var restuserId = AsyncStorage.getItem('ResturantUserId');
    restuserId.then(e => {
      console.log(".............................................")
      console.log(e)
      console.log(".............................................")
    });
    if (
      this.state.chosenDate != 'Select Date' &&
      this.state.chosenTime != 'Select Time'
    ) {
      if (
        this.UserName == '' ||
        this.UserName == undefined ||
        this.CustomerPhoneNumber == '' ||
        this.CustomerPhoneNumber == undefined
      ) {
        Alert.alert('Alert', 'Please Fill Empty Field', [{ text: 'Ok' }]);
      } else {
        //var restuserId = AsyncStorage.getItem('ResturantUserId');
        // --------------------------------------------------------------
        // --------------------------------------------------------------
        // customer number api
        // fetch('http://192.168.100.173/api/Reservation/GetReservationByUserPhoneNo', {
        //   method: 'POST',
        //   headers: {
        //     Accept: 'application/json',
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     PhoneNumber: this.CustomerPhoneNumber
        //   }),
        // })
        //   .then(response => response.json())
        //   .then(responseJson => {
        //     this.state.customerID = responseJson[0].UserInfoID
        //     if(this.state.customerID == ''){
        // restuserId.then(e => {
        //   var day = new Date().getDay();
        //   console.log(`day ${day}`)
        //   var date = new Date().getDate(); //Current Date
        //   var month = new Date().getMonth() + 1; //Current Month
        //   var year = new Date().getFullYear(); //Current Year
        //   var hours = new Date().getHours(); //Current Hours
        //   var min = new Date().getMinutes(); //Current Minutes
        //   var sec = new Date().getSeconds(); //Current Seconds
        //   fetch('http://' + global.AmeIp + '//api/Reservation/SaveResReservation/', {
        //     method: 'POST',
        //     headers: {
        //       Accept: 'application/json',
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       ResturantInfoID: this.state.CurrentResID,
        //       UserInfoID: e,
        //       PartySize: this.state.personCount,
        //       Time: this.convertTime12to24(this.state.chosenTime),
        //       Date: this.state.chosenDate,
        //       FirstName: this.UserName,
        //       PhoneNumber: this.CustomerPhoneNumber,
        //       presentDate: year + '-' + month + '-' + date,
        //       presentTime: hours + ':' + min + ':' + sec,
        //     }),
        //   })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //       console.log("@@@@@@@@@@@")
        //       console.log(`responseJson ${JSON.stringify(responseJson)}`)
        //       console.log(`ResturantInfoID ${this.state.CurrentResID}`)
        //       console.log(`UserInfoID ${e}`)
        //       console.log(`PartySize ${this.state.personCount}`)
        //       console.log(`Time ${this.convertTime12to24(this.state.chosenTime)}`)
        //       console.log(`Date ${this.state.chosenDate}`)
        //       console.log(`FirstName ${this.UserName}`)
        //       console.log(`PhoneNumber ${this.CustomerPhoneNumber}`)
        //       console.log(`presentDate ${year + '-' + month + '-' + date}`)
        //       console.log(`presentTime ${hours + ':' + min + ':' + sec}`)
        //       console.log("@@@@@@@@@@@")
        //       if (responseJson.message == 'Reserved sucessfully') {
        //         Alert.alert('Alert', 'Reservation added successfully', [
        //           {
        //             text: 'Ok',
        //             onPress: () => {
        //               this.Reservation_added_successfully();
        //               this.getTimeFunc();
        //             },
        //           },
        //         ]);
        //       } else if (
        //         responseJson.message == 'Already Exist in this Date and Time'
        //       ) {
        //         Alert.alert(
        //           'Alert',
        //           'Sorry! your chosen time slot is not availaible',
        //           [{ text: 'Ok' }],
        //         );
        //       } else if (
        //         responseJson.message ==
        //         'Date and Time must be greater than current'
        //       ) {
        //         Alert.alert(
        //           'Alert',
        //           'Date and Time must be greater than current',
        //           [{ text: 'Ok' }],
        //         );
        //       }
        //     })
        //     .catch(error => {
        //       console.error(error);
        //     });
        // });
        //     }
        //     else{
        //    restuserId.then(e => {
        //   var day = new Date().getDay();
        //   console.log(`day ${day}`)
        //   var date = new Date().getDate(); //Current Date
        //   var month = new Date().getMonth() + 1; //Current Month
        //   var year = new Date().getFullYear(); //Current Year
        //   var hours = new Date().getHours(); //Current Hours
        //   var min = new Date().getMinutes(); //Current Minutes
        //   var sec = new Date().getSeconds(); //Current Seconds
        //   fetch('http://' + global.AmeIp + '//api/Reservation/SaveResReservation/', {
        //     method: 'POST',
        //     headers: {
        //       Accept: 'application/json',
        //       'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //       ResturantInfoID: this.state.CurrentResID,
        //       UserInfoID: this.state.customerID,
        //       PartySize: this.state.personCount,
        //       Time: this.convertTime12to24(this.state.chosenTime),
        //       Date: this.state.chosenDate,
        //       FirstName: this.UserName,
        //       PhoneNumber: this.CustomerPhoneNumber,
        //       presentDate: year + '-' + month + '-' + date,
        //       presentTime: hours + ':' + min + ':' + sec,
        //     }),
        //   })
        //     .then(response => response.json())
        //     .then(responseJson => {
        //       console.log("@@@@@@@@@@@")
        //       console.log(`responseJson ${JSON.stringify(responseJson)}`)
        //       console.log(`ResturantInfoID ${this.state.CurrentResID}`)
        //       console.log(`UserInfoID ${e}`)
        //       console.log(`PartySize ${this.state.personCount}`)
        //       console.log(`Time ${this.convertTime12to24(this.state.chosenTime)}`)
        //       console.log(`Date ${this.state.chosenDate}`)
        //       console.log(`FirstName ${this.UserName}`)
        //       console.log(`PhoneNumber ${this.CustomerPhoneNumber}`)
        //       console.log(`presentDate ${year + '-' + month + '-' + date}`)
        //       console.log(`presentTime ${hours + ':' + min + ':' + sec}`)
        //       console.log("@@@@@@@@@@@")
        //       if (responseJson.message == 'Reserved sucessfully') {
        //         Alert.alert('Alert', 'Reservation added successfully', [
        //           {
        //             text: 'Ok',
        //             onPress: () => {
        //               this.Reservation_added_successfully();
        //               this.getTimeFunc();
        //             },
        //           },
        //         ]);
        //       } else if (
        //         responseJson.message == 'Already Exist in this Date and Time'
        //       ) {
        //         Alert.alert(
        //           'Alert',
        //           'Sorry! your chosen time slot is not availaible',
        //           [{ text: 'Ok' }],
        //         );
        //       } else if (
        //         responseJson.message ==
        //         'Date and Time must be greater than current'
        //       ) {
        //         Alert.alert(
        //           'Alert',
        //           'Date and Time must be greater than current',
        //           [{ text: 'Ok' }],
        //         );
        //       }
        //     })
        //     .catch(error => {
        //       console.error(error);
        //     });
        // });
        //     }
        //   })
        //   .catch(error => {
        //     console.error(error);
        //   });

        // --------------------------------------------------------------
        // --------------------------------------------------------------
        var restuserId = AsyncStorage.getItem('ResturantUserId');
        restuserId.then(e => {
          var day = new Date().getDay();
          console.log(`day ${day}`)
          var date = new Date().getDate(); //Current Date
          var month = new Date().getMonth() + 1; //Current Month
          var year = new Date().getFullYear(); //Current Year
          var hours = new Date().getHours(); //Current Hours
          var min = new Date().getMinutes(); //Current Minutes
          var sec = new Date().getSeconds(); //Current Seconds
          fetch('http://' + global.AmeIp + '//api/Reservation/SaveResReservation/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ResturantInfoID: this.state.CurrentResID,
              UserInfoID: e,
              PartySize: this.state.personCount,
              Time: this.convertTime12to24(this.state.chosenTime),
              Date: this.state.chosenDate,
              FirstName: this.UserName,
              PhoneNumber: this.CustomerPhoneNumber,
              presentDate: year + '-' + month + '-' + date,
              presentTime: hours + ':' + min + ':' + sec,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              console.log("@@@@@@@@@@@")
              console.log(`responseJson ${JSON.stringify(responseJson)}`)
              console.log(`ResturantInfoID ${this.state.CurrentResID}`)
              console.log(`UserInfoID ${e}`)
              console.log(`PartySize ${this.state.personCount}`)
              console.log(`Time ${this.convertTime12to24(this.state.chosenTime)}`)
              console.log(`Date ${this.state.chosenDate}`)
              console.log(`FirstName ${this.UserName}`)
              console.log(`PhoneNumber ${this.CustomerPhoneNumber}`)
              console.log(`presentDate ${year + '-' + month + '-' + date}`)
              console.log(`presentTime ${hours + ':' + min + ':' + sec}`)
              console.log("@@@@@@@@@@@")
              if (responseJson.message == 'Reserved sucessfully') {
                Alert.alert('Alert', 'Reservation added successfully', [
                  {
                    text: 'Ok',
                    onPress: () => {
                      this.Reservation_added_successfully();
                      this.getTimeFunc();
                    },
                  },
                ]);
              } else if (
                responseJson.message == 'Already Exist in this Date and Time'
              ) {
                Alert.alert(
                  'Alert',
                  'Sorry! your chosen time slot is not availaible',
                  [{ text: 'Ok' }],
                );
              } else if (
                responseJson.message ==
                'Date and Time must be greater than current'
              ) {
                Alert.alert(
                  'Alert',
                  'Date and Time must be greater than current',
                  [{ text: 'Ok' }],
                );
              }
            })
            .catch(error => {
              console.error(error);
            });
        });
      }
    } else {
      Alert.alert('Alert', 'Please Select Time or Date', [{ text: 'Ok' }]);
    }
  };

  // make on plus for making resturant reservation
  onClickMakeReservation = () => {
    fetch(
      'http://' + global.AmeIp + '//api/Resturant/GetResturantinfoByResID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          max: responseJson[0].ResturantInfo.MaxTableSize,
          min: responseJson[0].ResturantInfo.MinTableSize,
          isVisible3: true,
          chosenDate: 'Select Date',
          chosenTime: 'Select Time',
          personCount: Number(responseJson[0].ResturantInfo.MinTableSize),
        })
        // this.state.max = responseJson[0].ResturantInfo.MaxTableSize
        // this.state.min = responseJson[0].ResturantInfo.MinTableSize
        console.log("<<<<<<<<<<>>>>>>>")
        console.log(this.state.max)
        console.log(this.state.min)
        console.log("<<<<<<<<>>>>>>>>")
        console.log(responseJson)
        console.log(responseJson[0].ResturantInfo)
        console.log(responseJson[0].ResturantInfo.MaxTableSize)
        console.log(responseJson[0].ResturantInfo.MinTableSize)
      })
    // console.log(this.props.navigation.state.params.MaxTableSize);
    // console.log(this.props.navigation.state.params.MaxTableSize);
    // console.log(this.state.max)
    console.log(".............")
    console.log(this.state.min)
    console.log(this.state.max)
    console.log(typeof (this.state.min))
    // this.setState({
    //   isVisible3: true,
    //   chosenDate: 'Select Date',
    //   chosenTime: 'Select Time',
    //   personCount: Number(this.state.min),
    // });
  };

  // refresh page after add walking reservation
  Reservation_added_successfully = () => {
    this.setState({
      isVisible3: false,
      chosenDate: 'Select Date',
      chosenTime: 'Select Time',
      personCount: 2,
      searchTerm1: '',
    });
    this.getReservation();
  };

  /// no show func
  onpressNoShowBtn = (a, b, c) => {
    Alert.alert('Alert', 'Are you sure your customer not arrived', [
      {
        text: 'Cancel',
        // onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: () =>
          fetch('http://' + global.AmeIp + '//api/Reservation/NoShowReservation/', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ResturantInfoID: b,
              ReservationID: a,
              UserInfoID: c,
            }),
          })
            .then(response => response.json())
            .then(responseJson => {
              if (responseJson.message == 'NoShow reservation') {
                this.getReservation();
                this.setState({
                  searchTerm1: '',
                });
              } else {
                Alert.alert(responseJson.message);
              }
            })
            .catch(error => {
              console.error(error);
            }),
      },
    ]);
  };

  // show date picker
  Edit_showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible2: true });
  };

  // hide date picker
  Edit_hideDateTimePicker = datetime => {
    this.setState({ isDateTimePickerVisibl2: false });
  };

  // handle time picker
  Edit_handleDatePicked = date => {
    this.setState({
      isDateTimePickerVisible2: false,
      edit_Date: moment(new Date(date.toString().substr(0, 16))).format(
        'YYYY-MM-DD',
      ),
    });
  };

  Edit_showDateTimePicker1 = () => {
    this.setState({ isDateTimePickerVisible3: true });
  };

  // hide time picker
  Edit_hideDateTimePicker1 = time => {
    this.setState({ isDateTimePickerVisible3: false });
  };

  // handle time picker
  Edit_handleDatePicked1 = time => {
    this.setState({
      isDateTimePickerVisible3: false,
      edit_Time:
        time.getHours() +
        ':' +
        (time.getMinutes() > 9
          ? time.getMinutes().toString()
          : '0' + time.getMinutes()) +
        ':' +
        '00',
    });
  };

  onClickSaveEditReservation = () => {
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    console.log(this.state.edit_ReservationID);
    console.log(this.state.CurrentResID);
    console.log(this.state.edit_UserID);
    console.log(this.state.edit_Time);
    console.log(moment(this.state.edit_Date).format('YYYY-MM-DD'));
    console.log(hours + ':' + min);
    console.log(moment(new Date()).format('YYYY-MM-DD'));
    console.log(this.state.edit_person_Count);

    fetch('http://' + global.AmeIp + '//api/Reservation/UpdateReservation/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ReservationID: this.state.edit_ReservationID,
        ResturantInfoID: this.state.CurrentResID,
        UserInfoID: this.state.edit_UserID,
        Time: this.state.edit_Time,
        Date: moment(this.state.edit_Date).format('YYYY-MM-DD'),
        presentDate: moment(new Date()).format('YYYY-MM-DD'),
        presentTime: hours + ':' + min,
        PartySize: this.state.edit_person_Count,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.message == 'update Reserved sucessfully') {
          Alert.alert('Alert', 'Reservation Update successfully', [
            {
              text: 'Ok',
              onPress: () => {
                this.getReservation();
                this.setState({
                  isVisible4: false,
                });
              },
            },
          ]);
        } else if (
          responseJson.message == 'Already Exist in this Date and Time'
        ) {
          Alert.alert('Already Exist in this Date and Time');
        } else if (responseJson.message == 'Next Shift Available') {
          Alert.alert('Next Shift Available');
        } else if (responseJson.message == 'Closed') {
          Alert.alert('Closed');
        } else if (
          responseJson.message == 'Date and Time must be greater than current'
        ) {
          Alert.alert('Date and Time must be greater than current');
        } else if (
          responseJson.message == 'Table Size is not in Resturant Range'
        ) {
          Alert.alert('Table Size is not in Restaurant Range');
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
      const filteredEmails1 = this.state.upcomingArray.filter(
        createFilter(this.state.searchTerm1, KEYS_TO_FILTERS1),
      );
      console.log(".................")
      console.log(this.state.upcomingArray.filter(createFilter(this.state.searchTerm1, KEYS_TO_FILTERS1)))
      console.log("................")

      const filteredEmails2 = this.state.InprocessArray.filter(
        createFilter(this.state.searchTerm1, KEYS_TO_FILTERS2),
      );

      const filteredEmails3 = this.state.FinishArrary.filter(
        createFilter(this.state.searchTerm1, KEYS_TO_FILTERS3),
      );

      const filteredEmails4 = this.state.NoShowArray.filter(
        createFilter(this.state.searchTerm1, KEYS_TO_FILTERS4),
      );

      return (
        <SafeAreaView style={styles.view1}>
          {/* Make Reservation Modal */}
          <Modal
            isVisible={this.state.isVisible3}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickClosemakereservationModel()}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 600,
                width: '90%',
                backgroundColor: '#2b3252',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onclickClosemakereservationModel()}
                style={styles.CancleboostItemModel}>
                <Text style={styles.CancleboostItemModeltext}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text13}>Make Reservation</Text>

              <Text style={styles.text14}>Table For</Text>
              <View style={styles.view19}>
                {this.state.personCount > this.state.min ? (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={this.minusPerson}>
                    <Text style={styles.minusBtn}>-</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.minusBtn1}>-</Text>
                )

                }
                <Text style={styles.text15}>{this.state.personCount}</Text>
                {this.state.personCount < this.state.max ? (
                  <TouchableOpacity activeOpacity={0.5} onPress={this.plusPerson}>
                    <Text style={styles.PlusBtn}>+</Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.PlusBtn1}>+</Text>
                )
                }

              </View>

              <TextInput
                style={styles.input2}
                placeholder="Enter Customer Name"
                placeholderTextColor="#d0cece"
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={text => (this.UserName = text)}
              />

              <TextInput
                style={styles.input2}
                placeholder="Enter Customer Number"
                placeholderTextColor="#d0cece"
                onChangeText={text => (this.CustomerPhoneNumber = text)}
                keyboardType={'numeric'}
              />

              <View style={styles.view20}>
                <TouchableOpacity
                  style={styles.choseBtn1}
                  onPress={this.showDateTimePicker}>
                  <Text style={styles.chosetext}>{this.state.chosenDate}</Text>
                </TouchableOpacity>
                {this.state.TimeAvailableFlag ? (
                  <TouchableOpacity
                    style={styles.choseBtn1}
                    onPress={this.openTimePicker}>
                    <Text style={styles.chosetext}>{this.state.chosenTime}</Text>
                  </TouchableOpacity>
                ) : null}
                {this.state.noTimeAvailableFlag ? (
                  <Text style={styles.NoAvailableTime}>
                    Restaurant is closed
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.confirmBtn2}
                onPress={() => this.onClickConfirmBtn()}>
                <Text style={styles.confirmBtntext}>Confirm</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode={'date'}
            />
            {/* <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible1}
              onConfirm={this.handleDatePicked1}
              onCancel={this.hideDateTimePicker1}
              mode={'time'}
            /> */}
            {this.state.showTimePicker ? (
              <View style={styles.timePickerStyle}>
                <TouchableOpacity
                  style={styles.donebtn1}
                  onPress={() => this.closeTimePicker()}>
                  <Text style={styles.donebtnText1}>Done</Text>
                </TouchableOpacity>
                <Picker
                  style={styles.pickerStyle1}
                  selectedValue={this.state.chosenTime}
                  onValueChange={(itemValue, itemPosition) => {
                    console.log("item value")
                    console.log(itemValue);
                    this.setState({
                      chosenTime: itemValue,
                      choosenIndex: itemPosition,
                    });
                  }}>
                  {this.state.timeDataArray.map((item, index) => {
                    return <Picker.Item color="#D5A253" label={item} value={item} />;
                  })}
                </Picker>
              </View>
            ) : null}
          </Modal>

          {/* Edit Reservation Modal */}
          <Modal
            isVisible={this.state.isVisible4}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickClose_edit_reservationModel()}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 460,
                width: '85%',
                backgroundColor: '#2b3252',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => this.onclickClose_edit_reservationModel()}
                style={styles.CancleboostItemModel}>
                <Text style={styles.CancleboostItemModeltext}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text13}>Edit Reservation</Text>

              <Text style={styles.text14}>Table For</Text>
              <View style={styles.view19}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this.Edit_minusPerson}>
                  <Text style={styles.minusBtn}>-</Text>
                </TouchableOpacity>
                <Text style={styles.text15}>
                  {this.state.edit_person_Count}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={this.Edit_plusPerson}>
                  <Text style={styles.PlusBtn}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.view20}>
                <TouchableOpacity
                  style={styles.choseBtn1}
                  onPress={this.Edit_showDateTimePicker}>
                  <Text style={styles.chosetext}>
                    {Moment(this.state.edit_Date).format('YYYY-MM-DD')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.choseBtn1}
                  onPress={this.Edit_showDateTimePicker1}>
                  <Text style={styles.chosetext}>
                    {this.timeTo12HrFormat(this.state.edit_Time)}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.confirmBtn2}
                onPress={() => this.onClickSaveEditReservation()}>
                <Text style={styles.confirmBtntext}>Update</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible2}
              onConfirm={this.Edit_handleDatePicked}
              onCancel={this.Edit_hideDateTimePicker}
              mode={'date'}
              date={new Date(this.state.edit_Date)}
            />
            {/* <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible3}
              onConfirm={this.Edit_handleDatePicked1}
              onCancel={this.Edit_hideDateTimePicker1}
              mode={'time'}
            /> */}
            {/* {this.state.showTimePicker ? (
              <View style={styles.timePickerStyle}>
                <TouchableOpacity
                  style={styles.donebtn}
                  onPress={() => this.closeTimePicker()}>
                  <Text style={styles.donebtnText}>Done</Text>
                </TouchableOpacity>
                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.state.timeDataArray}
                  onValueChange={(itemValue, itemPosition) => {
                    console.log(itemValue);
                    this.setState({
                      timeDataArray: itemValue,
                      choosenIndex: itemPosition,
                    });
                  }}>
                  {this.state.timeDataArray.map((item, index) => {
                    return <Picker.Item label={item} value={item} />;
                  })}
                </Picker>
              </View>
            ) : null} */}
          </Modal>

          {/* new reservation alert */}
          <Modal
            isVisible={this.state.NewReservationAlert}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.onclickClose_NewReservationAlert()}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 320,
                width: '90%',
                backgroundColor: '#2b3252',
                alignItems: 'center',
                borderRadius: 15,
              }}>
              <View style={styles.view30}>
                <Image
                  source={require('../../../components/Assets/calendar_white.png')}
                  style={styles.img5}
                />
              </View>
              <Text style={styles.text23}>Alert</Text>
              <Text style={styles.text24}>
                You have {this.state.NewArrayCount} new reservations
              </Text>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.confirmBtn3}
                onPress={() => this.onclickClose_NewReservationAlert()}>
                <Text style={styles.confirmBtntext}>OK</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          {/* make Reservation Btn*/}
          <TouchableOpacity
            style={styles.view18}
            onPress={() => this.onClickMakeReservation()}>
            <Image
              source={require('../../../components/Assets/add.png')}
              style={styles.img3}
            />
          </TouchableOpacity>

          {/* search bar section */}
          <View style={styles.view2}>
            <View style={styles.view3}>
              <Image
                source={require('../../../components/Assets/search.png')}
                style={styles.img1}
              />
              <TextInput
                style={styles.input1}
                clearButtonMode="always"
                placeholder="Search Reservation"
                placeholderTextColor="gray"
                onChangeText={term => {
                  this.searchUpdated1(term);
                }}
              />
            </View>
          </View>
          {/* tab bar -> filter -> today , tomorrow, all */}
          <View style={styles.view4}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.view5}
              onPress={() => this.onClickUpcoming()}>
              <Text style={styles.text1}>Upcoming</Text>
              {this.state.flag1 ? <View style={styles.line1} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.view5}
              onPress={() => this.onClickInprocess()}>
              <Text style={styles.text1}>In Process</Text>
              {this.state.flag2 ? <View style={styles.line1} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.view5}
              onPress={() => this.onClickCompleted()}>
              <Text style={styles.text1}>Completed</Text>
              {this.state.flag3 ? <View style={styles.line1} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.view5}
              onPress={() => this.onClickNo_Show()}>
              <Text style={styles.text1}>No Show</Text>
              {this.state.flag4 ? <View style={styles.line1} /> : null}
            </TouchableOpacity>
          </View>

          <ScrollView>
            {this.state.flag1 ? (
              <View>
                <Text style={styles.text2}>
                  UPCOMING ({Object.values(this.state.upcomingArray).length})
                </Text>
                {/* UPCOMING FlatList */}
                <View style={styles.view6}>
                  {filteredEmails1.map((item, index) => {
                    console.log("###############")
                    console.log(filteredEmails1.map(item => item.ResFirstName))
                    console.log("###############")
                    return (
                      <View key={index} style={styles.view7}>
                        {item.Type == 1 ? (
                          <Text style={styles.text3}>{item.ResFirstName}</Text>
                        ) : (
                          <Text style={styles.text3}>{item.FirstName}</Text>
                        )}
                        <View style={styles.view8}>
                          <Image
                            source={require('../../../components/Assets/calendar.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text4}>
                              Time:
                              {this.timeTo12HrFormat(item.Time).replace(
                                ':00',
                                '',
                              )}
                            </Text>
                            <Text style={styles.text4}>
                              Date: {Moment(item.Date).format('DD MMM YYYY ')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line2} />
                        <View style={styles.view10}>
                          <Image
                            source={require('../../../components/Assets/userIcon.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text5}>
                              Person: {item.PartySize}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.view21}>
                          {/* inprocess button */}
                          <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.inprocessBtn}
                            onPress={() =>
                              this.onpressInprocessBtn(
                                item.ReservationID,
                                item.ResturantInfoID,
                              )
                            }>
                            <Text style={styles.inprocessBtntext}>
                              In process
                            </Text>
                          </TouchableOpacity>
                          {/* Edit button */}
                          <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.EditButton1}
                            onPress={() =>
                              this.onClickEditReservation(
                                item.ReservationID,
                                item.ResturantInfoID,
                                item.UserInfoID,
                                item.PartySize,
                                item.Time,
                                item.Date,
                                item.FirstName,
                                item.ResFirstName,
                              )
                            }>
                            <Image
                              source={require('../../Assets/edit-button.png')}
                              style={styles.img4}
                            />
                          </TouchableOpacity>
                          {item.Status == 'TimeOut' ? (
                            <TouchableOpacity
                              activeOpacity={0.5}
                              style={styles.NoShowBtn}
                              onPress={() =>
                                this.onpressNoShowBtn(
                                  item.ReservationID,
                                  item.ResturantInfoID,
                                  item.UserInfoID,
                                )
                              }>
                              <Text style={styles.inprocessBtntext}>
                                No Show
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <View />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {this.state.flag2 ? (
              <View>
                <Text style={styles.text2}>
                  IN PROCESS ({Object.values(this.state.InprocessArray).length})
                </Text>
                {/* In Process FlatList */}
                <View style={styles.view6}>
                  {filteredEmails2.map((item, index) => {
                    return (
                      <View key={index} style={styles.view7}>
                        {item.Type == 1 ? (
                          <Text style={styles.text3}>{item.ResFirstName}</Text>
                        ) : (
                          <Text style={styles.text3}>{item.FirstName}</Text>
                        )}
                        <View style={styles.view8}>
                          <Image
                            source={require('../../../components/Assets/calendar.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text4}>
                              Time:
                              {this.timeTo12HrFormat(item.Time).replace(
                                ':00',
                                '',
                              )}
                            </Text>
                            <Text style={styles.text4}>
                              Date: {Moment(item.Date).format('DD MMM YYYY ')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line2} />
                        <View style={styles.view10}>
                          <Image
                            source={require('../../../components/Assets/userIcon.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text5}>
                              Person: {item.PartySize}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.view21}>
                          <TouchableOpacity
                            activeOpacity={0.5}
                            style={styles.inprocessBtn}
                            onPress={() =>
                              this.onpressFinishBtn(
                                item.ReservationID,
                                item.ResturantInfoID,
                              )
                            }>
                            <Text style={styles.inprocessBtntext}>
                              Complete
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {this.state.flag3 ? (
              <View>
                <Text style={styles.text2}>
                  COMPLETED ({Object.values(this.state.FinishArrary).length})
                </Text>
                {/* FINISH FlatList */}
                <View style={styles.view6}>
                  {filteredEmails3.map((item, index) => {
                    return (
                      <View key={index} style={styles.view7}>
                        {item.Amount == null ? (
                          <View />
                        ) : (
                          <View style={styles.redeemView}>
                            <Text style={styles.text33}>
                              {item.Amount} Points Received
                            </Text>
                          </View>
                        )}
                        {item.Type == 1 ? (
                          <Text style={styles.text3}>{item.ResFirstName}</Text>
                        ) : (
                          <Text style={styles.text3}>{item.FirstName}</Text>
                        )}
                        <View style={styles.view8}>
                          <Image
                            source={require('../../../components/Assets/calendar.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text4}>
                              Time:
                              {this.timeTo12HrFormat(item.Time).replace(
                                ':00',
                                '',
                              )}
                            </Text>
                            <Text style={styles.text4}>
                              Date: {Moment(item.Date).format('DD MMM YYYY ')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line2} />
                        <View style={styles.view10}>
                          <Image
                            source={require('../../../components/Assets/userIcon.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text5}>
                              Person: {item.PartySize}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
            {this.state.flag4 ? (
              <View>
                <Text style={styles.text2}>
                  NO SHOW ({Object.values(this.state.NoShowArray).length})
                </Text>
                {/* No Show FlatList */}
                <View style={styles.view6}>
                  {filteredEmails4.map((item, index) => {
                    return (
                      <View key={index} style={styles.view7}>
                        {item.Type == 1 ? (
                          <Text style={styles.text3}>{item.ResFirstName}</Text>
                        ) : (
                          <Text style={styles.text3}>{item.FirstName}</Text>
                        )}
                        <View style={styles.view8}>
                          <Image
                            source={require('../../../components/Assets/calendar.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text4}>
                              Time:
                              {this.timeTo12HrFormat(item.Time).replace(
                                ':00',
                                '',
                              )}
                            </Text>
                            <Text style={styles.text4}>
                              Date: {Moment(item.Date).format('DD MMM YYYY ')}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.line2} />
                        <View style={styles.view10}>
                          <Image
                            source={require('../../../components/Assets/userIcon.png')}
                            style={styles.img2}
                          />
                          <View style={styles.view9}>
                            <Text style={styles.text5}>
                              Person: {item.PartySize}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </ScrollView>

          {/* modal popup for UPCOMING */}
          <Modal
            isVisible={this.state.isVisible1}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 500,
                width: '90%',
                backgroundColor: 'white',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.view17}>
                  <Text style={styles.text12}>X</Text>
                </TouchableOpacity>
                <View style={styles.view11}>
                  <Text style={styles.text6}>Table For</Text>
                  <View style={styles.view12}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.minusPerson}>
                      <Text style={styles.minusBtn}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.text7}>{this.state.personCount}</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.plusPerson}>
                      <Text style={styles.PlusBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.view13}>
                  <Text style={styles.text6}>Choose Date & Time</Text>
                  <TouchableOpacity onPress={this.showDateTimePicker}>
                    <Text style={styles.text8}>05 MAY 2017 - 19:30</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.view14}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.confirmBtn}>
                    <Text style={styles.confirmBtntext}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={styles.confirmBtn}>
                    <Text style={styles.confirmBtntext}>CONFIRM</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* modal popup for Inprocess */}
          <Modal
            isVisible={this.state.isVisible2}
            style={{ alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                height: 500,
                width: '90%',
                backgroundColor: 'white',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style={styles.view17}>
                  <Text style={styles.text12}>X</Text>
                </TouchableOpacity>
                <View style={styles.view11}>
                  <Text style={styles.text6}>Table For</Text>
                  <View style={styles.view12}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.minusPerson}>
                      <Text style={styles.minusBtn}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.text7}>{this.state.personCount}</Text>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={this.plusPerson}>
                      <Text style={styles.PlusBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.view16}>
                  <Text style={styles.text6}>Choose Date & Time</Text>
                  <TouchableOpacity onPress={this.showDateTimePicker}>
                    <Text style={styles.text8}>05 MAY 2017 - 19:30</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.view15}>
                  <Text style={styles.text9}>Points received: 1000</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.confirmBtn1}>
                  <Text style={styles.confirmBtntext}>Finish</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      );
    }
  }
}
