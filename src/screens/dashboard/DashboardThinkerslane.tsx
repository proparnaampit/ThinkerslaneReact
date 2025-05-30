import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import dashboardstyles from './dashboardstyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../components/CustomText';

const DashboardScreenThinkerslane = () => {
  const navigation: any = useNavigation();

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
      <CustomText style={dashboardstyles.title}>Welcome</CustomText>
      <View style={{alignItems: 'center', marginBottom: 10}}>
        <CustomText style={{fontSize: 15, textAlign: 'center'}}>
          Location
        </CustomText>
        <FontAwesome
          name="map-marker"
          size={20}
          style={{color: commonstyles.thinkerslane.color, marginTop: 4}}
        />
      </View>

      <View style={{alignItems: 'center'}}>
        <CustomText style={{fontSize: 12, width: '60%', textAlign: 'center'}}>
          {location}
        </CustomText>
      </View>

      <View style={dashboardstyles.buttonContainer}>
        <TouchableOpacity
          style={[
            commonstyles.button,
            commonstyles.expenseButton,
            {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12},
          ]}
          onPress={handleAddExpense}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7}}
            />
            <CustomText style={[commonstyles.buttonText, {fontSize: 14}]}>
              Add Expenses
            </CustomText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            commonstyles.button,
            commonstyles.orderButton,
            {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12},
          ]}
          onPress={handleAddOrder}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7}}
            />
            <CustomText style={commonstyles.orderButtonText}>
              Add Order
            </CustomText>
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 20,
          width: '90%',
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: '#fff5d9',
          alignSelf: 'center',
          overflow: 'hidden',
        }}>
        <FontAwesome
          name="exclamation-triangle"
          size={20}
          color="#f1c40f"
          style={{marginRight: 12}}
        />
        <CustomText
          style={{
            flexShrink: 1,
            flexWrap: 'wrap',
            fontSize: 13,
            textAlign: 'left',
            borderRadius: 10,
          }}>
          If Anything Wrong is Happening, Order not taking, Please close the
          app, clear it from the recent apps and open it again. If still not
          working please contact us.
        </CustomText>
      </View>
    </View>
  );
};

export default DashboardScreenThinkerslane;
