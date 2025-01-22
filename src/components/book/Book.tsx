import React, {useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import CustomText from '../CustomText';
import singleBookStyles from './singleBookStyles';
import FastImage from 'react-native-fast-image';

const Book = ({data}: any) => {
  const imageUrl = `https://thinkerslane.com/public/uploads/admin/books/${
    data.image.split(',')[0]
  }`;

  const short_description = data.short_description;
  const plainTextDescription = short_description
    .replace(/<[^>]*>/g, '')
    .replace(/\\r|\\n/g, ' ')
    .split(' ')
    .slice(0, 20)
    .join(' ');

  return (
    <View style={singleBookStyles.container}>
      <FastImage
        source={{uri: imageUrl}}
        style={singleBookStyles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={singleBookStyles.textContainer}>
        <CustomText style={singleBookStyles.title}>{data.name}</CustomText>
        <CustomText style={singleBookStyles.subtitle}>{data.author}</CustomText>
        <CustomText style={singleBookStyles.publisher}>
          Publisher: {data?.publisher_name}
        </CustomText>
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
