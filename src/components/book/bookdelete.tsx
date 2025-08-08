import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import CustomText from '../CustomText';
import singleBookStyles from './deleteBookStyle';
import informationStyles from '../../screens/product/css/information';
import {useDeleteBookMutation} from '../../services/bookService';
import Toast from 'react-native-toast-message';
import CheckBox from '@react-native-community/checkbox';

interface BookData {
  id?: string;
  name?: string;
  author?: string;
  publishers?: string;
  publisher_name?: string;
  publisher_details?: {name?: string};
  publisher_id: string;
  quantity?: string;
  price?: string;
  actual_price?: string;
  offered_price?: string;
  isbn_number?: string;
  binding?: string;
  width?: string;
  height?: string;
  length?: string;
  created_at?: string;
  updated_at?: string;
  publish_date?: string;
  edited_by?: string;
  category?: {name?: string};
  language?: string;
  description?: string;
  short_description?: string;
  affiliateLink?: string;
  affilatelink?: string;
  affiliate_link?: string;
  image?: string;
  images?: string[];
  selected?: boolean;
}

interface BookDetailsProps {
  data: BookData;
  onClose: () => void;
  onSelectChange: (selected: boolean) => void;
}

const BookDetailsDet = ({data, onClose, onSelectChange}: BookDetailsProps) => {
  if (!data) return null;
  const [deleteBook] = useDeleteBookMutation();
  const [isLoading, setIsLoading] = useState(false);

  const navigation: any = useNavigation();
  const description = data.description || '';
  const plainTextDescription = description
    .replace(/<[^>]*>/g, '')
    .replace(/\\r|\\n/g, ' ')
    .split(' ')
    .slice(0, 20)
    .join(' ');

  let firstImage = null;

  if (data?.image) {
    if (Array.isArray(data.image)) {
      firstImage = data.image[0];
    } else if (typeof data.image === 'string') {
      firstImage = data.image.split(',')[0].trim();
    }
  } else if (Array.isArray(data.images) && data.images[0]) {
    firstImage = data.images[0];
  }

  const imageUrl = firstImage
    ? `https://thinkerslane.com/public/uploads/admin/books/${firstImage}`
    : null;

  const publisher =
    data.publisher_name || data?.publisher_details?.name || 'Not Assigned';
  const isInStock = parseInt(data.quantity || '0') > 0;

  const handleDeleteBook = (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this book?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            setIsLoading(true);
            (async () => {
              try {
                const response = await deleteBook(id).unwrap();
                console.log('Book deleted:', response);
                onClose();
                Toast.show({
                  text1: 'Book deleted successfully!',
                });
                setIsLoading(false);
              } catch (error) {
                console.error('Delete failed:', error);
              }
            })();
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <>
      <View>
        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>

      <View style={singleBookStyles.container}>
        <View style={singleBookStyles.checkboxContainer}>
          <CheckBox
            value={data.selected || false}
            onValueChange={newValue => {
              onSelectChange(newValue);
            }}
            tintColors={{true: '#007AFF', false: '#aaa'}}
          />
        </View>
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

          {data.author && (
            <CustomText style={singleBookStyles.subtitle}>
              {data.author}
            </CustomText>
          )}

          {publisher && (
            <CustomText style={singleBookStyles.isbn}>
              Publisher: {publisher}
            </CustomText>
          )}

          <CustomText style={singleBookStyles.stock}>
            Available Quantity: {isInStock ? data.quantity : 'Out of Stock'}
          </CustomText>
        </View>
      </View>
    </>
  );
};

export default BookDetailsDet;
