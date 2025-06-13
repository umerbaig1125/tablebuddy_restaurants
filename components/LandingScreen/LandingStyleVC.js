import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  view1: {
    flex: 1,
    backgroundColor: '#2B3252',
  },
  view2: {
    height: '40%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  view3: {
    height: '60%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  img1: {
    height: '70%',
    width: '80%',
  },
  btn1: {
    height: '10%',
    width: '70%',
    backgroundColor: '#936A4A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '5%',
    shadowOffset: { width: 8, height: 8 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    //elevation: 8,
  },
  btn1text: {
    color: '#e5e5e5',
    fontSize: 20,
    fontWeight: '700',
  },
});
