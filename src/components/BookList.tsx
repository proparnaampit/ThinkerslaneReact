import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';

const BookList = () => {
  return (
    <View style={styles.container}>
      <CustomText>BookList</CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
});

export default BookList;
