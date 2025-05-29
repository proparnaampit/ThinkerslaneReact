import React, {useState, useEffect} from 'react';
import {PermissionsAndroid, Platform, ActivityIndicator} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {
  View,
  Modal,
  ToastAndroid,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useLoginMutation} from '../../services/authApi';
import loginStyles from './loginstyles';
import Toast from 'react-native-toast-message';
import commonstyles from '../../components/commonstyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomText from '../../components/CustomText';
import DeviceInfo from 'react-native-device-info';
import {loginUser} from '../../services/authService';
import informationStyles from '../product/css/information';
import backImage from '../../assets/back.png';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [deviceId, setDeviceId] = useState<any>(null);
  const [loginMutation] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
        return address;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };

  const handleForgetPass = () => {
    setModalVisible(true);
  };

  const handleLogin = async () => {
    const currentHour = new Date().getHours();

    if (username == 'stafftest@gmail.com') {
      //do nothing
    } else if (currentHour < 9 || currentHour >= 21) {
      Toast.show({
        text1: 'Login Time Restriction',
        text2: 'Login is only allowed between 9 AM and 9 PM.',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });

      ToastAndroid.show(
        'Login is only allowed between 9 AM and 9 PM.',
        ToastAndroid.LONG,
      );

      return;
    }

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
    const location: any = await getCurrentLocation();
    let address;
    if (location && location?.coords) {
      if (location.coords.latitude && location.coords.longitude) {
        address = await getAddressFromCoordinates(
          location.coords.latitude,
          location.coords.longitude,
        );
      }
    }

    setIsLoading(false);

    loginUser(
      loginMutation,
      username,
      password,
      deviceId,
      address,
      dispatch,
      setPassword,
    );
    return;
  };

  return (
    <ImageBackground style={loginStyles.container} source={backImage}>
      <Image
        source={require('../../assets/calligraphy_Suprokash.png')}
        style={loginStyles.logo}
      />
      <View style={loginStyles.overlay} />
      <View style={loginStyles.logoContainer}>
        {countdown && (
          <View style={loginStyles.countdownContainer}>
            <CustomText style={loginStyles.countdownText}>
              {countdown}
            </CustomText>
            <CustomText style={loginStyles.logintext}>
              Login Allowed only between 9AM to 9PM
            </CustomText>
          </View>
        )}
        <View
          style={[
            loginStyles.inputContainer,
            {
              borderBottomColor: isUsernameFocused ? '#4CAF50' : '#223d79',
            },
          ]}>
          <Ionicons
            name="person"
            size={20}
            color="#223d79"
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
              borderBottomColor: isPasswordFocused ? '#4CAF50' : '#223d79',
            },
          ]}>
          <Ionicons
            name="lock-closed"
            size={20}
            color="#223d79"
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
        <TouchableOpacity style={[loginStyles.gap]} onPress={handleForgetPass}>
          <CustomText style={{color: 'black'}}>Forget Pass?</CustomText>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={commonstyles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={loginStyles.modalBackground}>
          <View style={loginStyles.modalContainer}>
            <CustomText style={loginStyles.modalText}>
              Please contact the admin for the username and password.
            </CustomText>

            <TouchableOpacity
              style={loginStyles.modalButton}
              onPress={() => setModalVisible(false)}>
              <CustomText style={loginStyles.modalButtonText}>Close</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default LoginScreen;
