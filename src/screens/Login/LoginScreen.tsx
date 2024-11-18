import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
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

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [deviceId, setDeviceId] = useState<any>(null);
  const [loginMutation] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDeviceId = async () => {
      const uniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    };

    getDeviceId();
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app requires access to your location to log in.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const getCurrentLocation = () =>
    new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => resolve(position),
        error => reject(error),
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });

  const getAddressFromCoordinates = async (latitude: any, longitude: any) => {
    const API_KEY = '14050353342d479cad920486863ea4c9';
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${API_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results.length > 0) {
        const address = data.results[0].formatted;
        console.log('Address:', address);
        return address;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleLogin = async () => {
    const hasLocationPermission = await requestLocationPermission();
    if (!hasLocationPermission) {
      Toast.show({
        text1: 'Permission Denied',
        text2: 'Location permission is required to log in.',
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
    setIsLoading(true);
    const location = await getCurrentLocation();

    if (location && location?.coords) {
      if (location.coords.latitude && location.coords.longitude) {
        const address = await getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude,
        );
      }
    } else {
      console.log('Location is not available');
    }
    setIsLoading(false);

    loginUser(
      loginMutation,
      username,
      password,
      deviceId,
      location,
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

      {isLoading && (
        <View style={commonstyles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
    </ImageBackground>
  );
};

export default LoginScreen;
