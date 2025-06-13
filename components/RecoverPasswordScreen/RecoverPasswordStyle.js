import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  view1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2B3252',
  },
  input1: {
    height: 50,
    width: '80%',
    borderBottomWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#E5E5E5',
    fontSize: 18,
  },
  text1: {
    color: '#E5E5E5',
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'center',
  },
  btn1: {
    height: 50,
    width: '70%',
    backgroundColor: '#936A4A',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '15%',
    shadowOffset: { width: 8, height: 8 },
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    //elevation: 8,
  },
  btn1text: {
    color: '#E5E5E5',
    position: 'absolute',
    fontSize: 20,
    fontWeight: '700',
  },
});
