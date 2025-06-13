import React, { Component } from 'react';
import {
  View,
  Image,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
import firebase from 'react-native-firebase';
import NetInfo from '@react-native-community/netinfo';

LogBox.ignoreAllLogs();

export default class SplashScreen extends Component {
  performTimeConsumingTask = async () => {
    return new Promise(resolve =>
      setTimeout(() => {
        resolve('result');
      }, 1500),
    );
  };

  async componentDidMount() {
    // checking internet
    console.log('responseJson');
    // global.AmeIp = '74.208.95.24/TableBuddy';
    global.AmeIp = '67.55.84.27:85'
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        this.checkPermission();
        this.createNotificationListeners();
        const data = this.performTimeConsumingTask();
        if (data !== null) {
          var CurrentUserName = AsyncStorage.getItem('isLogin');
          CurrentUserName.then(e => {
            if (e == 'true') {
              var ID = AsyncStorage.getItem('CurrentUserID');
              ID.then(e => {
                fetch(
                  'http://' + global.AmeIp + '//api/Resturant/GetResturantSessionbyResturantID/',
                  {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      ResturantInfoID: e,
                    }),
                  },
                )
                  .then(response => response.json())
                  .then(responseJson => {
                    if (Object.values(responseJson).length == 0) {
                      this.props.navigation.navigate('Landing');
                    } else {
                      if (responseJson[0].SessionFlag == 1) {
                        this.props.navigation.navigate('TabNavigation');
                      } else {
                        this.props.navigation.navigate('Landing');
                      }
                    }
                  })
                  .catch(error => {
                    console.log(error);

                    // console.error(error);
                  });
              });
            } else {
              this.props.navigation.navigate('Landing');
            }
          });
        }
      } else {
        Alert.alert('No internet connection');
      }
    });
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  //1 checking notification permission
  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  //3 getting user token
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    await AsyncStorage.setItem('fcmToken', fcmToken);
  }

  //2 request for notification
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
    }
  }

  // create notification
  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body } = notification;
        // console.log({title, body});
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true,
        })
          .setNotificationId(notification.notificationId)
          .setTitle(notification.title)
          .setBody(notification.body)
          .android.setChannelId('fcm_FirebaseNotifiction_default_channel') // e.g. the id you chose above
          .android.setSmallIcon('@drawable/ic_launcher') // create this icon in Android Studio
          .android.setColor('#000000') // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      });

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        if (notificationOpen.notification.body != undefined) {
          const { title, body } = notificationOpen.notification;
          // Alert.alert(title, body);
        } else {
          console.log(Platform);
          if (Platform.OS == 'android') {
            // Alert.alert(title, body);
          } else if (Platform.OS == 'ios') {
          }
        }
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      // Alert.alert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      const localNotification = new firebase.notifications.Notification({
        show_in_foreground: true,
      })
        .setTitle(message._data.title)
        .setBody(message._data.body);
      firebase
        .notifications()
        .displayNotification(localNotification)
        .catch(err => console.error(err));
    });
  }

  render() {
    return (
      <View style={styles.viewStyles}>
        <StatusBar backgroundColor="#2B3252" barStyle="light-content" />
        <Image
          source={require('./Assets/logo.png')}
          style={styles.img1}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = {
  viewStyles: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B3252',
  },
  textStyles: {
    color: '#D5A253',
    fontSize: 40,
    fontWeight: 'bold',
  },
  img1: {
    height: 250,
    width: '80%',
    shadowOffset: { width: 8, height: 8 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    //elevation: 8,
  },
};
