import React, {useState} from 'react';
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
import loginStyles from './loginstyles';
import Toast from 'react-native-toast-message';
import commonstyles from '../../components/commonstyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (username === 'Test' && password === 'Test') {
      const user = {username};
      dispatch(login(user));
      await saveAuthState(user);
      Toast.show({
        text1: 'Login Successful!',
        text2: `Welcome, ${username}`,
        type: 'success',
        position: 'top',
        visibilityTime: 2000,
      });
    } else {
      Toast.show({
        text1: 'Login Failed',
        text2: 'Invalid username or password',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
    }
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
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            style={loginStyles.input}
            onFocus={() => setIsUsernameFocused(true)}
            onBlur={() => setIsUsernameFocused(false)}
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
