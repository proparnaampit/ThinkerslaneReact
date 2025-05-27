import React from 'react';
import {View, Text, TextInput, ScrollView} from 'react-native';
import informationStyles from './css/information';
import {useFormContext} from '../context/FormContextType';

const SEOInputForm = () => {
  const {formData, updateFormData} = useFormContext();

  const seoData = formData.seo || {
    promotionUrl: '',
    seoDescription: '',
    ogDescription: '',
    seoTitle: '',
    ogTitle: '',
    keywords: '',
  };

  const handleInputChange = (field: keyof typeof seoData, value: string) => {
    updateFormData('seo', {[field]: value});
  };

  return (
    <ScrollView style={informationStyles.container}>
      <Text style={informationStyles.header}>SEO & Promotion Details</Text>
      <Text style={informationStyles.noteText}>
        Enter the SEO and promotion details for your product. This will help in
        better visibility and searchability of your products on the platform.
      </Text>

      <Text style={informationStyles.label}>Promotion URL</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Promotion URL"
        value={seoData.promotionUrl}
        onChangeText={text => handleInputChange('promotionUrl', text)}
      />

      <Text style={informationStyles.label}>SEO Description</Text>
      <TextInput
        style={[informationStyles.input, {height: 80}]}
        placeholder="Enter SEO Description"
        value={seoData.seoDescription}
        onChangeText={text => handleInputChange('seoDescription', text)}
        multiline
      />

      <Text style={informationStyles.label}>OG Description</Text>
      <TextInput
        style={[informationStyles.input, {height: 80}]}
        placeholder="Enter OG Description"
        value={seoData.ogDescription}
        onChangeText={text => handleInputChange('ogDescription', text)}
        multiline
      />

      <Text style={informationStyles.label}>SEO Title</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter SEO Title"
        value={seoData.seoTitle}
        onChangeText={text => handleInputChange('seoTitle', text)}
      />

      <Text style={informationStyles.label}>OG Title</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter OG Title"
        value={seoData.ogTitle}
        onChangeText={text => handleInputChange('ogTitle', text)}
      />

      <Text style={informationStyles.label}>Keywords (comma-separated)</Text>
      <TextInput
        style={informationStyles.input}
        placeholder="Enter Keywords"
        value={seoData.keywords}
        onChangeText={text => handleInputChange('keywords', text)}
      />
    </ScrollView>
  );
};

export default SEOInputForm;
