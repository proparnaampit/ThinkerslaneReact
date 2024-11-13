import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import addOrderStyles from './addOrderStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomText from '../../components/CustomText';
import Book from '../../components/book/Book';
import {
  useFetchAllBooksQuery,
  useFetchBooksQuery,
} from '../../services/bookService';
import {useCart} from '../../context/CartContext';

const AddOrderScreen = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const {cart, addToCart, decreaseQuantity, increaseQuantity, removeFromCart} =
    useCart();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    data: booksData,
    isLoading: booksDataLoading,
    error: booksLoadingError,
  } = useFetchAllBooksQuery({});

  const {
    data: apiBooks,
    isLoading: apiBooksLoading,
    error: apiBooksError,
  } = useFetchBooksQuery(searchQuery, {
    skip: searchQuery.length === 0,
  });

  const filteredBooks = useMemo(() => {
    return apiBooks?.filter((book: any) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [apiBooks, searchTerm]);

  const handleSearchClicked = () => {
    setSearchQuery(searchTerm);
  };

  const handleAddToCart = (book: any) => {
    const {id, name, image, price, offered_price, short_description} = book;
    addToCart({
      id,
      name,
      image,
      price,
      offered_price,
      short_description,
      quantity: 1,
    });
  };

  const handleDecreaseQuantity = (bookId: any) => {
    decreaseQuantity(bookId);
  };

  const message =
    filteredBooks?.length === 0
      ? 'No Books Found..'
      : filteredBooks === undefined
      ? 'Type the name of the book in the search bar...'
      : null;

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

  return (
    <View style={{flex: 1}}>
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
        <View style={addOrderStyles.searchBar}>
          <TextInput
            style={addOrderStyles.searchInput}
            placeholder="Type book name and hit search button .."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FontAwesome
            name="search"
            size={16}
            style={{
              color: commonstyles.thinkerslane.color,
              marginRight: 7,
              padding: 8,
              borderRadius: 10,
            }}
            onPress={handleSearchClicked}
          />
        </View>
      </View>

      <ScrollView
        style={addOrderStyles.booksContainer}
        showsVerticalScrollIndicator={false}>
        {apiBooksLoading && <ActivityIndicator size="large" color="#0000ff" />}
        {filteredBooks?.length > 0 &&
          filteredBooks.map((book: any) => {
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
          })}

        <Animated.View style={{opacity: fadeAnim}}>
          <CustomText style={commonstyles.errorText}>{message}</CustomText>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default AddOrderScreen;
