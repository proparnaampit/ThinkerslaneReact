import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  useGetAllPublishersQuery,
  useGetAllCategoryQuery,
} from '../../services/bookService';
import informationStyles from './css/information';
import {useFormContext} from '../context/FormContextType';

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

  const fetchBookData = async () => {
    if (!isbnNumber) {
      setError('Please enter an ISBN number');
      return;
    }
    setIsLoading(true);
    setError('');
    const normalize = (str: any) =>
      str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnNumber}`,
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
          style={[informationStyles.input, {flex: 1}]}
          placeholder="Enter ISBN NUMBER"
          value={isbnNumber}
          keyboardType="numeric"
          onChangeText={text => {
            const numericText = text.replace(/[^0-9]/g, '');
            setIsbnNumber(numericText);
          }}
        />

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
      <Text style={informationStyles.noteText}>
        ISBN can fetch the book minimal details, enter usbn number to fetch or
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

      <Text style={informationStyles.label}>Resource Type *:</Text>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: '#ccc',
          borderRadius: 5,
          justifyContent: 'center',
        }}>
        <Picker
          selectedValue={resourceType}
          onValueChange={setResourceType}
          style={[informationStyles.picker, {fontSize: 13, flex: 1}]}
          itemStyle={{fontSize: 13}}>
          <Picker.Item label="Author" value="author" style={{fontSize: 13}} />
          <Picker.Item
            label="Edited Type"
            value="edited_by"
            style={{fontSize: 13}}
          />
          <Picker.Item
            label="Collected Type"
            value="collected_by"
            style={{fontSize: 13}}
          />
        </Picker>
      </View>

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

      <Text style={informationStyles.label}>Choose Category *:</Text>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: '#ccc',
          borderRadius: 5,
          justifyContent: 'center',
        }}>
        <Picker
          style={informationStyles.picker}
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}>
          {categories.map(category => (
            <Picker.Item
              key={category.id}
              label={category.description}
              value={category.id}
              style={{fontSize: 13}}
            />
          ))}
        </Picker>
      </View>

      {selectedCategory !== '' &&
        categories.some(item => item.parent_id === selectedCategory) && (
          <>
            <Text style={informationStyles.label}>Choose Sub-Category:</Text>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: '#ccc',
                borderRadius: 5,
                justifyContent: 'center',
              }}>
              <Picker
                selectedValue={subCategory}
                onValueChange={setSubCategory}
                style={informationStyles.picker}>
                <Picker.Item label="Select Sub-Category" value="" />
                {categories
                  .filter(item => item.parent_id === selectedCategory)
                  .map(sub => (
                    <Picker.Item
                      key={sub.id}
                      label={sub.description}
                      value={sub.id}
                      style={{fontSize: 13}}
                    />
                  ))}
              </Picker>
            </View>
          </>
        )}

      <Text style={informationStyles.label}>Choose Publisher *:</Text>
      <View
        style={{
          borderWidth: 0.5,
          borderColor: '#ccc',
          borderRadius: 5,
          justifyContent: 'center',
        }}>
        <Picker
          selectedValue={publisher}
          onValueChange={setPublisher}
          style={informationStyles.picker}>
          <Picker.Item label="Select Publisher" value="" />
          {publishers.map(publisher => (
            <Picker.Item
              key={publisher.id}
              label={publisher.name}
              value={publisher.id}
              style={{fontSize: 13}}
            />
          ))}
        </Picker>
      </View>

      <Text style={informationStyles.label}>Language:</Text>
      <Picker
        selectedValue={language}
        onValueChange={itemValue => setLanguage(itemValue)}
        style={informationStyles.picker}>
        <Picker.Item label="English" value="EN" />
        <Picker.Item label="Bengali" value="BEN" />
        <Picker.Item label="Hindi" value="HIN" />
      </Picker>

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
