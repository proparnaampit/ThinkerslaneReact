import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Define interfaces for type safety
interface BookData {
  volumeInfo: {
    title?: string;
    publisher?: string;
    publishedDate?: string;
    description?: string;
    language?: string;
    authors?: string[];
  };
}

interface Category {
  id: string | number;
  description: string;
}

interface SubCategory {
  id: string | number;
  description: string;
}

interface Publisher {
  id: string | number;
  name: string;
}

const CategoryForm: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [isbnNumber, setIsbnNumber] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [publisher, setPublisher] = useState('');
  const [language, setLanguage] = useState('');
  const [productName, setProductName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [status, setStatus] = useState('active');
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [fetchedData, setFetchedData] = useState<BookData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Function to update formData
  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch book data from Google Books API
  const fetchBookData = async () => {
    if (!isbnNumber) {
      setError('Please enter an ISBN number');
      return;
    }

    setIsLoading(true);
    setError('');
    setFetchedData(null);

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnNumber}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const bookData = data.items[0] as BookData;
        setProductName(bookData.volumeInfo.title || '');
        setPublisher(bookData.volumeInfo.publisher || '');
        setLanguage(bookData.volumeInfo.language || '');
        setShortDescription(bookData.volumeInfo.description || '');
        setLongDescription(bookData.volumeInfo.description || '');
        updateFormData('productName', bookData.volumeInfo.title || '');
        updateFormData('publisher', bookData.volumeInfo.publisher || '');
        updateFormData('language', bookData.volumeInfo.language || '');
        updateFormData('shortDescription', bookData.volumeInfo.description || '');
        updateFormData('longDescription', bookData.volumeInfo.description || '');
        updateFormData('authorName', bookData.volumeInfo.authors?.[0] || '');
      } else {
        setError('No book found with this ISBN');
      }
    } catch (err) {
      setError('Error fetching book data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories and publishers on component mount
  useEffect(() => {
    // Fetch categories
    fetch('https://staging.thinkerslane.com/thAdmin/getAllCategory')
      .then(response => response.json())
      .then(data => {
        setCategories(data?.all_category || []);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories');
      });

    // Fetch publishers
    fetch('https://staging.thinkerslane.com/th1/getPublishers')
      .then(response => response.json())
      .then(data => {
        setPublishers(data?.publishers || []);
        console.log('Publishers fetched:', data?.publishers || []);
      })
      .catch(error => {
        console.error('Error fetching publishers:', error);
        setError('Failed to load publishers');
      });
  }, []);

  // Fetch sub-categories when selectedCategory changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      fetch(`https://staging.thinkerslane.com/thAdmin/getSubCategories?categoryId=${selectedCategory}`)
        .then(response => response.json())
        .then(data => {
          setSubCategories(data?.sub_categories || []);
          setSubCategory(''); // Reset sub-category when category changes
        })
        .catch(error => {
          console.error('Error fetching sub-categories:', error);
          setSubCategories([]);
          setSubCategory('');
          setError('Failed to load sub-categories');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSubCategories([]);
      setSubCategory('');
    }
    console.log('Selected Category:', selectedCategory);
  }, [selectedCategory]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Basic Information</Text>

      <Text style={styles.label}>ISBN NUMBER:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Enter ISBN NUMBER"
          value={isbnNumber}
          onChangeText={(text) => {
            setIsbnNumber(text);
            updateFormData('isbnNumber', text);
          }}
        />
        <TouchableOpacity style={styles.fetchButton} onPress={fetchBookData} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.fetchButtonText}>Fetch</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Text style={styles.label}>Product Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Product Name"
        value={productName}
        onChangeText={(text) => {
          setProductName(text);
          updateFormData('productName', text);
        }}
      />

      <Text style={styles.label}>Short Description*:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Short Description"
        value={shortDescription}
        onChangeText={(text) => {
          setShortDescription(text);
          updateFormData('shortDescription', text);
        }}
      />

      <Text style={styles.label}>Long Description*:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter Long Description"
        value={longDescription}
        onChangeText={(text) => {
          setLongDescription(text);
          updateFormData('longDescription', text);
        }}
        multiline
      />

      <Text style={styles.label}>Resource Type*:</Text>
      <Picker
        selectedValue={resourceType}
        onValueChange={(itemValue) => {
          setResourceType(itemValue);
          updateFormData('resourceType', itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select Resource Type" value="" />
        <Picker.Item label="Author" value="author" />
        <Picker.Item label="Edited Type" value="edited_type" />
        <Picker.Item label="Collected Type" value="collected_type" />
      </Picker>

      <Text style={styles.label}>Author Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Author Name"
        value={fetchedData?.volumeInfo?.authors?.[0] || ''}
        onChangeText={(text) => {
          updateFormData('authorName', text);
        }}
      />

      <View>
        <Text style={styles.label}>Choose Category*:</Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            updateFormData('category', itemValue);
          }}
        >
          <Picker.Item label="Select a category" value="" />
          {categories.map(category => (
            <Picker.Item
              key={category.id}
              label={category.description}
              value={category.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Choose Sub-Category:</Text>
      <Picker
        selectedValue={subCategory}
        onValueChange={(itemValue) => {
          setSubCategory(itemValue);
          updateFormData('subCategory', itemValue);
        }}
        style={styles.picker}
        enabled={subCategories.length > 0}
      >
        <Picker.Item label="Select a sub-category" value="" />
        {subCategories.map(subCategory => (
          <Picker.Item
            key={subCategory.id}
            label={subCategory.description}
            value={subCategory.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Choose Publisher*:</Text>
      <Picker
        selectedValue={publisher}
        onValueChange={(itemValue) => {
          setPublisher(itemValue);
          updateFormData('publisher', itemValue);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Select Publisher" value="" />
        {publishers.map(publisher => (
          <Picker.Item
            key={publisher.id}
            label={publisher.name}
            value={publisher.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Language:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Language"
        value={language}
        onChangeText={(text) => {
          setLanguage(text);
          updateFormData('language', text);
        }}
      />

      <Text style={styles.label}>Status:</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => {
            setStatus('active');
            updateFormData('status', 'active');
          }}
        >
          <View style={[styles.radioCircle, status === 'active' && styles.radioSelected]} />
          <Text style={styles.radioText}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => {
            setStatus('inactive');
            updateFormData('status', 'inactive');
          }}
        >
          <View style={[styles.radioCircle, status === 'inactive' && styles.radioSelected]} />
          <Text style={styles.radioText}>Inactive</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fetchButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
    alignItems: 'center',
    marginBottom: 18,
  },
  fetchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 22,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
  },
});

export default CategoryForm;