import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, ScrollView } from 'react-native';

const ProductInputForm = () => {
  const [formData, setFormData] = useState({
    binding: '',
    weight: '',
    quantity: '',
    width: '',
    affiliateLink: '',
    length: '',
    height: '',
  });

  const handleInputChange = (key:any, value:any) => {
    setFormData({ ...formData, [key]: value });
  };

 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Attributes</Text>
      <Text style={styles.label}>Binding</Text>
      <TextInput
        style={styles.input}
        value={formData.binding}
        onChangeText={(text) => handleInputChange('binding', text)}
        placeholder="Enter binding type"
      />

      <Text style={styles.label}>Weight (in gm)</Text>
      <TextInput
        style={styles.input}
        value={formData.weight}
        onChangeText={(text) => handleInputChange('weight', text)}
        placeholder="Enter weight in grams"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        value={formData.quantity}
        onChangeText={(text) => handleInputChange('quantity', text)}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Width (in cm)</Text>
      <TextInput
        style={styles.input}
        value={formData.width}
        onChangeText={(text) => handleInputChange('width', text)}
        placeholder="Enter width in cm"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Affiliate Link</Text>
      <TextInput
        style={styles.input}
        value={formData.affiliateLink}
        onChangeText={(text) => handleInputChange('affiliateLink', text)}
        placeholder="Enter affiliate link"
      />

      <Text style={styles.label}>Length (in cm)</Text>
      <TextInput
        style={styles.input}
        value={formData.length}
        onChangeText={(text) => handleInputChange('length', text)}
        placeholder="Enter length in cm"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Height (in cm)</Text>
      <TextInput
        style={styles.input}
        value={formData.height}
        onChangeText={(text) => handleInputChange('height', text)}
        placeholder="Enter height in cm"
        keyboardType="numeric"
      />

      
    </ScrollView>
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
    marginBottom: 5,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default ProductInputForm;