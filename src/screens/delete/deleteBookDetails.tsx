import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import {skipToken} from '@reduxjs/toolkit/query';
import informationStyles from '../product/css/deleteDetailsStyle';
import {Camera} from 'react-native-vision-camera';
import BarcodeScanner from '../../components/common/CameraScanner';
import {
  useLazyGetBookDataByCodeFromServerQuery,
  useLazyGetproductNameDataByCodeFromServerQuery,
} from '../../services/bookService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BookDetailsDet from '../../components/book/bookdelete';
import CustomPicker from '../../components/common/CustomPicker';
import {
  useGetAllPublishersQuery,
  useDeleteBookMutation,
} from '../../services/bookService';
import Toast from 'react-native-toast-message';

const BookDetailsdel = () => {
  const [isbnNumber, setIsbnNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [mainData, setMainData]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const {data: publishersData} = useGetAllPublishersQuery({});
  const [publishers, setPublishers] = useState<any[]>([]);
  const [deleteBook] = useDeleteBookMutation();

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      return;
    }
    setIsbnNumber('');
    setShowCamera(prev => !prev);
  };

  const handleCodeScanned = (code: string) => {
    if (code) {
      setIsbnNumber(code);
      setShowCamera(false);
    }
  };

  const onClose = () => {
    setMainData(null);
    setIsbnNumber('');
    setProductName('');
    setPublisherId('');
    setAllSelected(false);
  };

  const fetchBookData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();

      if (isbnNumber.trim()) {
        params.append('isbn_number', isbnNumber.trim());
      }

      if (productName.trim()) {
        params.append('product_name', productName.trim());
      }

      if (publisherId.trim()) {
        params.append('publisher_id', publisherId.trim());
      }

      const url = `https://thinkerslane.com/thAdmin/getBookByIsbn?${params.toString()}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result?.books && result.books.length > 0) {
        const booksWithSelection = result.books.map(book => ({
          ...book,
          selected: false,
        }));
        setMainData(booksWithSelection);
      } else {
        setMainData(null);
        Toast.show({
          text1: 'No book found',
        });
      }
    } catch (error) {
      setMainData(null);
      Toast.show({
        text1: 'Error fetching data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    const newSelectedState = !allSelected;
    setAllSelected(newSelectedState);
    setMainData(
      mainData.map(book => ({
        ...book,
        selected: newSelectedState,
      })),
    );
  };

  const handleDeleteSelected = () => {
    const selectedBooks = mainData.filter(book => book.selected);
    if (selectedBooks.length === 0) return;

    const payload = {
      params: {
        product_ids: selectedBooks.map(book => book.id),
      },
    };

    console.log('Payload sent to API:', payload);

    Alert.alert(
      'Confirm Delete',
      `Are you sure you want to delete ${selectedBooks.length} selected book(s)?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await deleteBook(payload).unwrap();
              console.log('Delete API response:', response);

              Toast.show({
                text1: 'Selected books deleted successfully!',
              });

              setMainData(mainData.filter(book => !book.selected));
              setAllSelected(false);
            } catch (error) {
              console.error('Delete failed:', error);
              Toast.show({
                text1: 'Error deleting books',
              });
            } finally {
              setIsLoading(false);
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  useEffect(() => {
    if (publishersData?.data?.length > 0) {
      setPublishers(publishersData.data);
    }
  }, [publishersData]);

  // Check if any books are selected
  const hasSelectedBooks =
    Array.isArray(mainData) && mainData.some(book => book.selected);

  return (
    <View style={informationStyles.container}>
      <ScrollView style={informationStyles.containerForBookDetails}>
        <Text style={informationStyles.header}>Book Details</Text>

        {isLoading && <ActivityIndicator size="large" color="#0000ff" />}

        <Text style={informationStyles.label}>Search by ISBN Number:</Text>
        <View style={informationStyles.inputContainer}>
          <TextInput
            style={[informationStyles.ISBNinput, {flex: 1}]}
            placeholder="Enter ISBN NUMBER"
            value={isbnNumber}
            keyboardType="numeric"
            onChangeText={text => {
              const numericText = text.replace(/[^0-9]/g, '');
              setIsbnNumber(numericText);
            }}
          />

          <TouchableOpacity
            style={[informationStyles.cameraButton, {marginLeft: 5}]}
            onPress={openCamera}>
            <MaterialCommunityIcons
              name="barcode-scan"
              size={32}
              color={showCamera ? 'red' : '#223d79'}
              style={{marginLeft: 5}}
            />
          </TouchableOpacity>
        </View>
        <Text style={informationStyles.label}>Product Name:</Text>
        <TextInput
          style={informationStyles.input}
          placeholder="Enter Product Name"
          value={productName}
          onChangeText={setProductName}
        />
        <Text style={informationStyles.label}>Publisher:</Text>

        <CustomPicker
          selectedValue={publisherId}
          onValueChange={setPublisherId}
          data={publishers}
          labelKey="name"
          placeholder="Select Publisher"
        />

        <Modal visible={showCamera} animationType="slide">
          <BarcodeScanner
            isVisible={showCamera}
            onCodeScanned={handleCodeScanned}
            onClose={() => setShowCamera(false)}
          />
        </Modal>

        <TouchableOpacity
          style={informationStyles.fetchButton}
          onPress={fetchBookData}
          disabled={isLoading}>
          <Text style={informationStyles.fetchButtonText}>Search</Text>
        </TouchableOpacity>

        {/* Select All Button */}
        {Array.isArray(mainData) && mainData.length > 0 && (
          <TouchableOpacity
            style={informationStyles.fetchButtonSelect}
            onPress={handleSelectAll}>
            <Text style={informationStyles.fetchButtonText}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Text>
          </TouchableOpacity>
        )}
        {/* Delete Selected Button */}

        <View>
          {Array.isArray(mainData) && mainData.length > 0 ? (
            mainData.map(book => (
              <BookDetailsDet
                key={book.id}
                data={book}
                onClose={onClose}
                onSelectChange={(selected: boolean) => {
                  setMainData(
                    mainData.map(b =>
                      b.id === book.id ? {...b, selected} : b,
                    ),
                  );
                  setAllSelected(mainData.every(b => b.selected));
                }}
              />
            ))
          ) : (
            <BookDetailsDet
              data={mainData}
              onClose={onClose}
              onSelectChange={() => {}}
            />
          )}
        </View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          zIndex: 999,
          bottom: 20,
          right: 20,
          flex: 1,
        }}>
        {hasSelectedBooks && (
          <TouchableOpacity
            style={[
              informationStyles.fetchButtonDelete,
              {backgroundColor: '#ff0000'},
            ]}
            onPress={handleDeleteSelected}>
            <Text style={informationStyles.fetchButtonText}>
              Delete Selected
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default BookDetailsdel;
