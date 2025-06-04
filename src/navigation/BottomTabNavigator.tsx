import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/Dashboard';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import ExpenseScreen from '../screens/expenses/ExpenseScreen';
import CustomHeader from '../components/Header';
import {ActivityIndicator, View, ToastAndroid} from 'react-native';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import OrderScreen from '../screens/order/OrderScreen';
import AddOrderScreen from '../screens/order/AddOrderScreen';
import BookListScreen from '../screens/booklist/Booklist';
import Cart from '../screens/cart/Cart';
import Checkout from '../screens/checkout/Checkout';
import PaymentScreen from '../screens/payment/Payment';
import Bill from '../screens/bill/Bill';
import OrderHistory from '../screens/orderhistory/OrderHistory';
import DeviceInfo from 'react-native-device-info';
import {logout as reuxLogout} from '../redux/authSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useLogoutMutation} from '../services/authApi';
import {saveAuthState} from '../redux/authSlice';
import {useFetchUserInfoQuery} from '../services/commonService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductUpload from '../screens/product/ProductUpload';
import BookDetails from '../screens/bookdetails/BookDetails';
import ProductUpdate from '../screens/update/updateProduct';
import DashboardScreenThinkerslane from '../screens/dashboard/DashboardThinkerslane';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const dispatch = useDispatch();
  const {isLoggedIn} = useSelector((state: any) => state.auth);
  const [deviceId, setDeviceId] = useState(null);
  const [logout] = useLogoutMutation();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id);
      } catch (error) {
        console.error('Error fetching userId:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const getDeviceId = async () => {
      const uniqueId: any = await DeviceInfo.getUniqueId();
      setDeviceId(uniqueId);
    };

    getDeviceId();
  }, []);

  const checkTimeAndLogout = async () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    if (currentHour < 9 || currentHour >= 21) {
      dispatch(reuxLogout());
      await logout({device_id: deviceId});
      await saveAuthState(null);

      ToastAndroid.show(
        'You have been logged out as it is outside the allowed time (9 AM - 9 PM). You can log in tomorrow after 9 AM.',
        ToastAndroid.LONG,
      );
    }
  };

  useEffect(() => {
    if (userId !== null && isLoggedIn && userId !== '13026') {
      checkTimeAndLogout();
    }
  }, [isLoggedIn, userId]);

  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: {width: 0, height: 0},
          shadowRadius: 0,
          backgroundColor: 'white',
        },
        tabBarActiveTintColor: '#213e79', // active icon color
        tabBarInactiveTintColor: '#717f90',
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreenThinkerslane}
        options={{
          tabBarIcon: ({color, size}) => (
            <Entypo name="home" color={color} size={24} style={{zIndex: 10}} />
          ),
          headerShown: true,
        }}
      />
      {/* <Tab.Screen
        name="Expenses"
        component={ExpenseScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="money-check-dollar" color={color} size={size} />
          ),
          headerShown: true,
        }}
      /> */}
      {/* <Tab.Screen
        name="AddExpenses"
        component={AddExpenseScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="money-check-dollar" color={color} size={size} />
          ),
          tabBarButton: () => null,
          headerShown: true,
        }}
      /> */}
      {/* <Tab.Screen
        name="Orders"
        component={OrderScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="money-check-dollar" color={color} size={size} />
          ),
          tabBarButton: () => null,
          headerShown: true,
        }}
      /> */}
      <Tab.Screen
        name="Product"
        component={ProductUpload}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="cloud-upload"
              color={color}
              size={size}
            />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="BookDetails"
        component={BookDetails}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="book-open-page-variant"
              color={color}
              size={size}
            />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Update"
        component={ProductUpdate}
        initialParams={{add: false}}
        options={{
          tabBarButton: () => null,
          headerShown: true,
        }}
      />

      {/* <Tab.Screen
        name="AddOrder"
        component={AddOrderScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="money-check-dollar" color={color} size={size} />
          ),
          tabBarButton: () => null,
          headerShown: false,
          tabBarStyle: {display: 'none'},
        }}
      /> */}
      {/* <Tab.Screen
        name="BookList"
        component={BookListScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="book" color={color} size={size} />
          ),
          headerShown: true,
        }}
      /> */}
      {/* <Tab.Screen
        name="Cart"
        component={Cart}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="cart-shopping" color={color} size={size} />
          ),
          headerShown: true,
        }}
      /> */}
      {/* <Tab.Screen
        name="Checkout"
        component={Checkout}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="cart-shopping" color={color} size={size} />
          ),
          headerShown: false,
          tabBarButton: () => null,
          tabBarStyle: {display: 'none'},
        }}
      /> */}
      {/* <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="cart-shopping" color={color} size={size} />
          ),
          headerShown: false,
          tabBarButton: () => null,
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="Bill"
        component={Bill}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="cart-shopping" color={color} size={size} />
          ),
          headerShown: false,
          tabBarButton: () => null,
          tabBarStyle: {display: 'none'},
        }}
      />
      <Tab.Screen
        name="OrderHistory"
        component={OrderHistory}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
          headerShown: true,
          tabBarLabel: 'Orders',
        }}
      /> */}
    </Tab.Navigator>
  );
}
