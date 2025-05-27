import React from 'react';
import {View, TextInput, StyleSheet, Text} from 'react-native';
import pricingStyles from './css/pricing';
import informationStyles from './css/information';
import {useFormContext} from '../context/FormContextType';

const PriceInputScreen: React.FC = () => {
  const {formData, updateFormData} = useFormContext();

  const handleInputChange = (key: 'price' | 'offered_price', value: string) => {
    updateFormData('pricing', {[key]: value});
  };

  const pricingData = formData.pricing || {};

  return (
    <View style={informationStyles.container}>
      <Text style={informationStyles.header}>Pricing</Text>
      <Text style={informationStyles.noteText}>
        Enter the Price of the books you are selling. This will be used to
        calculate the total price for the customer.
      </Text>

      <Text style={informationStyles.label}>Original Price * :</Text>
      <TextInput
        style={informationStyles.input}
        value={pricingData.price || ''}
        onChangeText={text => handleInputChange('price', text)}
        keyboardType="numeric"
        placeholder="Enter original price"
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Offered Price * :</Text>
      <TextInput
        style={informationStyles.input}
        value={pricingData.offered_price || ''}
        onChangeText={text => handleInputChange('offered_price', text)}
        keyboardType="numeric"
        placeholder="Enter offered price"
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default PriceInputScreen;
