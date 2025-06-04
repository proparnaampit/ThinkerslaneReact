import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import CustomText from '../CustomText';
import singleBookStyles from './singleBookStyles';
import FastImage from 'react-native-fast-image';
import informationStyles from '../../screens/product/css/information';
import {Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const BookDetailsComp = ({data, onClose}: any) => {
  if (!data) return null;
  const navigation: any = useNavigation();
  const shortDescription = data.short_description || '';

  const plainTextDescription = shortDescription
    .replace(/<[^>]*>/g, '')
    .replace(/\\r|\\n/g, ' ')
    .split(' ')
    .slice(0, 20)
    .join(' ');
  const imageUrl = data.images?.[0]
    ? `https://staging.thinkerslane.com/public/uploads/admin/books/${data.image}`
    : null;
  const publisher =
    data.publisher_name || data?.publisher_details?.name || 'Not Assigned';

  const isInStock = parseInt(data.quantity) > 0;

  const handleEditBook = () => {
    Alert.alert(
      'Confirm Edit',
      'Are you sure you want to edit this book?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Update', {data});
            onClose();
          },
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <View style={singleBookStyles.container}>
      {imageUrl && (
        <FastImage
          source={{uri: imageUrl}}
          style={singleBookStyles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}

      <View style={singleBookStyles.textContainer}>
        <CustomText style={singleBookStyles.title}>
          {data.name || 'Untitled'}
        </CustomText>

        {data.author ? (
          <CustomText style={singleBookStyles.subtitle}>
            {data.author}
          </CustomText>
        ) : null}

        {data.publisher && (
          <CustomText style={singleBookStyles.isbn}>
            publisher: {data.publisher}
          </CustomText>
        )}

        <CustomText style={singleBookStyles.stock}>
          Available Quantity: {isInStock ? data.quantity : 'Out of Stock'}
        </CustomText>

        {isInStock && (
          <View style={singleBookStyles.price}>
            <CustomText style={singleBookStyles.priceText}>
              Rs.{data.price}
            </CustomText>
          </View>
        )}
        {data.offered_price && (
          <CustomText style={singleBookStyles.isbn}>
            offeredPrice: {data.offered_price}
          </CustomText>
        )}

        <CustomText style={singleBookStyles.isbn}>
          ISBN: {data?.isbn_number ? data?.isbn_number : null}
        </CustomText>
        {data.binding && (
          <CustomText style={singleBookStyles.isbn}>
            binding: {data.binding}
          </CustomText>
        )}

        {data.width && (
          <CustomText style={singleBookStyles.isbn}>
            width: {data.width}
          </CustomText>
        )}

        {data.height && (
          <CustomText style={singleBookStyles.isbn}>
            height: {data.height}
          </CustomText>
        )}

        {data.length && (
          <CustomText style={singleBookStyles.isbn}>
            length: {data.length}
          </CustomText>
        )}
        {data.created_at && (
          <CustomText style={singleBookStyles.isbn}>
            created at: {data.created_at}
          </CustomText>
        )}

        {data.updated_at && (
          <CustomText style={singleBookStyles.isbn}>
            updated at: {data.updated_at}
          </CustomText>
        )}

        {data.publish_date && (
          <CustomText style={singleBookStyles.isbn}>
            publish date: {data.publish_date}
          </CustomText>
        )}

        {data.edited_by && (
          <CustomText style={singleBookStyles.isbn}>
            edited by: {data.edited_by}
          </CustomText>
        )}
        {data.category.name && (
          <CustomText style={singleBookStyles.isbn}>
            category name: {data.category.name}
          </CustomText>
        )}

        {data.langauge && (
          <CustomText style={singleBookStyles.isbn}>
            langauge: {data.langauge}
          </CustomText>
        )}

        {data.description && (
          <CustomText style={singleBookStyles.isbn}>
            description: {data.description}
          </CustomText>
        )}

        {data.short_description && (
          <CustomText style={singleBookStyles.isbn}>
            short description: {data.short_description}
          </CustomText>
        )}

        {data.affiliateLink && (
          <CustomText style={singleBookStyles.isbn}>
            affiliateLink: {data.affiliateLink}
          </CustomText>
        )}

        <TouchableOpacity
          onPress={handleEditBook}
          style={informationStyles.fetchButtonDetails}>
          <CustomText style={informationStyles.fetchButtonText}>
            Edit
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookDetailsComp;
