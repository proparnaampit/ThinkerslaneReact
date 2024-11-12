import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import CustomText from './CustomText';
import singleBookStyles from './singleBookStyles';

const Book = ({data}: any) => {
  const imageUrl = `https://thinkerslane.com/public/uploads/admin/books/${
    data.image.split(',')[0]
  }`;

  const short_description = data.short_description;
  const plainTextDescription = short_description
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\\r|\\n/g, ' ') // Replace any \r or \n with a space
    .split(' ') // Split the text into words
    .slice(0, 20) // Take only the first 100 words
    .join(' '); // Join the words back into a string

  if (data.id == 204) {
    console.log(imageUrl);
  }
  return (
    <View style={singleBookStyles.container}>
      <Image source={{uri: imageUrl}} style={singleBookStyles.image} />
      <View style={singleBookStyles.textContainer}>
        <CustomText style={singleBookStyles.title}>{data.name}</CustomText>
        {data.quantity > 0 && (
          <View style={singleBookStyles.price}>
            <CustomText style={singleBookStyles.priceText}>
              Rs.{data.price}
            </CustomText>
          </View>
        )}
        <CustomText style={singleBookStyles.stock}>
          Available Stock : {data.quantity > 0 ? data.quantity : 'Out of Stock'}
        </CustomText>
        <CustomText style={singleBookStyles.description}>
          {plainTextDescription}
        </CustomText>
      </View>
      <CustomText
        style={[
          singleBookStyles.stockLabel,
          {color: data.quantity > 0 ? 'green' : 'red'},
        ]}>
        {data.quantity > 0 ? 'In Stock' : 'Out of Stock'}
      </CustomText>
    </View>
  );
};

export default Book;
