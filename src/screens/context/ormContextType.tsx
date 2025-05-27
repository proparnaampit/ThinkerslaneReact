import React, { createContext, useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ProductInputForm from '../product/Attributes'; // Adjust path as needed
import FilePickerComponent from '../product/Gallary'; // Adjust path as needed
import CategoryForm from '../product/Imformations'; // Adjust path as needed
import PriceInputScreen from '../product/Pricing'; // Adjust path as needed
import SEOInputForm from '../product/SEO'; // Adjust path as needed

// Define types for form data
interface FormData {
  attribute: { [key: string]: string };
  gallery: { [key: string]: string };
  information: { [key: string]: string };
  pricing: { [key: string]: string };
  seo: { [key: string]: string };
}

// Context for form data
interface FormContextType {
  formData: FormData;
  updateFormData: (section: keyof FormData, data: { [key: string]: string }) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Hook to use form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

// Main Form Section Component
const FormSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    attribute: {},
    gallery: {},
    information: {},
    pricing: {},
    seo: {},
  });

  const updateFormData = (section: keyof FormData, data: { [key: string]: string }) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleFinalSubmit = () => {
    console.log('All Form Data:', formData);
    // Add logic to save or send the form data (e.g., to an API)
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      <View style={styles.container}>
        <Text style={styles.title}>Form Section</Text>
        <ProductInputForm />
        <FilePickerComponent />
        <CategoryForm />
        <PriceInputScreen />
        <SEOInputForm />
        <Button title="Submit All Data" onPress={handleFinalSubmit} />
        <Text style={styles.output}>Current Form Data: {JSON.stringify(formData, null, 2)}</Text>
      </View>
    </FormContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  output: {
    marginTop: 20,
    fontSize: 14,
    color: '#333',
  },
});

export default FormSection;