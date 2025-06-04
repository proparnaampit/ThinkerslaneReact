import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {skipToken} from '@reduxjs/toolkit/query';
import informationStyles from '../product/css/information';
import {Camera} from 'react-native-vision-camera';
import BarcodeScanner from '../../components/common/CameraScanner';
import {useGetBookDataByCodeFromServerQuery} from '../../services/bookService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BookDetailsComp from '../../components/book/BookDetails';

const BookDetails = () => {
  const [isbnNumber, setIsbnNumber]: any = useState();
  const [isMainISBNset, setIsMainISbnSet] = useState();
  const [showCamera, setShowCamera] = useState(false);
  const [mainData, setMainData]: any = useState(null);
  const {data, isLoading} = useGetBookDataByCodeFromServerQuery(
    isMainISBNset ? isMainISBNset : skipToken,
  );

  const onClose = () => {
    setMainData(null);
    setIsbnNumber(null);
  };

  const openCamera = async (prev: any) => {
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

  const fetchBookData = () => {
    setIsbnNumber(isbnNumber);
    setIsMainISbnSet(isbnNumber);
  };

  useEffect(() => {
    if (data) {
      setMainData(data);
    }
  }, [data]);

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

        <TouchableOpacity
          style={informationStyles.fetchButton}
          onPress={fetchBookData}
          disabled={isLoading}>
          <Text style={informationStyles.fetchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={{flex: 1}}>
        <BarcodeScanner
          isVisible={showCamera}
          onCodeScanned={handleCodeScanned}
          onClose={() => setShowCamera(false)}
        />
      </View>

      <View>
        {mainData && mainData?.book?.id && (
          <BookDetailsComp data={mainData?.book} onClose={onClose} />
        )}
      </View>
    </ScrollView>
  );
};

export default BookDetails;
