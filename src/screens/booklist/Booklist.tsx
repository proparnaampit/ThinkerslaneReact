import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import bookStyles from './bookStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../components/CustomText';
import BookList from '../../components/BookList';

const BookListScreen = () => {
  return (
    <View style={bookStyles.container}>
      <BookList />
    </View>
  );
};

export default BookListScreen;
