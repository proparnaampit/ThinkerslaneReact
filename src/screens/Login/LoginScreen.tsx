import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {login, saveAuthState} from '../../redux/authSlice';
import {useLoginMutation} from '../../services/authApi';
import loginStyles from './loginstyles';
import Toast from 'react-native-toast-message';
import commonstyles from '../../components/commonstyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import {loginUser} from '../../services/authService';

// 1. https://staging.thinkerslane.com/th1/getBooks --- eat mone hoy search er jonno
// 2. https://staging.thinkerslane.com/th1/login --- For login
// 3. https://staging.thinkerslane.com/th1/logout --- For logout
// 4. https://staging.thinkerslane.com/th1/getPublishers --- For Publisher
// https://staging.thinkerslane.com/th1/getUserinfo?user_id=11419

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [loginMutation] = useLoginMutation();

  useEffect(() => {
    const getDeviceId = async () => {
      const uniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    };

    getDeviceId();
  }, []);

  const handleLogin = async () => {
    if (!deviceId) {
      Toast.show({
        text1: 'Device ID not available',
        text2: 'Error',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
      return;
    }

    if (!username) {
      Toast.show({
        text1: 'Please enter your email',
        text2: 'Error',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
      return;
    }

    if (!password) {
      Toast.show({
        text1: 'Please enter password',
        text2: 'Error',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
      return;
    }

    loginUser(
      loginMutation,
      username,
      password,
      deviceId,
      dispatch,
      setPassword,
    );
    return;
  };

  return (
    <ImageBackground
      source={require('../../assets/loginBack.jpg')}
      style={loginStyles.container}>
      <Image
        source={require('../../assets/loginLogo.png')}
        style={loginStyles.logo}
      />
      <View style={loginStyles.overlay} />
      <View style={loginStyles.logoContainer}>
        <CustomText style={loginStyles.signInText}>Sign In</CustomText>

        <View
          style={[
            loginStyles.inputContainer,
            {
              borderBottomColor: isUsernameFocused ? '#4CAF50' : 'red',
            },
          ]}>
          <Ionicons
            name="person"
            size={20}
            color="#BE3240"
            style={loginStyles.icon}
          />
          <TextInput
            placeholder="Email"
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
        </View>

        <View
          style={[
            loginStyles.inputContainer,
            {
              borderBottomColor: isPasswordFocused ? '#4CAF50' : 'red',
            },
          ]}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="#BE3240"
            style={loginStyles.icon}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={loginStyles.input}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
          />
        </View>

        <TouchableOpacity
          style={[
            commonstyles.button,
            commonstyles.normalButton,
            loginStyles.gap,
          ]}
          onPress={handleLogin}>
          <CustomText style={commonstyles.buttonText}>Login</CustomText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;
