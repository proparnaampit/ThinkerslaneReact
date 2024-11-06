import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const CustomHeader = ({title, profileImage}: any) => {
  return (
    <View style={styles.headerContainer}>
      <Image source={require('../assets/loginLogo.png')} style={styles.logo} />
      <Image
        source={require('../assets/loginBack.jpg')}
        style={styles.profileImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  logo: {
    height: 40,
    left: 0,
    width: '40%',
    resizeMode: 'contain',
  },
});

export default CustomHeader;
