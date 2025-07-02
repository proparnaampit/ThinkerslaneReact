import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import informationStyles from '../../screens/product/css/information';

const CustomPicker = ({
  label,
  selectedValue,
  onValueChange,
  data,
  valueKey = 'id',
  labelKey = 'description',
  placeholder = '',
}: any) => {
  const [searchText, setSearchText] = useState('');

  // Filter data based on search text with safety checks
  const filteredData = data
    ? data.filter(item => {
        const label = item[labelKey];
        return (
          typeof label === 'string' &&
          label.toLowerCase().includes(searchText.toLowerCase())
        );
      })
    : [];

  // Handle case when selectedValue is not in filteredData
  const isValidSelection = filteredData.some(
    item => item[valueKey] === selectedValue,
  );

  return (
    <>
      {label ? <Text style={informationStyles.label}>{label}</Text> : null}
      <View style={informationStyles.pickerContainer}>
        <TextInput
          style={[informationStyles.picker, {marginBottom: 10, padding: 8}]}
          placeholder="Search..."
          value={searchText}
          onChangeText={text => {
            setSearchText(text);
            // Optionally reset selectedValue if it’s no longer in filteredData
            if (!isValidSelection && text) {
              onValueChange('');
            }
          }}
        />
        <Picker
          selectedValue={isValidSelection ? selectedValue : ''}
          onValueChange={onValueChange}
          style={informationStyles.picker}>
          {placeholder && <Picker.Item label={placeholder} value="" />}
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <Picker.Item
                key={item[valueKey]}
                label={item[labelKey]}
                value={item[valueKey]}
                style={{fontSize: 13}}
              />
            ))
          ) : (
            <Picker.Item label="No results found" value="" />
          )}
        </Picker>
      </View>
    </>
  );
};

export default CustomPicker;
