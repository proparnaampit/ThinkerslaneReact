import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/Dashboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  // const dispatch = useDispatch();
  // const {isLoggedIn} = useSelector((state: any) => state.auth);
  // const [deviceId, setDeviceId] = useState(null);
  // // const [logout] = useLogoutMutation();

  // useEffect(() => {
  //   const getDeviceId = async () => {
  //     const uniqueId: any = await DeviceInfo.getUniqueId();
  //     setDeviceId(uniqueId);
  //   };

  //   getDeviceId();
  // }, []);

  // const checkTimeAndLogout = async () => {
  //   const currentTime = new Date();
  //   const currentHour = currentTime.getHours();

  //   if (currentHour < 9 || currentHour >= 21) {
  //     dispatch(reuxLogout());
  //     await logout({device_id: deviceId});
  //     await saveAuthState(null);

  //     ToastAndroid.show(
  //       'You have been logged out as it is outside the allowed time (9 AM - 9 PM). You can log in tomorrow after 9 AM.',
  //       ToastAndroid.LONG,
  //     );
  //   }
  // };

  // useEffect(() => {
  //   if (isLoggedIn !== null && isLoggedIn) {
  //     checkTimeAndLogout();
  //   }
  // }, [isLoggedIn]);

  // if (isLoggedIn === null) {
  //   return (
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarStyle: {
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons
              name="dashboard"
              color={color}
              size={24}
              style={{zIndex: 10}}
            />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Expenses"
        component={ExpenseScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="money-check-dollar" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
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
      />
      <Tab.Screen
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
      />
      <Tab.Screen
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
      />
      <Tab.Screen
        name="BookList"
        component={BookListScreen}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="book" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        initialParams={{add: false}}
        options={{
          tabBarIcon: ({color, size}) => (
            <FontAwesome6 name="cart-shopping" color={color} size={size} />
          ),
          headerShown: true,
        }}
      />
      <Tab.Screen
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
      />
      <Tab.Screen
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
      />
    </Tab.Navigator>
  );
}
