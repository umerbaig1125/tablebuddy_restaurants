import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
} from 'react-native';
import styles from './AnalyticStyleVC';
import {
  BarChart,
} from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;
const chartConfig = {
  backgroundGradientFrom: '#fa7883',
  backgroundGradientTo: '#fa7883',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
};

export default class AnalyticVC extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Analytics',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'red',

      headerTitleStyle: {
        fontWeight: '700',
        color: 'black',
        fontSize: 18,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data = {
      labels: ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'],
      datasets: [
        {
          data: [50, 25, 10, 85, 40],
        },
      ],
    };
    return (
      <SafeAreaView style={styles.view1}>
        <ScrollView>
          <View style={styles.view4}>
            <Text style={styles.text1}>Reservations</Text>
            <View style={styles.view5}>
              <Text style={styles.text4}>Weekly</Text>
              <Image
                source={require('../../../components/Assets/angle-arrow-down.png')}
                style={styles.img2}
              />
            </View>
          </View>

          {/* barChart View */}
          <View style={styles.graphStyle}>
            <BarChart
              data={data}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
            />
          </View>

          {/* promotion cards section */}
          <View style={styles.view2}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.view3}>
                <Image
                  source={require('../../../components/Assets/img1.png')}
                  style={styles.img1}
                />
                <Text style={styles.text2}>10%</Text>
                <Text style={styles.text3}>Most Used promotion</Text>
              </View>

              <View style={styles.view3}>
                <Image
                  source={require('../../../components/Assets/img2.png')}
                  style={styles.img1}
                />
                <Text style={styles.text2}>40%</Text>
                <Text style={styles.text3}>On peak hours</Text>
              </View>
              <View style={styles.view3}>
                <Image
                  source={require('../../../components/Assets/img3.png')}
                  style={styles.img1}
                />
                <Text style={styles.text2}>10%</Text>
                <Text style={styles.text3}>Off peak hours</Text>
              </View>
              <View style={styles.view3}>
                <Image
                  source={require('../../../components/Assets/img4.png')}
                  style={styles.img1}
                />
                <Text style={styles.text2}>30%</Text>
                <Text style={styles.text3}>Cancelled</Text>
              </View>
              <View style={styles.view3}>
                <Image
                  source={require('../../../components/Assets/img5.png')}
                  style={styles.img1}
                />
                <Text style={styles.text2}>10%</Text>
                <Text style={styles.text3}>Customers attracted</Text>
              </View>
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
