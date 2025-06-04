import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../../context/updateContext';
import informationStyles from '../product/css/information';

const SEOInputForm: React.FC = () => {
  const {formData, updateFormData} = useFormContext();
  const [seoTitle, setSeoTitle] = useState(formData.seo?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(
    formData.seo?.seoDescription || '',
  );
  const [keywords, setKeywords] = useState(formData.seo?.keywords || '');
  const [promotionUrl, setPromotionUrl] = useState(
    formData.seo?.promotionUrl || '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isbnNumber = formData.information?.isbnNumber || '';

  const fetchSEODataByIsbn = async (isbn: string) => {
    if (!isbn) {
      setError('ISBN number is required to fetch SEO data');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'ISBN number is required to fetch SEO data',
      });
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://staging.thinkerslane.com/thAdmin/getBookByIsbn?isbn_number=${isbn}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.json();

      if (data?.status === 200 && data?.book) {
        const book = data.book;
        const newSEO = {
          seoTitle: book.seo_title || book.name || '',
          seoDescription: book.seo_description || book.short_description || '',
          keywords: book.seo_keywords || book.name?.split(' ').join(', ') || '',
          promotionUrl: book.promotion_url || '',
        };

        updateFormData('seo', newSEO);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'SEO data fetched successfully',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Error fetching SEO data',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: 'seoTitle' | 'seoDescription' | 'keywords' | 'promotionUrl',
    value: string,
  ) => {
    switch (field) {
      case 'seoTitle':
        setSeoTitle(value);
        break;
      case 'seoDescription':
        setSeoDescription(value);
        break;
      case 'keywords':
        setKeywords(value);
        break;
      case 'promotionUrl':
        setPromotionUrl(value);
        break;
    }
    updateFormData('seo', {[field]: value});
  };

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>SEO & Promotion Details</Text>
      <Text style={informationStyles.noteText}>
        Enter the SEO and promotion details for your product. This will help in
        better visibility and searchability of your products on the platform.
      </Text>

      <Text style={informationStyles.label}>ISBN NUMBER:</Text>
      <View style={informationStyles.inputContainer}>
        <TextInput
          style={[informationStyles.ISBNinput, {flex: 1}]}
          placeholder="ISBN from Basic Information"
          value={isbnNumber}
          editable={false}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={informationStyles.fetchButton}
          onPress={() => fetchSEODataByIsbn(isbnNumber)}
          disabled={isLoading || !isbnNumber}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={informationStyles.fetchButtonText}>Fetch SEO</Text>
          )}
        </TouchableOpacity>
      </View>

      {error ? <Text style={informationStyles.errorText}>{error}</Text> : null}

      <Text style={informationStyles.label}>SEO Title *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter SEO Title"
        value={seoTitle}
        onChangeText={text => handleInputChange('seoTitle', text)}
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>SEO Description *:</Text>
      <TextInput
        style={[informationStyles.input, {height: 80}]}
        placeholder="Enter SEO Description"
        value={seoDescription}
        onChangeText={text => handleInputChange('seoDescription', text)}
        multiline
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Keywords (comma-separated) *:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Keywords"
        value={keywords}
        onChangeText={text => handleInputChange('keywords', text)}
        placeholderTextColor="#999"
      />

      <Text style={informationStyles.label}>Promotion URL:</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Promotion URL"
        value={promotionUrl}
        onChangeText={text => handleInputChange('promotionUrl', text)}
        placeholderTextColor="#999"
      />
    </ScrollView>
  );
};

export default SEOInputForm;
