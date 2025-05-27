import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const SEOInputForm = () => {
  const [formData, setFormData] = useState({
    promotionUrl: '',
    seoDescription: '',
    ogDescription: '',
    seoTitle: '',
    ogTitle: '',
    keywords: '',
  });

  const handleInputChange = (field:any, value:any) => {
    setFormData({ ...formData, [field]: value });
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>SEO & Promotion Details</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Promotion URL</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Promotion URL"
          value={formData.promotionUrl}
          onChangeText={(text) => handleInputChange('promotionUrl', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>SEO Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Enter SEO Description"
          value={formData.seoDescription}
          onChangeText={(text) => handleInputChange('seoDescription', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>OG Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Enter OG Description"
          value={formData.ogDescription}
          onChangeText={(text) => handleInputChange('ogDescription', text)}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>SEO Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter SEO Title"
          value={formData.seoTitle}
          onChangeText={(text) => handleInputChange('seoTitle', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>OG Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter OG Title"
          value={formData.ogTitle}
          onChangeText={(text) => handleInputChange('ogTitle', text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Keywords (comma-separated)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Keywords"
          value={formData.keywords}
          onChangeText={(text) => handleInputChange('keywords', text)}
        />
      </View>

     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 13,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  multiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  nextButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SEOInputForm;