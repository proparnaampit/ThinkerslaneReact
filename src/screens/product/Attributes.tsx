import React from 'react';
import {TextInput, Text, ScrollView} from 'react-native';
import {useFormContext} from '../context/FormContextType';
import informationStyles from './css/information';

const ProductInputForm = () => {
  const {formData, updateFormData} = useFormContext();
  const productData = formData?.product || {
    binding: '',
    weight: '',
    quantity: '',
    width: '',
    affiliateLink: '',
    length: '',
    height: '',
  };

  const handleInputChange = (key: string, value: string) => {
    updateFormData('product', {
      ...productData,
      [key]: value,
    });
  };

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Attributes</Text>
      <Text style={informationStyles.noteText}>
        Enter the attributes of the books you are selling. This will help in
        better categorization and searchability of your products.
      </Text>
      <Text style={informationStyles.label}>Binding</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.binding}
        onChangeText={text => handleInputChange('binding', text)}
        placeholder="Enter binding type"
      />

      <Text style={informationStyles.label}>Weight (in gm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.weight}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          handleInputChange('weight', numericText);
        }}
        placeholder="Enter weight in grams"
        keyboardType="numeric"
      />

      <Text style={informationStyles.label}>Quantity * :</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.quantity}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          handleInputChange('quantity', numericText);
        }}
        placeholder="Enter quantity"
        keyboardType="numeric"
      />

      <Text style={informationStyles.label}>Width (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.width}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          handleInputChange('width', numericText);
        }}
        placeholder="Enter width in cm"
        keyboardType="numeric"
      />

      <Text style={informationStyles.label}>Affiliate Link</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.affiliateLink}
        onChangeText={text => handleInputChange('affiliateLink', text)}
        placeholder="Enter affiliate link"
      />

      <Text style={informationStyles.label}>Length (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.length}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          handleInputChange('length', numericText);
        }}
        placeholder="Enter length in cm"
        keyboardType="numeric"
      />

      <Text style={informationStyles.label}>Height (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.height}
        onChangeText={text => {
          const numericText = text.replace(/[^0-9]/g, '');
          handleInputChange('height', numericText);
        }}
        placeholder="Enter height in cm"
        keyboardType="numeric"
      />
    </ScrollView>
  );
};

export default ProductInputForm;
