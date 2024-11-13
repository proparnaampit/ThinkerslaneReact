import React, {useState, useMemo, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Animated,
  FlatList,
} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import bookStyles from './bookStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomText from '../../components/CustomText';
import Book from '../../components/book/Book';
import {useFetchAllBooksQuery} from '../../services/bookService';
import addOrderStyles from '../order/addOrderStyles';

const BookListScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [booksToDisplay, setBooksToDisplay] = useState<any[]>([]);
  const {
    data: booksData,
    isLoading: booksDataLoading,
    error: booksLoadingError,
  } = useFetchAllBooksQuery({});

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadMoreBooks = () => {
    if (booksData) {
      const startIndex = page * 10;
      const nextBooks = booksData?.data?.slice(startIndex, startIndex + 10);
      setBooksToDisplay(prevBooks => [...prevBooks, ...nextBooks]);
      setPage(prevPage => prevPage + 1);
    }
  };

  const filteredBooks = useMemo(() => {
    return booksToDisplay.filter((book: any) =>
      book.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [booksToDisplay, searchTerm]);

  const handleSearchClicked = () => {
    setSearchQuery(searchTerm);
    setPage(1);
    setBooksToDisplay([]);
    loadMoreBooks();
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

    loadMoreBooks();
  }, []);

  const handleBookDetails = (book: any) => {};

  const handleEndReached = () => {
    loadMoreBooks();
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

      <FlatList
        data={filteredBooks}
        renderItem={({item}) => (
          <TouchableOpacity
            style={addOrderStyles.bookContainer}
            onPress={() => handleBookDetails(item)}
            activeOpacity={0.8}>
            <View style={{flex: 1}}>
              <Book data={item} />
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
        ListFooterComponent={
          booksDataLoading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />

      <Animated.View style={{opacity: fadeAnim}}>
        <CustomText style={commonstyles.errorText}>{message}</CustomText>
      </Animated.View>
    </View>
  );
};

export default BookListScreen;
