import React from 'react';
import {Text, StyleSheet} from 'react-native';

const CustomText = ({style, children, ...props}: any) => (
  <Text style={[styles.text, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Avenir Regular',
    color: 'black',
  },
});

export default CustomText;
