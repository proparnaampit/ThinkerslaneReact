import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
  useGetAllPublishersQuery,
  useGetAllCategoryQuery,
} from '../../services/bookService';
import {Camera} from 'react-native-vision-camera';
import informationStyles from '../product/css/information';
import {useFormContext} from '../context/FormContextType';
import CustomPicker from '../../components/common/CustomPicker';
import BarcodeScanner from '../../components/common/CameraScanner';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomPickerPub from '../../components/common/CustomPickerPub';
import CustomPickerSub from '../../components/common/CustomPickerSub';

const CategoryForm: React.FC = () => {
  const {formData, updateFormData} = useFormContext();
  const {data: publishersData} = useGetAllPublishersQuery({});
  const {data: categoriesData} = useGetAllCategoryQuery({});

  const [isbnNumber, setIsbnNumber] = useState(
    formData.information?.isbnNumber || '',
  );
  const [authorName, setAuthorName] = useState('');
  const [productName, setProductName] = useState(
    formData.information?.productName || '',
  );
  const [pageNumber, setPageNumber] = useState(
    formData.information?.pageNumber || '',
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
  const [status, setStatus] = useState(formData.information?.status);
  const [subCategory, setSubCategory] = useState(
    formData.information?.subCategory || '',
  );
  const [selectedCategory, setSelectedCategory] = useState(
    formData.information?.category || '',
  );

  const [error, setError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState(false);

  const [showScanner, setShowScanner] = useState(false);

  const fetchBookDataByCode = async code => {
    if (!code) {
      setError('Please enter an ISBN number');
      return;
    }
    setError('');
    const normalize = (str: any) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${code}`,
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const item = data.items[0];
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
    }
  };

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermission();
    if (permission === 'denied') {
      return;
    }
    setIsbnNumber('');
    setShowCamera(prev => !prev);
  };
  const handleCodeScanned = (code: string) => {
    const numericCode = code.replace(/[^0-9]/g, '');
    setIsbnNumber(numericCode);
    updateFormData('information', {
      ...formData.information,
      isbnNumber: numericCode,
    });

    Toast.show({
      type: 'success',
      text1: `Barcode found ${numericCode}`,
    });

    setShowCamera(false);
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
    if (formData.information) {
      setPageNumber(formData.information.pageNumber || '');
      setIsbnNumber(formData.information.isbnNumber || '');
      setProductName(formData.information.productName || '');
      setLongDescription(formData.information.longDescription || '');
      setResourceType(formData.information.resourceType);
      setLanguage(formData.information.language || '');
      setPublisher(formData.information.publisher || '');
      setAuthorName(formData.information.authorName || '');
      setStatus(formData.information.status);
      setSelectedCategory(formData.information.category || '');
      setSubCategory(formData.information.subCategory || '');
    }
  }, [formData.information]);

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>Update Book</Text>
      <Text style={informationStyles.label}>ISBN NUMBER:</Text>
      <View style={informationStyles.inputContainer}>
        <TextInput
          style={[informationStyles.ISBNinputDisabled, {flex: 1}]}
          placeholder="Enter ISBN NUMBER"
          value={isbnNumber}
          keyboardType="numeric"
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setIsbnNumber(numericText);
            updateFormData('information', {
              ...formData.information,
              isbnNumber: numericText,
            });
          }}
        />
      </View>
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

      <View style={{flex: 1}}>
        <BarcodeScanner
          isVisible={showCamera}
          onCodeScanned={handleCodeScanned}
          onClose={() => setShowCamera(false)}
        />
      </View>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      <Text style={informationStyles.label}>Page Numbers *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Page Numbers"
        value={pageNumber}
        keyboardType="numeric"
        onChangeText={value => {
          const numericText = value.replace(/[^0-9]/g, '');
          setPageNumber(numericText);
          updateFormData('information', {
            ...formData.information,
            pageNumber: numericText,
          });
        }}
      />

      <Text style={informationStyles.label}>Product Name *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={value => {
          setProductName(value);
          updateFormData('information', {
            ...formData.information,
            productName: value,
          });
        }}
      />

      <CustomPicker
        label="Resource Type *:"
        selectedValue={resourceType}
        onValueChange={value => {
          setResourceType(value);
          updateFormData('information', {
            ...formData.information,
            resourceType: value,
          });
        }}
        data={[
          {id: 'author', description: 'Author'},
          {id: 'edited_by', description: 'Edited Type'},
          {id: 'collected_by', description: 'Collected Type'},
        ]}
        placeholder="Select Category"
      />

      <Text style={informationStyles.label}>Resource Name *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Author Name"
        value={authorName}
        onChangeText={text => {
          setAuthorName(text);
          updateFormData('information', {
            ...formData.information,
            authorName: text,
          });
        }}
      />

      <CustomPickerPub
        label="Choose Category *:"
        selectedValue={selectedCategory}
        onValueChange={value => {
          setSelectedCategory(value);
          updateFormData('information', {
            ...formData.information,
            category: value,
          });
        }}
        data={categories}
        placeholder="Select Category"
      />
      {selectedCategory !== '' &&
        categories.some(item => item.parent_id === selectedCategory) && (
          <CustomPickerSub
            label="Choose Sub-Category:"
            selectedValue={subCategory}
            onValueChange={value => {
              setSubCategory(value);
              updateFormData('information', {
                ...formData.information,
                subCategory: value,
              });
            }}
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
        onValueChange={value => {
          setLanguage(value);
          updateFormData('information', {
            ...formData.information,
            language: value,
          });
        }}
        data={[
          {id: 'EN', description: 'English'},
          {id: 'BN', description: 'Bengali'},
          {id: 'HI', description: 'Hindi'},
        ]}
        placeholder="Select language"
      />

      <Text style={informationStyles.label}>Status:</Text>
      <View style={informationStyles.radioContainer}>
        <TouchableOpacity
          style={informationStyles.radioButton}
          onPress={status =>
            updateFormData('information', {
              ...formData.information,
              status: 'active',
            })
          }>
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
          onPress={status =>
            updateFormData('information', {
              ...formData.information,
              status: 'inactive',
            })
          }>
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
