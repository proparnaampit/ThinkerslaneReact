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
import singleBookStyles from './singleBookStyles';
import informationStyles from '../../screens/product/css/information';
import {useDeleteBookMutation} from '../../services/bookService';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../../screens/context/FormContextType';

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
}

interface BookDetailsProps {
  data: BookData;
  onClose: () => void;
}

const BookDetailsComp = ({data, onClose}: BookDetailsProps) => {
  if (!data) return null;
  const [deleteBook] = useDeleteBookMutation();
  const [isLoading, setIsLoading] = useState(false);

  const {resetFormData} = useFormContext();

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

  const handleEditBook = () => {
    Alert.alert(
      'Confirm Edit',
      'Are you sure you want to edit this book?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            resetFormData();
            navigation.navigate('Update', {bookData: data});
            onClose();
          },
        },
      ],
      {cancelable: true},
    );
  };

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

          {isInStock && data.price && (
            <View style={singleBookStyles.price}>
              <CustomText style={singleBookStyles.priceText}>
                Rs.{data.price}
              </CustomText>
            </View>
          )}

          {(data.offered_price || data.actual_price) && (
            <CustomText style={singleBookStyles.isbn}>
              <CustomText style={singleBookStyles.isbnBold}>
                Offered Price:
              </CustomText>{' '}
              {data.offered_price || data.actual_price}
            </CustomText>
          )}

          {data.isbn_number && data.isbn_number !== '0' && (
            <CustomText style={singleBookStyles.isbn}>
              <CustomText style={singleBookStyles.isbnBold}>ISBN:</CustomText>{' '}
              {data.isbn_number}
            </CustomText>
          )}

          {data.id && (
            <CustomText style={singleBookStyles.isbn}>
              <CustomText style={singleBookStyles.isbnBold}>
                Product ID:
              </CustomText>{' '}
              {data.id}
            </CustomText>
          )}

          {/* {data.binding && (
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
        )} */}

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

          {data.publish_date && data.publish_date !== '0000-00-00 00:00:00' && (
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
                Edited by:
              </CustomText>{' '}
              {data.edited_by}
            </CustomText>
          )}

          {data.category?.name && (
            <CustomText style={singleBookStyles.isbn}>
              <CustomText style={singleBookStyles.isbnBold}>
                Category name:
              </CustomText>{' '}
              {data.category.name}
            </CustomText>
          )}

          {/* {data.language && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>Language:</CustomText>{' '}
            {data.language}
          </CustomText>
        )} */}

          {/* {plainTextDescription && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Description:
            </CustomText>{' '}
            {plainTextDescription}
          </CustomText>
        )} */}

          {/* {data.short_description && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Short description:
            </CustomText>{' '}
            {data.short_description.replace(/<[^>]*>/g, '')}
          </CustomText>
        )} */}

          {/* {(data.affiliateLink || data.affilatelink || data.affiliate_link) && (
          <CustomText style={singleBookStyles.isbn}>
            <CustomText style={singleBookStyles.isbnBold}>
              Affiliate Link:
            </CustomText>{' '}
            {data.affiliateLink || data.affilatelink || data.affiliate_link}
          </CustomText>
        )} */}

          <TouchableOpacity
            onPress={handleEditBook}
            style={informationStyles.fetchButtonDetails}>
            <CustomText style={informationStyles.fetchButtonText}>
              Edit
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

// Parent component to render multiple books
interface ParentProps {
  mainData: {
    data?: BookData[];
  };
  onClose: () => void;
}

const ParentComponent = ({mainData, onClose}: ParentProps) => {
  return (
    <View>
      {mainData?.data?.length > 0 ? (
        mainData.data.map(book => (
          <BookDetailsComp key={book.id} data={book} onClose={onClose} />
        ))
      ) : (
        <Text>Loading or no book found</Text>
      )}
    </View>
  );
};

export default BookDetailsComp;
