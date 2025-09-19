import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
  Animated,
  Switch,
  Alert,
} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {useNavigation} from '@react-navigation/native';
import addOrderStyles from './addOrderStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomText from '../../components/CustomText';
import Book from '../../components/book/Book';
import {useCart} from '../../context/CartContext';
import {Dropdown} from 'react-native-element-dropdown';
import {Camera} from 'react-native-vision-camera';
import BarcodeScanner from '../../components/common/CameraScanner';
import {skipToken} from '@reduxjs/toolkit/query';
import {
  useGetBookDataByCodeFromServerQuery,
  useFetchBooksQuery,
  useGetAllPublishersQuery,
} from '../../services/bookService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AddOrderScreen = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isbnNumber, setIsbnNumber] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null,
  );
  const [isSuprokashSelected, setIsSuprokashSelected] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [searchType, setSearchType] = useState<'name' | 'isbn' | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const {cart, addToCart, decreaseQuantity} = useCart();

  // ISBN-based API call
  const {
    data: isbnBookData,
    isLoading: isbnBookLoading,
    error: isbnBookError,
    refetch: refetchIsbnBook,
  } = useGetBookDataByCodeFromServerQuery(isbnNumber ? isbnNumber : skipToken);

  // Book name and publisher-based API call
  const {
    data: apiBooks,
    isLoading: apiBooksLoading,
    error: apiBooksError,
    refetch: refetchBooks,
  } = useFetchBooksQuery(
    searchTerm || selectedPublisher
      ? {search: searchTerm, pid: selectedPublisher}
      : skipToken,
  );

  // Publishers API call
  const {data: publishersData, error: publishersError} =
    useGetAllPublishersQuery({});

  // Memoized publishers for dropdown
  const publishers = useMemo(() => {
    if (publishersData?.data) {
      return publishersData.data.map(
        (publisher: {id: string; name: string}) => ({
          label: publisher.name.trim(),
          value: publisher.id,
        }),
      );
    }
    return [];
  }, [publishersData]);

  // Consolidated loading state
  const isLoading = isbnBookLoading || apiBooksLoading;

  // Memoized book data based on search type
  const displayedBooks = useMemo(() => {
    if (isLoading) return [];

    if (searchType === 'isbn' && isbnBookData) {
      return Array.isArray(isbnBookData) ? isbnBookData : [isbnBookData];
    }

    if (searchType === 'name' && apiBooks) {
      return apiBooks;
    }

    return [];
  }, [searchType, isbnBookData, apiBooks, isLoading]);
  console.log(JSON.stringify(isbnBookData));

  // Fade animation effect
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [displayedBooks]);

  // Error handling
  useEffect(() => {
    if (isbnBookError || apiBooksError || publishersError) {
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    }
  }, [isbnBookError, apiBooksError, publishersError]);

  // Handle ISBN search
  const handleIsbnSearch = () => {
    if (!isbnNumber) {
      Alert.alert('Error', 'Please enter an ISBN number.');
      return;
    }
    setSearchType('isbn');
    refetchIsbnBook();
  };

  // Handle book name/publisher search
  const handleBookSearch = () => {
    if (!searchTerm && !selectedPublisher) {
      Alert.alert('Error', 'Please enter a search term or select a publisher.');
      return;
    }
    setSearchType('name');
    refetchBooks();
  };

  // Handle add to cart
  const handleAddToCart = (book: any) => {
    const {
      id,
      name,
      image,
      price,
      offered_price,
      actual_price,
      app_discounted_offer,
      app_discounted_price,
      app_product_price,
    } = book;
    addToCart({
      id,
      name,
      image,
      price,
      offered_price,
      actual_price,
      quantity: 1,
      app_discounted_offer,
      app_discounted_price,
      app_product_price,
    });
  };

  // Handle decrease quantity
  const handleDecreaseQuantity = (bookId: string) => {
    decreaseQuantity(bookId);
  };

  // Handle camera open
  const openCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      Alert.alert(
        'Camera Permission Denied',
        'Please enable camera access in settings to scan barcodes.',
      );
      return;
    }
    setShowCamera(true);
  };

  // Handle barcode scan
  // const handleCodeScanned = (code: string) => {
  //   if (code) {
  //     setIsbnNumber(code);
  //     setShowCamera(false);
  //     setSearchType('isbn');
  //     refetchIsbnBook();
  //   }
  // };
  const handleCodeScanned = (code: string) => {
    setIsbnNumber(code);
    Alert.alert('Barcode Scanned', `Found code: ${code}`);

    if (code) {
      setSearchType('isbn');
    }

    setShowCamera(false);
  };

  // Reset all search fields
  const handleReset = () => {
    setSearchTerm('');
    setIsbnNumber('');
    setSelectedPublisher(null);
    setIsSuprokashSelected(false);
    setSearchType(null);
  };

  // Calculate total cart count
  const totalCartCount = Object.values(cart).reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  // Render skeleton placeholder for loading
  const renderSkeleton = () => (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item
        flexDirection="row"
        padding={10}
        alignItems="center"
        marginBottom={10}>
        <SkeletonPlaceholder.Item width={80} height={120} borderRadius={10} />
        <SkeletonPlaceholder.Item marginLeft={10} flex={1}>
          <SkeletonPlaceholder.Item width="80%" height={20} borderRadius={4} />
          <SkeletonPlaceholder.Item
            width="60%"
            height={20}
            borderRadius={4}
            marginTop={6}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );

  return (
    <Animated.View style={{flex: 1, padding: 10, opacity: fadeAnim}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome6
            name="arrow-left-long"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}
          onPress={() => navigation.navigate('Cart')}>
          <FontAwesome6
            name="cart-shopping"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
          <CustomText style={addOrderStyles.totalCart}>
            {totalCartCount}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={addOrderStyles.header}>
        <CustomText style={{marginBottom: 5}}>Search by book name:</CustomText>
        <View style={addOrderStyles.searchBar}>
          <TextInput
            style={[
              addOrderStyles.searchInput,
              {
                backgroundColor: isSuprokashSelected ? '#e0e0e0' : '#fff',
                opacity: isSuprokashSelected ? 0.6 : 1,
              },
            ]}
            placeholder="Enter book name..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            editable={!isSuprokashSelected}
            placeholderTextColor={isSuprokashSelected ? '#aaa' : '#000'}
          />
        </View>

        <CustomText style={{marginBottom: 5, marginTop: 10}}>
          Search by ISBN:
        </CustomText>
        <View style={addOrderStyles.searchBar}>
          <TextInput
            style={addOrderStyles.searchInput}
            placeholder="Enter ISBN number..."
            value={isbnNumber}
            onChangeText={text => {
              const numericText = text.replace(/[^0-9]/g, '');
              setIsbnNumber(numericText);
            }}
            keyboardType="numeric"
            placeholderTextColor="#000"
          />
          <TouchableOpacity
            style={[addOrderStyles.cameraButton, {marginLeft: 5}]}
            onPress={openCamera}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={32}
              color={showCamera ? 'red' : '#223d79'}
            />
          </TouchableOpacity>
        </View>

        <BarcodeScanner
          isVisible={showCamera}
          onCodeScanned={handleCodeScanned}
          onClose={() => setShowCamera(false)}
        />

        <CustomText style={{marginBottom: 5, marginTop: 10}}>
          Search by Publisher:
        </CustomText>
        <Dropdown
          data={publishers}
          labelField="label"
          valueField="value"
          placeholder="Select a Publisher"
          value={selectedPublisher}
          onChange={item => setSelectedPublisher(item.value)}
          search
          searchPlaceholder="Search Publisher..."
          disable={isSuprokashSelected}
          style={{
            marginBottom: 10,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 8,
            padding: 8,
            backgroundColor: isSuprokashSelected ? '#e0e0e0' : '#fff',
            opacity: isSuprokashSelected ? 0.6 : 1,
          }}
          renderItem={item => (
            <View style={{padding: 10}}>
              <CustomText>{item.label}</CustomText>
            </View>
          )}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <Switch
            value={isSuprokashSelected}
            onValueChange={value => {
              setIsSuprokashSelected(value);
              setSelectedPublisher(value ? '794' : null);
            }}
          />
          <CustomText>Search only Suprokash Publisher</CustomText>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              padding: 10,
              borderRadius: 8,
              flex: 1,
              marginRight: 5,
            }}
            onPress={handleReset}>
            <CustomText style={{color: 'white', textAlign: 'center'}}>
              Reset
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: commonstyles.thinkerslane.color,
              padding: 10,
              borderRadius: 8,
              flex: 1,
            }}
            onPress={isbnNumber ? handleIsbnSearch : handleBookSearch}>
            <CustomText style={{color: 'white', textAlign: 'center'}}>
              Search
            </CustomText>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading && <View style={{marginTop: 20}}>{renderSkeleton()}</View>}

      <FlatList
        data={displayedBooks}
        initialNumToRender={10}
        renderItem={({item: book}) => {
          const cartItem = cart[book.id];
          const quantity = cartItem ? cartItem.quantity : 0;
          return (
            <TouchableOpacity
              key={book.id}
              style={addOrderStyles.bookContainer}
              onPress={() => handleAddToCart(book)}
              activeOpacity={0.8}>
              <Book data={book} />
              {quantity > 0 && (
                <TouchableOpacity
                  style={addOrderStyles.quantityBadgeContainer}
                  onPress={e => {
                    e.stopPropagation();
                    handleDecreaseQuantity(book.id);
                  }}>
                  <FontAwesome name="minus" size={16} color="red" />
                  <CustomText style={addOrderStyles.quantityText}>
                    {quantity}
                  </CustomText>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          !isLoading && searchType ? (
            <CustomText style={commonstyles.errorText}>
              {searchType === 'isbn'
                ? 'No books found for this ISBN.'
                : 'No books found for this search.'}
            </CustomText>
          ) : null
        }
        ListFooterComponent={<View style={{marginBottom: 500}} />}
      />
    </Animated.View>
  );
};

export default AddOrderScreen;
