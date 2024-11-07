import {StyleSheet, Dimensions} from 'react-native';
const {height} = Dimensions.get('window');

const addOrderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
});

export default addOrderStyles;
