import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout as reduxLogout} from '../redux/authSlice';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {saveAuthState} from '../redux/authSlice';
import CustomText from './CustomText';
import DeviceInfo from 'react-native-device-info';
import {useLogoutMutation} from '../services/authApi';
import {useFetchUserInfoQuery} from '../services/commonService';

const CustomHeader = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [logout] = useLogoutMutation();
  const user = useSelector((state: any) => state?.auth?.userId);
  const {data, error, isLoading} = useFetchUserInfoQuery(user);
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const [deviceId, setDeviceId] = useState<any>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const getDeviceId = async () => {
      const uniqueId = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    };

    getDeviceId();
  }, []);

  const handleLogout = async () => {
    dispatch(reduxLogout());
    await logout({device_id: deviceId});
    await saveAuthState(null);
    Toast.show({
      text1: 'Logged Out',
      text2: 'You have been logged out successfully.',
      type: 'success',
      position: 'top',
      visibilityTime: 2000,
    });
  };
  const userImage = data?.userDeatils?.image;
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../assets/logo-2.png')}
        style={styles.logo}
      />
      <View style={styles.iconContainer}>
        <CustomText style={{marginRight: 10}}>
          {data?.userDeatils?.name}
        </CustomText>

        <TouchableOpacity onPress={toggleDropdown}>
          <Image
            source={
              userImage ? {uri: userImage} : require('../assets/profile.png')
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={isDropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownMenu}>
            <MaterialCommunityIcons name="logout" size={24} color="#333" />
            <TouchableOpacity onPress={handleLogout} style={styles.menuItem}>
              <CustomText style={styles.menuItemText}>Logout</CustomText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  logo: {
    height: 30,
    width: '20%',
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButton: {
    marginRight: 30,
    width: 40,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -4,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  cartBadgeText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    flexDirection: 'row',
    width: 120,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomHeader;
