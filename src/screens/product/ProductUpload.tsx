import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
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

// Context for form data and navigation
interface FormContextType {
  formData: FormData;
  updateFormData: (section: keyof FormData, data: { [key: string]: string }) => void;
  currentStep: number;
  nextStep: () => void;
  previousStep: () => void;
  loading: boolean;
  refetchPreloadedData: () => void;
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

// Form Provider Component
interface ProductUploadFormProps {
  onSubmit: (data: FormData) => void;
  update?: boolean;
  isLoading?: boolean;
}

const ProductUploadForm: React.FC<ProductUploadFormProps> = ({
  onSubmit,
  update = false,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<FormData>({
    attribute: {},
    gallery: {},
    information: {},
    pricing: {},
    seo: {},
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const updateFormData = (section: keyof FormData, data: { [key: string]: string }) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const refetchPreloadedData = () => {
    setLoading(true);
    // Simulate fetching preloaded data (e.g., from an API)
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Replace with actual API call if needed
  };

  useEffect(() => {
    refetchPreloadedData();
    // Debug: Log currentStep to ensure it's updating
    console.log('Current Step:', currentStep);
  }, [currentStep]);

  const steps = [
    CategoryForm, // Step 1
    PriceInputScreen, // Step 2
    ProductInputForm, // Step 3
    FilePickerComponent, // Step 4
    SEOInputForm, // Step 5
  ];

  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <FormContext.Provider
      value={{ formData, updateFormData, currentStep, nextStep, previousStep, loading, refetchPreloadedData }}
    >
    
      <View style={styles.container}>
        {loading || isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
          
          </View>
        ) : (
          <>
       
            <View style={styles.stepContainer}>
              <Text style={styles.stepIndicator}>Step {currentStep} of {steps.length}</Text>
              <CurrentStepComponent />
            </View>

            <View style={styles.navigationContainer}>
              {currentStep > 1 && (
                <TouchableOpacity onPress={previousStep} style={styles.backButton}>
                  <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
              )}

              {currentStep < steps.length && (
                <TouchableOpacity onPress={nextStep} style={styles.continueButton}>
                  <Text style={styles.continueButtonText}>Continue</Text>
                </TouchableOpacity>
              )}

              {currentStep === steps.length && !loading && (
                <TouchableOpacity onPress={() => onSubmit(formData)} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>{update ? 'Update' : 'Complete'}</Text>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
    </FormContext.Provider>
  );
};

// Responsive styles optimized for all mobile devices
const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Math.max(width * 0.04, 10), // Minimum padding of 10px
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginHorizontal: Math.max(width * 0.02, 8), // Minimum margin of 8px
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingBottom: Math.max(height * 0.02, 12), // Minimum padding of 12px
   
  },
  stepIndicator: {
    fontSize: Math.max(width * 0.045, 16), // Minimum font size of 16px
    fontWeight: '500',
    color: 'gray',
    marginBottom: 3, // Minimum margin of 10px
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Keep space-between for now, but adjust button widths
    alignItems: 'center',
    paddingVertical: Math.max(height * 0.02, 12), // Minimum vertical padding
    paddingHorizontal: Math.max(width * 0.04, 16), // Minimum horizontal padding
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  backButton: {
    backgroundColor: '#f3f4f6', // Matches the screenshot
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10, // Increased for a more rounded look
    minWidth: Math.max(width * 0.35, 120), // Consistent width
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  backButtonText: {
    color: '#374151', // Matches the screenshot
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#000', // Changed to pure black to match the screenshot
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10, // Increased for a more rounded look
    minWidth: Math.max(width * 0.35, 120), // Consistent width
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:23,
  },
  continueButtonText: {
    color: '#fff', // Matches the screenshot
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#000', // Changed to pure black to match the screenshot
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10, // Increased for a more rounded look
    minWidth: Math.max(width * 0.35, 120), // Consistent width
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  submitButtonText: {
    color: '#fff', // Matches the screenshot
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '600',
  },
});

export default ProductUploadForm;