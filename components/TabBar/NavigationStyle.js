import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tabBar: {
    height: '10%',
    paddingTop: 5,
    paddingBottom: 1,
    paddingHorizontal: 5,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    backgroundColor: '#C16563',
    flexGrow: 1,
  },
  tabBarLabel: {
    fontSize: 14,
    letterSpacing: 0.2,
    fontWeight: '700',
    marginBottom: '15%',
  },
  card: {
    opacity: 1,
    backgroundColor: 'white',
  },
  icon: {
    justifyContent: 'flex-start',
    marginTop: 2.8,
    color: 'white',
  },
});
