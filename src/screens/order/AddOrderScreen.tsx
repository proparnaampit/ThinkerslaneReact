import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import addOrderStyles from './addOrderStyles';
import commonstyles from '../../components/commonstyles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../components/CustomText';
import Book from '../../components/Book';
import {useFetchAllBooksQuery} from '../../services/bookService';

const AddOrderScreen = () => {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: booksData,
    isLoading: booksDataLoading,
    error: booksLoadingError,
  } = useFetchAllBooksQuery({});

  const filteredBooks = booksData?.data?.products?.filter((book: any) =>
    book.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <ScrollView style={addOrderStyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="keyboard-backspace"
          color={'black'}
          size={24}
          style={{marginBottom: 20}}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.searchInput}
        placeholder="Search books by name"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {booksDataLoading && <ActivityIndicator size="large" color="#0000ff" />}

      {booksLoadingError && (
        <CustomText
          text="Failed to load books."
          style={commonstyles.errorText}
        />
      )}

      {filteredBooks?.length > 0 &&
        filteredBooks.map((book: any) => {
          return <Book key={book.id} data={book} />;
        })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default AddOrderScreen;
