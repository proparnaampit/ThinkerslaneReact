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
import {useUploadBooksMutation} from '../../services/bookService';

const ProductUploadForm: React.FC<any> = () => {
  const {
    formData,
    currentStep,
    nextStep,
    previousStep,
    loading,
    resetFormData,
  } = useFormContext();

  const [uploadBooks, {isLoading, error}] = useUploadBooksMutation();

  const steps = [
    CategoryForm,
    PriceInputScreen,
    ProductInputForm,
    FilePickerComponent,
    SEOInputForm,
  ];

  const onSubmit = async () => {
    const payload = {
      params: {
        basic_information: {
          name: formData.information?.productName || '',
          short_description: formData.information?.shortDescription || '',
          long_description: formData.information?.longDescription || '',
          publisher: formData.information?.publisher || '',
          status: formData.information?.status === 'active' ? 1 : 0,
          resource_name: formData.information?.authorName || '',
          resource_type: formData.information?.resourceType || '',
          category: parseInt(formData.information?.category) || 0,
          sub_category: formData.information?.subCategory
            ? parseInt(formData.information.subCategory)
            : null,
          language: formData.information?.language || '',
        },
        pricing: {
          price: parseFloat(formData.pricing?.price) || 0,
          offered_price: parseFloat(formData.pricing?.offered_price) || 0,
        },
        attributes: {
          quantity: parseInt(formData.product?.quantity) || 0,
          width: parseFloat(formData.product?.width) || 0,
          height: parseFloat(formData.product?.height) || 0,
          length: parseFloat(formData.product?.length) || 0,
          binding: formData.product?.binding || '',
          weight: parseFloat(formData.product?.weight) || 0,
        },
        seo: {
          seo_title: formData.seo?.seoTitle || '',
          seo_description: formData.seo?.seoDescription || '',
          keywords: formData.seo?.keywords || '',
          promotion_url: formData.seo?.promotionUrl || '',
        },
        images:
          formData.images?.map(img => ({
            name: img.name || '',
            mimeType: img.mimeType || '',
            base64: img.base64 || '',
          })) || [],
      },
    };

    try {
      const result = await uploadBooks(payload).unwrap();

      if (result?.status == 200) {
        Toast.show({
          type: 'success',
          text1: 'Product Added Successfully',
          text2: 'Your product has been added successfully.',
        });
        resetFormData?.();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Add Product',
        });
      }
    } catch (error: any) {
      console.error('API error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Add Product',
        text2: error?.data?.message || 'Something went wrong.',
      });
    }
  };

  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <View style={productStyles.container}>
      {isLoading ? (
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
