import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
} from 'react-native';
import {skipToken} from '@reduxjs/toolkit/query';
import informationStyles from '../product/css/information';
import {Camera} from 'react-native-vision-camera';
import BarcodeScanner from '../../components/common/CameraScanner';
import {
  useLazyGetBookDataByCodeFromServerQuery,
  useLazyGetproductNameDataByCodeFromServerQuery,
} from '../../services/bookService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BookDetailsComp from '../../components/book/BookDetails';
import CustomPicker from '../../components/common/CustomPicker';
import {useGetAllPublishersQuery} from '../../services/bookService';
import Toast from 'react-native-toast-message';

const BookDetails = () => {
  const [isbnNumber, setIsbnNumber] = useState('');
  const [productName, setProductName] = useState('');
  const [publisherId, setPublisherId] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [mainData, setMainData]: any = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {data: publishersData} = useGetAllPublishersQuery({});
  const [publishers, setPublishers] = useState<any[]>([]);

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
        setMainData(result.books);
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
  console.log('maindata', mainData);

  useEffect(() => {
    if (publishersData?.data?.length > 0) {
      setPublishers(publishersData.data);
    }
  }, [publishersData]);
  console.log(mainData);

  return (
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

      <View>
        {Array.isArray(mainData) && mainData.length > 0 ? (
          mainData.map(book => (
            <BookDetailsComp key={book.id} data={book} onClose={onClose} />
          ))
        ) : (
          <BookDetailsComp data={mainData} onClose={onClose} />
        )}
      </View>
    </ScrollView>
  );
};

export default BookDetails;
