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
import styles from './ResturantMenuStyle';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box';

export default class ResturantMenuVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Menu',
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
      ResturantMenu: [],
      loading: true,
      CurrentResID: '',
      isVisible1: false,
      isVisible2: false,

      emenuName: '',
      emenutype: '',
      emenuPrice: '',
      emenudescription: '',
      SelectMenuId: '',
      isChecked: false,
      isChecked1: false,
    };
    this.props.navigation.setParams({
      headerRight: () => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.addMenuBtn}
          onPress={this.NewPopUpOpen}>
          <Image source={require('../Assets/add.png')} style={styles.img1} />
        </TouchableOpacity>
      ),
    });
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
      var restId = AsyncStorage.getItem('CurrentUserID');
      restId.then(e => {
        this.setState({
          CurrentResID: e,
        });
        this.getResturantMenuData();
      });
    });
  }

  getResturantMenuData = () => {
    fetch(
      'http://' + global.AmeIp + '//api/Menu/GetMenuByResturantID?ResturantID=' +
      this.state.CurrentResID,
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          ResturantMenu: responseJson,
          loading: false,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  OnclickSelectedMenu = (e1, e2, e3, e4, e5, e6) => {
    if (e6 == 1) {
      this.setState({
        isChecked: true,
      });
    } else if (e6 == 0 || e6 == null) {
      this.setState({
        isChecked: false,
      });
    }
    this.setState({
      SelectMenuId: e1,
      emenuName: e2,
      emenutype: e4,
      emenuPrice: e5.toString(),
      emenudescription: e3,
      isVisible1: true,
    });
  };

  editPopUpClose = () => {
    this.setState({
      isVisible1: false,
    });
  };

  NewPopUpClose = () => {
    this.setState({
      isVisible2: false,
    });
  };

  NewPopUpOpen = () => {
    this.setState({
      isVisible2: true,
      isChecked1: false,
    });
  };

  saveEditMenu = () => {
    var a = this.state.emenuName;
    var b = this.state.emenutype;
    var c = this.state.emenudescription;
    var d = this.state.emenuPrice;

    if (this.editMenuName != undefined) {
      a = this.editMenuName;
    }
    if (this.editMenuType != undefined) {
      b = this.editMenuType;
    }
    if (this.editMenuDes != undefined) {
      c = this.editMenuDes;
    }
    if (this.editMenuPrice != undefined) {
      d = this.editMenuPrice;
    }

    if (
      this.editMenuPrice == '' ||
      this.editMenuTyp ||
      this.editMenuDes == '' ||
      this.editMenuName == ''
    ) {
      Alert.alert('please fill all fields');
    } else {
      if (this.state.isChecked == true) {
        fetch('http://' + global.AmeIp + '//api/Menu/UpdateMenuItem/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            MenuID: this.state.SelectMenuId,
            ResturantInfoID: this.state.CurrentResID,
            ItemType: b,
            Price: d,
            Name: a,
            Description: c,
            SpecialFlag: '1',
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.message == 'Menu Item Updated') {
              Alert.alert('Alert', 'Item updated successfully', [
                { text: 'Ok', onPress: () => this.Update_SuccessfullyFnc() },
              ]);
            } else {
              Alert.alert('Alert', responseJson.message);
            }
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        fetch('http://' + global.AmeIp + '//api/Menu/UpdateMenuItem/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            MenuID: this.state.SelectMenuId,
            ResturantInfoID: this.state.CurrentResID,
            ItemType: b,
            Price: d,
            Name: a,
            Description: c,
            SpecialFlag: '0',
          }),
        })
          .then(response => response.json())
          .then(responseJson => {
            if (responseJson.message == 'Menu Item Updated') {
              Alert.alert('Alert', 'Item updated Successfully', [
                { text: 'Ok', onPress: () => this.Update_SuccessfullyFnc() },
              ]);
            } else {
              Alert.alert('Alert', responseJson.message);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }
    }
  };

  Update_SuccessfullyFnc = () => {
    this.setState({ isVisible1: false });
    this.getResturantMenuData();
  };

  saveNewMenu = () => {
    if (
      this.newMenuName == '' ||
      this.newMenuType == '' ||
      this.newMenuPrice == '' ||
      this.newMenuDes == '' ||
      this.newMenuName == undefined ||
      this.newMenuType == undefined ||
      this.newMenuPrice == undefined ||
      this.newMenuDes == undefined
    ) {
      Alert.alert('Please fill all fields');
    } else {
      var SpecialMenuFlag;
      if (this.state.isChecked1 == true) {
        SpecialMenuFlag = '1';
      } else {
        SpecialMenuFlag = '0';
      }

      fetch('http://' + global.AmeIp + '//api/Menu/SaveMenuItem/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ResturantInfoID: this.state.CurrentResID,
          ItemType: this.newMenuType,
          Price: this.newMenuPrice,
          Name: this.newMenuName,
          Description: this.newMenuDes,
          SpecialFlag: SpecialMenuFlag,
        }),
      })
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.message == 'Menu Item Added') {
            Alert.alert('Alert', 'Item added successfully', [
              { text: 'Ok', onPress: () => this.Add_SuccessfullyFnc() },
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

  Add_SuccessfullyFnc = () => {
    this.setState({ isVisible2: false });
    this.getResturantMenuData();
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
          {/* edit menu modal */}
          <Modal
            isVisible={this.state.isVisible1}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.editPopUpClose()}
            style={{ alignItems: 'center', justifyContent: 'center' }}
            useNativeDriver={true}>
            <View
              style={{
                height: 570,
                width: '90%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.cancleBtn1}
                onPress={() => this.editPopUpClose()}>
                <Text style={styles.cancleBtn1text}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text5}>Edit Menu</Text>

              <View style={styles.view6}>
                <Text style={styles.text7}>Menu Name</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Name"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.editMenuName = text)}
                  defaultValue={this.state.emenuName}
                />
              </View>

              <View style={styles.view6}>
                <Text style={styles.text7}>Menu Type</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Type"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.editMenuType = text)}
                  defaultValue={this.state.emenutype}
                />
              </View>

              <View style={styles.view6}>
                <Text style={styles.text7}>Price (Rs)</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Price"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.editMenuPrice = text)}
                  defaultValue={this.state.emenuPrice}
                  keyboardType={'numeric'}
                />
              </View>

              <View style={styles.view12}>
                <Text style={styles.text33}>Description</Text>
                <TextInput
                  multiline={true}
                  style={styles.input3}
                  placeholder="Enter Menu Description"
                  onChangeText={text => (this.editMenuDes = text)}
                  defaultValue={this.state.emenudescription}
                />
              </View>

              <CheckBox
                style={styles.checkbox}
                onClick={() => {
                  this.setState({
                    isChecked: !this.state.isChecked,
                  });
                }}
                rightText={'Special Menu'}
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
                style={styles.saveBtn1}
                onPress={() => this.saveEditMenu()}>
                <Text style={styles.text6}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* add new menu Model */}
          <Modal
            isVisible={this.state.isVisible2}
            animationOutTiming={1}
            animationInTiming={1}
            backdropOpacity={0.7}
            onBackButtonPress={() => this.NewPopUpClose()}
            style={{ alignItems: 'center', justifyContent: 'center' }}
            useNativeDriver={true}>
            <View
              style={{
                height: 570,
                width: '90%',
                backgroundColor: '#2B3252',
                alignItems: 'center',
                borderRadius: 20,
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.cancleBtn1}
                onPress={() => this.NewPopUpClose()}>
                <Text style={styles.cancleBtn1text}>X</Text>
              </TouchableOpacity>
              <Text style={styles.text5}>Add New Menu</Text>

              <View style={styles.view6}>
                <Text style={styles.text7}>Menu Name</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Name"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.newMenuName = text)}
                //defaultValue={this.state.dataArray.MaxTableSize}
                />
              </View>

              <View style={styles.view6}>
                <Text style={styles.text7}>Menu Type</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Type"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.newMenuType = text)}
                //defaultValue={this.state.dataArray.MaxTableSize}
                />
              </View>

              <View style={styles.view6}>
                <Text style={styles.text7}>Price (Rs)</Text>
                <TextInput
                  style={styles.input4}
                  placeholder="Enter Menu Price"
                  placeholderTextColor="#d0cece"
                  keyboardType={'numeric'}
                  onChangeText={text => (this.newMenuPrice = text)}
                //defaultValue={this.state.dataArray.MaxTableSize}
                />
              </View>

              <View style={styles.view12}>
                <Text style={styles.text33}>Description</Text>
                <TextInput
                  multiline={true}
                  style={styles.input3}
                  placeholder="Enter Menu Description"
                  placeholderTextColor="#d0cece"
                  onChangeText={text => (this.newMenuDes = text)}
                //defaultValue={this.state.dataArray.Description}
                />
              </View>

              <CheckBox
                style={styles.checkbox}
                onClick={() => {
                  this.setState({
                    isChecked1: !this.state.isChecked1,
                  });
                }}
                rightText={'Special Menu'}
                rightTextStyle={styles.checkboxtext}
                isChecked={this.state.isChecked1}
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
                style={styles.saveBtn1}
                onPress={() => this.saveNewMenu()}>
                <Text style={styles.text6}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <FlatList
            showsHorizontalScrollIndicator={false}
            data={this.state.ResturantMenu}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.view2}
                onPress={() =>
                  this.OnclickSelectedMenu(
                    item.MenuID,
                    item.Name,
                    item.Description,
                    item.ItemType,
                    item.Price,
                    item.SpecialFlag,
                  )
                }>
                <View style={styles.view3}>
                  <Text style={styles.text1}>{item.Name}</Text>
                  {item.SpecialFlag == 1 ? (
                    <View style={styles.Starview}>
                      <Image
                        source={require('../Assets/star.png')}
                        style={styles.img3}
                      />
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
                <View style={styles.view20}>
                  <Text style={styles.text4}>Rs. {item.Price}</Text>
                  <Text style={styles.text10} numberOfLines={1}>
                    {item.ItemType}
                  </Text>
                </View>
                <Text style={styles.text2} numberOfLines={2}>
                  {item.Description}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScrollView>
      );
    }
  }
}
