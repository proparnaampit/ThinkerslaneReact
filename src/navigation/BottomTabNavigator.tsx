import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/dashboard/Dashboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import ExpenseScreen from '../screens/expenses/ExpenseScreen';
import CustomHeader from '../components/Header';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import OrderScreen from '../screens/order/OrderScreen';
import AddOrderScreen from '../screens/order/AddOrderScreen';
import BookListScreen from '../screens/booklist/Booklist';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
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
    </Tab.Navigator>
  );
}
