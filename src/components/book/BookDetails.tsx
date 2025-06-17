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
  const description = data.description || '';

  const plainTextDescription = description
    .replace(/<[^>]*>/g, '')
    .replace(/\\r|\\n/g, ' ')
    .split(' ')
    .slice(0, 20)
    .join(' ');
  const imageUrl = data.images?.[0]
    ? `https://thinkerslane.com/public/uploads/admin/books/${data.image}`
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
            navigation.navigate('Update', {bookData: data});
            onClose();
          },
        },
      ],
      {cancelable: true},
    );
  };
  console.log('data', data);

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
            <CustomText style={singleBookStyles.isbnBold}>
              offeredPrice:
            </CustomText>{' '}
            {data.offered_price}
          </CustomText>
        )}

        <CustomText style={singleBookStyles.isbn}>
          <CustomText style={singleBookStyles.isbnBold}>ISBN:</CustomText>{' '}
          {data?.isbn_number ? data?.isbn_number : null}
        </CustomText>
        <CustomText style={singleBookStyles.isbn}>
          <CustomText style={singleBookStyles.isbnBold}>Product id:</CustomText>{' '}
          {data?.id ? data?.id : null}
        </CustomText>

        {data.binding && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Binding:</CustomText>{' '}
            {data.binding}
          </CustomText>
        )}

        {data.width && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Width:</CustomText>{' '}
            {data.width}
          </CustomText>
        )}

        {data.height && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Height:</CustomText>{' '}
            {data.height}
          </CustomText>
        )}

        {data.length && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Length:</CustomText>{' '}
            {data.length}
          </CustomText>
        )}
        {data.created_at && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Created at:
            </CustomText>{' '}
            {data.created_at}
          </CustomText>
        )}

        {data.updated_at && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Updated at:
            </CustomText>{' '}
            {data.updated_at}
          </CustomText>
        )}

        {data.publish_date && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Publish date:
            </CustomText>{' '}
            {data.publish_date}
          </CustomText>
        )}

        {data.edited_by && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Edited by :
            </CustomText>{' '}
            {data.edited_by}
          </CustomText>
        )}

        {data.category.name && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Category name:
            </CustomText>{' '}
            {data.category.name}
          </CustomText>
        )}

        {data.langauge && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Langauge:</CustomText>{' '}
            {data.langauge}
          </CustomText>
        )}

        {data.description && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Description:
            </CustomText>{' '}
            {plainTextDescription}
          </CustomText>
        )}

        {data.short_description && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Short description:
            </CustomText>{' '}
            {data.short_description}
          </CustomText>
        )}

        {data.affiliateLink && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              AffiliateLink:
            </CustomText>{' '}
            {data.affiliateLink}
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
