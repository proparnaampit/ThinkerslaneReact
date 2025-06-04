import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useGetAllPublishersQuery,
  useGetAllCategoryQuery,
} from '../../services/bookService';
import informationStyles from '../product/css/information';
import {useFormContext} from '../../context/updateContext';
import CustomPicker from '../../components/common/CustomPicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Camera} from 'react-native-vision-camera';
import BarcodeScanner from '../../components/common/CameraScanner';

const CategoryForm: React.FC = () => {
  const {formData, updateFormData} = useFormContext();
  const {data: publishersData} = useGetAllPublishersQuery({});
  const {data: categoriesData} = useGetAllCategoryQuery({});

  const [isbnNumber, setIsbnNumber] = useState(
    formData.information?.isbnNumber || '',
  );
  const [productName, setProductName] = useState(
    formData.information?.productName || '',
  );
  const [shortDescription, setShortDescription] = useState(
    formData.information?.shortDescription || '',
  );
  const [longDescription, setLongDescription] = useState(
    formData.information?.longDescription || '',
  );
  const [resourceType, setResourceType] = useState(
    formData.information?.resourceType || '',
  );
  const [language, setLanguage] = useState(
    formData.information?.language || '',
  );
  const [publisher, setPublisher] = useState(
    formData.information?.publisher || '',
  );
  const [status, setStatus] = useState(
    formData.information?.status || 'active',
  );
  const [subCategory, setSubCategory] = useState(
    formData.information?.subCategory || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    formData.information?.category || '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const normalize = (str: any) =>
    str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const fetchBookDataByIsbn = async (isbn: string) => {
    if (!isbn) {
      setError('Please enter an ISBN number');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const thinkersLaneResponse = await fetch(
        `https://staging.thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const thinkersLaneData = await thinkersLaneResponse.json();

      // Check if ThinkersLane API returns valid data
      if (thinkersLaneData?.status === 200 && thinkersLaneData?.book) {
        const book = thinkersLaneData.book;

        // Map publisher_id directly since the API provides it
        const publisherId = book.publisher_id || '';

        const newInfo = {
          productName: book.name || '',
          publisher: publisherId,
          language: book.language || '',
          shortDescription: book.short_description || '',
          longDescription: book.description || '',
          authorName: book.author || '',
        };

        // Update state to populate form inputs
        setProductName(newInfo.productName);
        setPublisher(newInfo.publisher);
        setLanguage(newInfo.language);
        setShortDescription(newInfo.shortDescription);
        setLongDescription(newInfo.longDescription);

        // Update form context
        updateFormData('information', {
          ...formData.information,
          isbnNumber: isbn,
          ...newInfo,
        });
        return; // Exit if ThinkersLane API returns valid data
      }

      // Fallback to Google Books API if ThinkersLane API returns no data
      const googleResponse = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`,
      );
      const googleData = await googleResponse.json();

      if (googleData.items && googleData.items.length > 0) {
        const item = googleData.items[0];
        const volumeId = item.id;

        const detailRes = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${volumeId}`,
        );
        const detailData = await detailRes.json();
        const book = detailData.volumeInfo;

        const publisherName = book.publisher || '';
        const words = publisherName.trim().split(/\s+/);
        let matchedPublisher = null;

        for (let i = 1; i <= Math.min(3, words.length); i++) {
          const searchString = normalize(words.slice(0, i).join(' '));
          matchedPublisher = publishers.find(pub =>
            normalize(pub.name).includes(searchString),
          );
          if (matchedPublisher) break;
        }

        if (!matchedPublisher) {
          matchedPublisher = publishers.find(pub =>
            words.some((word: any) =>
              normalize(pub.name).includes(normalize(word)),
            ),
          );
        }

        const publisherId = matchedPublisher ? matchedPublisher.id : '';

        const newInfo = {
          productName: book.title || '',
          publisher: publisherId,
          language: book.language || '',
          shortDescription: book.description || '',
          longDescription: book.description || '',
          authorName: book.authors?.[0] || '',
        };

        setProductName(newInfo.productName);
        setPublisher(newInfo.publisher);
        setLanguage(newInfo.language);
        setShortDescription(newInfo.shortDescription);
        setLongDescription(newInfo.longDescription);

        updateFormData('information', {
          ...formData.information,
          isbnNumber,
          ...newInfo,
        });
      } else {
        setError('No book found with this ISBN');
      }
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('Error fetching book data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookData = () => {
    fetchBookDataByIsbn(isbnNumber);
  };

  const fetchBookDataByCode = (code: string) => {
    setIsbnNumber(code);
    Toast.show({
      type: 'success',
      text1: `Barcode found ${code}`,
    });
    if (code) {
      fetchBookDataByIsbn(code);
    }
    setShowCamera(false);
  };

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      setError('Camera permission denied');
      return;
    }
    setIsbnNumber('');
    setShowCamera(prev => !prev);
  };

  useEffect(() => {
    if (categoriesData?.all_category?.length > 0) {
      setCategories(categoriesData.all_category);
    }
    if (publishersData?.data?.length > 0) {
      setPublishers(publishersData.data);
    }
  }, [categoriesData, publishersData]);

  useEffect(() => {
    updateFormData('information', {
      isbnNumber,
      productName,
      shortDescription,
      longDescription,
      resourceType,
      language,
      publisher,
      status,
      category: selectedCategory,
      subCategory,
    });
  }, [
    isbnNumber,
    productName,
    shortDescription,
    longDescription,
    resourceType,
    language,
    publisher,
    status,
    selectedCategory,
    subCategory,
  ]);

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Basic Information</Text>
      <Text style={informationStyles.label}>ISBN NUMBER:</Text>
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
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={informationStyles.fetchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <BarcodeScanner
        isVisible={showCamera}
        onCodeScanned={fetchBookDataByCode}
        onClose={() => setShowCamera(false)}
      />

      <Text style={informationStyles.noteText}>
        ISBN can fetch the book minimal details, enter ISBN number to fetch or
        fill up manually
      </Text>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      <Text style={informationStyles.label}>Product Name *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={informationStyles.label}>Short Description *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Short Description"
        value={shortDescription}
        onChangeText={setShortDescription}
      />

      <Text style={informationStyles.label}>Long Description:</Text>
      <TextInput
        style={[informationStyles.input, {height: 80}]}
        placeholder="Enter Long Description"
        value={longDescription}
        onChangeText={setLongDescription}
        multiline
      />

      <CustomPicker
        label="Resource Type *:"
        selectedValue={resourceType}
        onValueChange={setResourceType}
        data={[
          {id: 'author', description: 'Author'},
          {id: 'edited_by', description: 'Edited Type'},
          {id: 'collected_by', description: 'Collected Type'},
        ]}
        placeholder="Select Category"
      />

      <Text style={informationStyles.label}>Author Name *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Author Name"
        value={formData.information?.authorName || ''}
        onChangeText={text =>
          updateFormData('information', {
            ...formData.information,
            authorName: text,
          })
        }
      />

      <CustomPicker
        label="Choose Category *:"
        selectedValue={selectedCategory}
        onValueChange={setSelectedCategory}
        data={categories}
        placeholder="Select Category"
      />

      {selectedCategory !== '' &&
        categories.some(item => item.parent_id === selectedCategory) && (
          <CustomPicker
            label="Choose Sub-Category:"
            selectedValue={subCategory}
            onValueChange={setSubCategory}
            data={categories.filter(
              item => item.parent_id === selectedCategory,
            )}
            placeholder="Select Sub-Category"
          />
        )}

      <CustomPicker
        label="Choose Publisher *:"
        selectedValue={publisher}
        onValueChange={setPublisher}
        data={publishers}
        labelKey="name"
        placeholder="Select Publisher"
      />

      <CustomPicker
        label="Language:"
        selectedValue={language}
        onValueChange={setLanguage}
        data={[
          {id: 'EN', description: 'English'},
          {id: 'BEN', description: 'Bengali'},
          {id: 'HIN', description: 'Hindi'},
        ]}
        placeholder="Select Category"
      />

      <Text style={informationStyles.label}>Status:</Text>
      <View style={informationStyles.radioContainer}>
        <TouchableOpacity
          style={informationStyles.radioButton}
          onPress={() => setStatus('active')}>
          <View
            style={[
              informationStyles.radioCircle,
              status === 'active' && informationStyles.radioSelected,
            ]}
          />
          <Text style={informationStyles.radioText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={informationStyles.radioButton}
          onPress={() => setStatus('inactive')}>
          <View
            style={[
              informationStyles.radioCircle,
              status === 'inactive' && informationStyles.radioSelected,
            ]}
          />
          <Text style={informationStyles.radioText}>Inactive</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CategoryForm;
