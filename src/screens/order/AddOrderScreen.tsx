import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  FlatList,
  TextInput,
  Animated,
  Switch,
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
import {
  useFetchBooksQuery,
  useGetAllPublishersQuery,
  useFetchAllBooksQuery,
} from '../../services/bookService';
import {debounce} from 'lodash';

const AddOrderScreen = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);
  const [isSuprokashSelected, setIsSuprokashSelected] = useState(false);

  const {data: publishersData, isLoading, error} = useGetAllPublishersQuery({});

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

  const handleSearchTermChange = debounce(term => {
    setDebouncedSearchTerm(term);
  }, 300);

  // Monitor search input changes
  const onSearchChange = (text: any) => {
    setSearchTerm(text);
    handleSearchTermChange(text); // Update debounced term
  };

  const {cart, addToCart, decreaseQuantity} = useCart();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    data: apiBooks,
    isLoading: apiBooksLoading,
    error: booksLoadingError,
  } = useFetchAllBooksQuery({});

  const filteredBooks = useMemo(() => {
    if (apiBooks?.data) {
      let books = apiBooks.data;

      if (debouncedSearchTerm) {
        const normalizedSearchTerm = debouncedSearchTerm
          .normalize('NFC')
          .toLocaleLowerCase('bn');

        books = books.filter((book: {name: string}) =>
          book.name
            .normalize('NFC')
            .toLocaleLowerCase('bn')
            .includes(normalizedSearchTerm),
        );
      }

      if (selectedPublisher) {
        books = books.filter(
          (book: {publisher_id: any}) =>
            book.publisher_id === selectedPublisher,
        );
      }

      return books;
    }
    return [];
  }, [
    apiBooks,
    debouncedSearchTerm,
    selectedPublisher,
    isSuprokashSelected,
    searchTerm,
  ]);

  const handleAddToCart = (book: any) => {
    const {id, name, image, price, offered_price, actual_price} = book;
    addToCart({
      id,
      name,
      image,
      price,
      offered_price,
      actual_price,
      quantity: 1,
    });
  };

  const handleDecreaseQuantity = (bookId: any) => {
    decreaseQuantity(bookId);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const totalCartCount = Object.values(cart).reduce(
    (acc: any, item: any) => acc + item.quantity,
    0,
  );

  const handleCartAction = () => {
    navigation.navigate('Cart');
  };

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
    <View style={{flex: 1, padding: 10}}>
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
          onPress={handleCartAction}>
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
        <View style={addOrderStyles.headers}>
          <View style={addOrderStyles.searchBar}>
            <TextInput
              style={addOrderStyles.searchInput}
              placeholder="Start typing book name to search..."
              value={searchTerm}
              onChangeText={onSearchChange}
              placeholderTextColor="#000"
            />
          </View>
        </View>
        <CustomText style={{marginBottom: 5, marginTop: 10}}>
          Search by Publisher:
        </CustomText>
        <View style={addOrderStyles.headers}>
          <View style={addOrderStyles.searchBar}>
            <Dropdown
              data={publishers}
              labelField="label"
              valueField="value"
              placeholder="Select a Publisher"
              value={selectedPublisher}
              onChange={item => setSelectedPublisher(item.value)}
              search={true}
              searchPlaceholder="Search Publisher..."
              disable={isSuprokashSelected}
              style={addOrderStyles.searchInput}
              renderItem={item => (
                <View style={{padding: 10}}>
                  <CustomText>{item.label}</CustomText>
                </View>
              )}
            />
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Switch
            value={isSuprokashSelected}
            onValueChange={value => {
              setIsSuprokashSelected(value);
              if (value) {
                setSelectedPublisher('794');
              } else {
                setSelectedPublisher(null);
              }
            }}
          />
          <CustomText>Search only Suprokash Publisher</CustomText>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 8,
            marginTop: 15,
          }}
          onPress={() => {
            setSearchTerm('');
            setDebouncedSearchTerm('');
            setSelectedPublisher(null);
            setIsSuprokashSelected(false);
          }}>
          <CustomText style={{color: 'white', textAlign: 'center'}}>
            Reset
          </CustomText>
        </TouchableOpacity>
      </View>

      <View>
        <FlatList
          data={filteredBooks}
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
                <View style={{flex: 1}}>
                  <Book data={book} />
                </View>

                {quantity > 0 && (
                  <TouchableOpacity
                    style={addOrderStyles.quantityBadgeContainer}
                    onPress={e => {
                      e.stopPropagation();
                      handleDecreaseQuantity(book.id);
                    }}>
                    <View>
                      <FontAwesome name="minus" size={16} color="red" />
                    </View>
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
            apiBooksLoading ? (
              <View>{renderSkeleton()}</View>
            ) : (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 20,
                }}>
                <CustomText style={commonstyles.errorText}>
                  {debouncedSearchTerm || selectedPublisher
                    ? 'No books found for the search criteria.'
                    : 'Start searching for books by typing in the search bar or selecting a publisher.'}
                </CustomText>
              </View>
            )
          }
          windowSize={21}
          maxToRenderPerBatch={15}
          extraData={filteredBooks}
        />
      </View>
    </View>
  );
};

export default AddOrderScreen;
