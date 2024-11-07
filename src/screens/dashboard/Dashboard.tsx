import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import dashboardstyles from './dashboardstyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../components/CustomText';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const handleAddExpense = () => {
    navigation.navigate('AddExpenses');
  };

  const handleAddOrder = () => {
    navigation.navigate('AddOrder');
  };

  return (
    <View style={dashboardstyles.container}>
      <View style={dashboardstyles.dashboard}></View>
      <CustomText style={dashboardstyles.title}>
        Welcome to the Dashboard!
      </CustomText>
      <View style={dashboardstyles.buttonContainer}>
        <TouchableOpacity
          style={[commonstyles.button, commonstyles.expenseButton]}
          onPress={handleAddExpense}>
          <FontAwesome name="money" size={24} style={{color: 'white'}} />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7, marginTop: 10}}
            />
            <CustomText
              style={[commonstyles.buttonText, {fontSize: 14, marginTop: 10}]}>
              Add Expenses
            </CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonstyles.button, commonstyles.orderButton]}
          onPress={handleAddOrder}>
          <FontAwesome
            name="shopping-cart"
            size={24}
            style={{color: '#a92737'}}
          />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: '#a92737', marginRight: 7, marginTop: 10}}
            />
            <CustomText style={[commonstyles.orderButtonText, {marginTop: 10}]}>
              Add Order
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;
