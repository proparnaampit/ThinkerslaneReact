import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import dashboardstyles from './dashboardstyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../components/CustomText';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const handleAddExpense = () => {
    navigation.navigate('AddExpenses');
  };

  const handleAddOrder = () => {
    navigation.navigate('AddOrder');
  };

  const [location, setLocation] = useState('');

  useEffect(() => {
    const retrieveLocation = async () => {
      try {
        const storedLocation = await AsyncStorage.getItem('location');
        if (storedLocation !== null) {
          setLocation(storedLocation);
        } else {
          setLocation('No location found');
        }
      } catch (error) {
        console.error('Error retrieving location:', error);
        setLocation('Error retrieving location');
      }
    };

    retrieveLocation();
  }, []);

  return (
    <View style={dashboardstyles.container}>
      <CustomText style={dashboardstyles.title}>
        Welcome to the Dashboard!
      </CustomText>
      <CustomText style={[{fontSize: 15, width: '100%', textAlign: 'center'}]}>
        Logged In Location
        <FontAwesome
          name="map-marker"
          size={20}
          style={{color: commonstyles.thinkerslane.color, marginLeft: 10}}
        />
      </CustomText>
      <CustomText style={[{fontSize: 12, width: '100%', textAlign: 'center'}]}>
        {location}
      </CustomText>

      <View style={dashboardstyles.buttonContainer}>
        <TouchableOpacity
          style={[commonstyles.button, commonstyles.expenseButton]}
          onPress={handleAddExpense}>
          <FontAwesome name="money" size={24} style={{color: 'white'}} />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7, marginTop: 10}}
            />
            <CustomText
              style={[commonstyles.buttonText, {fontSize: 14, marginTop: 10}]}>
              Add Expenses
            </CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[commonstyles.button, commonstyles.orderButton]}
          onPress={handleAddOrder}>
          <FontAwesome
            name="shopping-cart"
            size={24}
            style={{color: '#a92737'}}
          />

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: '#a92737', marginRight: 7, marginTop: 10}}
            />
            <CustomText style={[commonstyles.orderButtonText, {marginTop: 10}]}>
              Add Order
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
      <CustomText
        style={[
          {
            fontSize: 15,
            width: '100%',
            textAlign: 'center',
            backgroundColor: '#ccc',
            padding: 20,
          },
        ]}>
        If Anything Wrong is Happening , Order not taking , Please close the app
        , clear it from the recent apps and open it again. If still not working
        please contact us.
      </CustomText>
    </View>
  );
};

export default DashboardScreen;
