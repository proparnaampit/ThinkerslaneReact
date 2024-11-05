import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login/LoginScreen';
import {useSelector} from 'react-redux';
import BottomTabNavigator from './BottomTabNavigator';
import {enableScreens} from 'react-native-screens';
enableScreens();

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
