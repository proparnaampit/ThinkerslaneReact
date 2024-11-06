import React from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/authSlice';
import Toast from 'react-native-toast-message';
import {saveAuthState} from '../../redux/authSlice';
import dashboardstyles from './dashboardstyles';
import CustomHeader from '../../components/Header';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const DashboardScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = async () => {
    dispatch(logout());
    await saveAuthState(null);
    Toast.show({
      text1: 'Logged Out',
      text2: 'You have been logged out successfully.',
      type: 'success',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  return (
    <View style={dashboardstyles.container}>
      <CustomHeader
        title={user ? user.username : 'Dashboard'}
        profileImage="https://example.com/profile.jpg"
      />
      <View style={dashboardstyles.dashboard}></View>
      <View style={dashboardstyles.buttonContainer}>
        <TouchableOpacity
          style={[commonstyles.button, commonstyles.expenseButton]}
          onPress={() => console.log('Add Expenses button pressed')}>
          <FontAwesome
            name="money"
            size={24}
            style={{color: 'white', marginBottom: 10}}></FontAwesome>
          <Text style={commonstyles.buttonText}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white'}}></FontAwesome>{' '}
            Add Expenses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonstyles.button, commonstyles.orderButton]}>
          <FontAwesome
            name="shopping-cart"
            size={24}
            style={{color: '#a92737', marginBottom: 10}}></FontAwesome>
          <Text style={commonstyles.orderButtonText}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: '#a92737'}}></FontAwesome>{' '}
            Add Order
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={dashboardstyles.title}>Welcome to the Dashboard!</Text>
    </View>
  );
};

export default DashboardScreen;
