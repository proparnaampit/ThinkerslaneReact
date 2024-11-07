import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import addOrderStyles from './addOrderStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../components/CustomText';
import BookList from '../../components/BookList';
const AddOrderScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={addOrderStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="keyboard-backspace"
          color={'black'}
          size={24}
          style={{marginBottom: 20}}
        />
      </TouchableOpacity>
      <BookList />
    </View>
  );
};

export default AddOrderScreen;
