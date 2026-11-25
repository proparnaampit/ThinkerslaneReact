import React from 'react';
import {TextInput, Text, ScrollView} from 'react-native';
import {useFormContext} from '../context/FormContextType';
import informationStyles from './css/information';
import CustomPicker from '../../components/common/CustomPicker';

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

  const bindingOptions = [
    {id: 'HARDBOUND', description: 'Hardbound'},
    {id: 'PAPERBACK', description: 'Paper Back'},
    {id: 'SPIRAL', description: 'Spiral Binding'},
  ];

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Attributes</Text>
      <Text style={informationStyles.noteText}>
        Enter the attributes of the books you are selling. This will help in
        better categorization and searchability of your products.
      </Text>

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
      {bindingOptions && (
        <CustomPicker
          label="Binding *:"
          selectedValue={productData.binding}
          onValueChange={(value: string) => handleInputChange('binding', value)}
          data={bindingOptions}
          placeholder="Select binding type"
        />
      )}

      <Text style={informationStyles.label}>Height * (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.height}
        onChangeText={text => {
          const numericText = text
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*?)\..*/g, '$1');
          handleInputChange('height', numericText);
        }}
        placeholder="Enter height in cm"
        keyboardType="decimal-pad"
      />

      <Text style={informationStyles.label}>Width * (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.width}
        onChangeText={text => {
          const numericText = text
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*?)\..*/g, '$1');
          handleInputChange('width', numericText);
        }}
        placeholder="Enter width in cm"
        keyboardType="decimal-pad"
      />

      <Text style={informationStyles.label}>Length * (in cm)</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.length}
        onChangeText={text => {
          const numericText = text
            .replace(/[^0-9.]/g, '')
            .replace(/(\..*?)\..*/g, '$1');
          handleInputChange('length', numericText);
        }}
        placeholder="Enter length in cm"
        keyboardType="decimal-pad"
      />

      <Text style={informationStyles.label}>Weight * (in gm)</Text>
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

      {/* <Text style={informationStyles.label}>Affiliate Link</Text>
      <TextInput
        style={informationStyles.input}
        value={productData.affiliateLink}
        onChangeText={text => handleInputChange('affiliateLink', text)}
        placeholder="Enter affiliate link"
      /> */}
    </ScrollView>
  );
};

export default ProductInputForm;
