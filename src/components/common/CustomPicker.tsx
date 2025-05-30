import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
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
  return (
    <>
      {label ? <Text style={informationStyles.label}>{label}</Text> : null}
      <View style={informationStyles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={informationStyles.picker}>
          {placeholder && <Picker.Item label={placeholder} value="" />}
          {data.map(item => (
            <Picker.Item
              key={item[valueKey]}
              label={item[labelKey]}
              value={item[valueKey]}
              style={{fontSize: 13}}
            />
          ))}
        </Picker>
      </View>
    </>
  );
};

export default CustomPicker;
