import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../CustomText';
import commonstyles from '../commonstyles';
import {useNavigation} from '@react-navigation/native';

const AddOrderButton: React.FC = () => {
  const navigation: any = useNavigation();

  const handlePress = () => {
    navigation.navigate('AddOrder');
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        commonstyles.button,
        commonstyles.orderButton,
        {flexDirection: 'row', alignItems: 'center', marginTop: 10},
      ]}>
      <FontAwesome
        name="plus-circle"
        size={16}
        style={{color: '#a92737', marginRight: 7}}
      />
      <CustomText style={[commonstyles.orderButtonText]}>Add Order</CustomText>
    </TouchableOpacity>
  );
};

export default AddOrderButton;
