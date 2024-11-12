import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {login} from '../redux/authSlice';

export const loginUser = (
  loginMutation,
  username,
  password,
  deviceId,
  dispatch,
  setPassword,
) => {
  loginMutation({
    email_id: username,
    password,
    device_id: deviceId,
  }).then(response => {
    if (response.error && response.error.data?.messages?.error) {
      Toast.show({
        text1: 'Login Failed',
        text2: response.error.data.messages.error || 'Invalid credentials',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
      setPassword(' ');
    } else if (response && response.data.status === 'success') {
      const {token, user_id} = response.data;
      AsyncStorage.setItem('authToken', token);
      AsyncStorage.setItem('userId', user_id);
      dispatch(login({user_id, token}));
      Toast.show({
        text1: 'Login Successful!',
        text2: `Welcome`,
        type: 'success',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  });
};
