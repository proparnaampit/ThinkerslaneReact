import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useFormContext} from '../context/FormContextType';
import ProductInputForm from '../product/Attributes';
import FilePickerComponent from '../product/Gallary';
import CategoryForm from './BasicInformations';
import PriceInputScreen from '../product/Pricing';
import SEOInputForm from '../product/SEO';
import productStyles from './css/productUpload';
import Toast from 'react-native-toast-message';
import {validateStep} from '../../utils/formValidation';

const ProductUploadForm: React.FC<any> = () => {
  const {
    formData,
    currentStep,
    nextStep,
    previousStep,
    loading,
    resetFormData,
  } = useFormContext();

  const steps = [
    CategoryForm,
    PriceInputScreen,
    ProductInputForm,
    FilePickerComponent,
    SEOInputForm,
  ];

  const onSubmit = () => {
    Toast.show({
      type: 'success',
      text1: 'Product Added Successfully',
      text2: 'Your product has been added successfully.',
    });
    resetFormData();
  };

  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <View style={productStyles.container}>
      {loading ? (
        <View style={productStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <>
          <View style={productStyles.stepContainer}>
            <Text style={productStyles.stepIndicator}>
              Step {currentStep} of {steps.length}
            </Text>
            <CurrentStepComponent />
          </View>

          <View style={productStyles.navigationContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                onPress={previousStep}
                style={productStyles.backButton}>
                <Text style={productStyles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            {currentStep < steps.length && (
              <TouchableOpacity
                onPress={() => {
                  if (validateStep(currentStep, formData)) {
                    nextStep();
                  }
                }}
                style={productStyles.continueButton}>
                <Text style={productStyles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            )}

            {currentStep === steps.length && !loading && (
              <TouchableOpacity
                onPress={() => onSubmit()}
                style={productStyles.submitButton}>
                <Text style={productStyles.submitButtonText}>{'Complete'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ProductUploadForm;
