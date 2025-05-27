import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const PriceInputScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    price: '',
    offeredPrice: '',
  });

  const handleInputChange = (key: 'price' | 'offeredPrice', value: string) => {
    setFormData({ ...formData, [key]: value });
    console.log('Current Form Data:', { ...formData, [key]: value }); // Log data for debugging
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pricing</Text>
      <Text style={styles.label}>Original Price</Text>
      <TextInput
        style={styles.input}
        value={formData.price}
        onChangeText={(text) => handleInputChange('price', text)}
        keyboardType="numeric"
        placeholder="Enter original price"
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Offered Price</Text>
      <TextInput
        style={styles.input}
        value={formData.offeredPrice}
        onChangeText={(text) => handleInputChange('offeredPrice', text)}
        keyboardType="numeric"
        placeholder="Enter offered price"
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
    header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
});

export default PriceInputScreen;