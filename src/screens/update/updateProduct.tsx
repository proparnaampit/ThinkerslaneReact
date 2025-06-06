import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../context/FormContextType';
import CategoryForm from './updateInformation';
import PriceInputScreen from '../product/Pricing';
import FilePickerComponent from '../product/Gallary';
import ProductInputForm from '../product/Attributes';
import SEOInputForm from '../product/SEO';
import productStyles from '../product/css/productUpload';
import {validateStep} from '../../utils/formValidation';
import {useRoute} from '@react-navigation/native';

const ProductUpdate: React.FC = () => {
  const {
    formData,
    currentStep,
    nextStep,
    previousStep,
    loading,
    updateFormData,
    setLoading,
    resetFormData,
    addImage,
  } = useFormContext();
  const route = useRoute();
  const {bookData}: any = route.params || {};
  const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(',')[1] || '';
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  };

  const mapBookToFormData = async (bookData: any) => {
    const images = await Promise.all(
      (bookData.images || []).map(async (img: string, index: number) => {
        const imageUrl = bookData.images?.[0]
          ? `https://staging.thinkerslane.com/public/uploads/admin/books/${img}`
          : null;

        if (!imageUrl) return null;

        const base64 = await convertImageToBase64(imageUrl);
        return {
          id: `book-image-${index}`,
          name: img,
          mimeType: 'image/jpeg',
          base64,
          includeBase64: true,
        };
      }),
    );

    return {
      information: {
        isbnNumber: bookData.isbn_number,
        productName: bookData.name,
        shortDescription: bookData.short_description,
        longDescription: bookData.description,
        resourceType: bookData.type,
        language: bookData.language,
        publisher: bookData.publisher_id?.toString(),
        status: bookData.status,
        category: bookData.category?.id?.toString(),
        subCategory: bookData.sub_category_id?.toString(),
        authorName: bookData.author || bookData['edited_by'],
      },
      pricing: {
        price: bookData.price,
        offered_price: bookData.offered_price,
      },
      product: {
        quantity: bookData.quantity,
        width: bookData.width,
        height: bookData.height,
        length: bookData.length,
        binding: bookData.binding,
        weight: bookData.weight,
      },
      seo: {
        seoTitle: bookData.seo_details?.seo_title,
        seoDescription: bookData.seo_details?.seo_description,
        ogTitle: bookData.seo_details?.og_title,
        ogDescription: bookData.seo_details?.og_description,
        keywords: bookData.seo_details?.keyword,
        promotionUrl: bookData.seo_details?.promotion_url,
      },
      images,
    };
  };

  const steps = [
    CategoryForm,
    PriceInputScreen,
    ProductInputForm,
    FilePickerComponent,
    SEOInputForm,
  ];

  const stepLabels = [
    'Basic Information',
    'Pricing',
    'Attributes',
    'Images',
    'SEO & Promotion',
  ];

  const onSubmit = async () => {
    if (!validateStep(currentStep, formData)) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please complete all required fields before submitting.',
      });
      return;
    }

    setLoading(true);

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
          category: parseInt(formData.information?.category || '0') || 0,
          sub_category: formData.information?.subCategory
            ? parseInt(formData.information.subCategory)
            : null,
          language: formData.information?.language || '',
          isbn_number: formData.information?.isbnNumber || '',
        },
        pricing: {
          price: parseFloat(formData.pricing?.price || '0') || 0,
          offered_price:
            parseFloat(formData.pricing?.offered_price || '0') || 0,
        },
        attributes: {
          quantity: parseInt(formData.product?.quantity || '0') || 0,
          width: parseFloat(formData.product?.width || '0') || 0,
          height: parseFloat(formData.product?.height || '0') || 0,
          length: parseFloat(formData.product?.length || '0') || 0,
          binding: formData.product?.binding || '',
          weight: parseFloat(formData.product?.weight || '0') || 0,
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

    // try {
    //   const result = await uploadBooks(payload).unwrap();

    //   if (result?.status === 200) {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Product Added Successfully',
    //       text2: 'Your product has been added successfully.',
    //     });
    //     resetFormData();
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Failed to Add Product',
    //       text2: result?.message || 'An unexpected error occurred.',
    //     });
    //   }
    // } catch (error: any) {
    //   console.error('API error:', error);
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Failed to Add Product',
    //     text2:
    //       error?.data?.message || 'Something went wrong. Please try again.',
    //   });
    // } finally {
    //   setLoading(false);
    // }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep, formData)) {
      nextStep();
    } else {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please complete all required fields to proceed.',
      });
    }
  };

  useEffect(() => {
    if (bookData) {
      const loadFormData = async () => {
        const mappedData = await mapBookToFormData(bookData);
        updateFormData('information', mappedData.information);
        updateFormData('pricing', mappedData.pricing);
        updateFormData('product', mappedData.product);
        updateFormData('seo', mappedData.seo);
        addImage(mappedData.images);
      };
      loadFormData();
    }
  }, [bookData]);

  const CurrentStepComponent = steps[currentStep - 1];

  return (
    <View style={productStyles.container}>
      {loading ? (
        <View style={productStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#223d79" />
        </View>
      ) : (
        <>
          <View style={productStyles.stepContainer}>
            <Text style={productStyles.stepIndicator}>
              Step {currentStep} of {steps.length}:{' '}
              {stepLabels[currentStep - 1]}
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
                onPress={handleNextStep}
                style={productStyles.continueButton}>
                <Text style={productStyles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            )}

            {currentStep === steps.length && (
              <TouchableOpacity
                onPress={onSubmit}
                style={productStyles.submitButton}
                disabled={loading}>
                <Text style={productStyles.submitButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default ProductUpdate;
