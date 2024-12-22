import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Animated,
  Switch,
} from 'react-native';
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
} from '../../services/bookService';

const AddOrderScreen = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState<any>(null);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [searching, setSearching] = useState(false);
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

  const {cart, addToCart, decreaseQuantity} = useCart();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const {
    data: apiBooks,
    isLoading: apiBooksLoading,
    error: apiBooksError,
    refetch,
  } = useFetchBooksQuery(
    {search: searchTerm, pid: selectedPublisher},
    {skip: !triggerSearch},
  );

  useEffect(() => {
    if (triggerSearch) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }
  }, [triggerSearch]);

  useEffect(() => {
    if (triggerSearch && !apiBooksLoading) {
      setSearching(false);
    }
  }, [apiBooksLoading, triggerSearch]);

  const handleSearchClicked = () => {
    setTriggerSearch(false);
    setSearching(true);
    setTimeout(() => {
      setTriggerSearch(true);
    }, 0);
  };

  const filteredBooks = useMemo(() => {
    if (searching) {
      return null;
    }

    return apiBooks?.filter((book: any) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [apiBooks, searchTerm]);

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
              style={[
                addOrderStyles.searchInput,
                {
                  backgroundColor: isSuprokashSelected ? '#e0e0e0' : '#fff',
                  opacity: isSuprokashSelected ? 0.6 : 1,
                },
              ]}
              placeholder="Start typing book name to search..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              editable={!isSuprokashSelected}
              placeholderTextColor={isSuprokashSelected ? '#aaa' : '#000'}
            />
          </View>
        </View>
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
          search={true}
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
            pointerEvents: isSuprokashSelected ? 'none' : 'auto',
          }}
          renderItem={item => (
            <View style={{padding: 10}}>
              <CustomText>{item.label}</CustomText>
            </View>
          )}
        />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Switch
            value={isSuprokashSelected}
            onValueChange={setIsSuprokashSelected}
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
            setSelectedPublisher(null);
            setIsSuprokashSelected(false);
          }}>
          <CustomText style={{color: 'white', textAlign: 'center'}}>
            Reset
          </CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: commonstyles.thinkerslane.color,
            marginVertical: 20,
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          }}
          onPress={handleSearchClicked}>
          <CustomText style={{color: 'white'}}>Search</CustomText>
        </TouchableOpacity>
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
