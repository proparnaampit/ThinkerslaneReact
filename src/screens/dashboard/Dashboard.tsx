import React from 'react';
import {View, Text, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/authSlice';
import Toast from 'react-native-toast-message';
import {saveAuthState} from '../../redux/authSlice';
import dashboardstyles from './dashboardstyles';
import CustomHeader from '../../components/Header';

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
      <Text style={dashboardstyles.title}>Welcome to the Dashboard!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default DashboardScreen;
