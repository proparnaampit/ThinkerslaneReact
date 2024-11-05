import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch} from 'react-redux';
import {logout} from '../../redux/authSlice';
import Toast from 'react-native-toast-message';
import dashboardstyles from './dashboardstyles';

const DashboardScreen = ({navigation}: any) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    Toast.show({
      text1: 'Logged Out Successfully!',
      type: 'success',
      position: 'top',
      visibilityTime: 2000,
    });
  };

  return (
    <View style={dashboardstyles.container}>
      <Text style={dashboardstyles.title}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
