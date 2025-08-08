import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import Toast from 'react-native-toast-message';
import {useFormContext} from '../context/FormContextType';
import CategoryForm from './updateInformation';
import PriceInputScreen from '../product/Pricing';
import FilePickerComponent from '../product/Gallary';
import ProductInputForm from '../product/Attributes';
import SEOInputForm from '../product/SEO';
import LongDescription from '../product/longDescription';
import productStyles from '../product/css/productUpload';
import {validateStep} from '../../utils/formValidation';
import {useRoute} from '@react-navigation/native';
import {useUpdateBookMutation} from '../../services/bookService';

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
  const [updateBook, {isLoading, error}] = useUpdateBookMutation();

  const convertImageToBase64 = async (
    imageUrl: string,
  ): Promise<{base64: string; mimeType: string}> => {
    try {
      const response = await fetch(imageUrl, {mode: 'cors'});

      const mimeType = response.headers.get('Content-Type') || 'image/jpeg';

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!mimeType.startsWith('image/')) {
        throw new Error(`Invalid mime type: ${mimeType}`);
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const result = reader.result?.toString() || '';
          const base64String = result.split(',')[1] || '';

          if (!base64String || base64String.length < 1) {
            reject(new Error('Base64 too short or invalid'));
          } else {
            resolve({base64: base64String, mimeType});
          }
        };

        reader.onerror = error => {
          console.error('FileReader error:', error);
          reject(error);
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to Base64:', error);
      return {base64: '', mimeType: ''};
    }
  };

  const mapBookToFormData = async (bookData: any) => {
    let firstImage = null;

    if (bookData?.image) {
      if (Array.isArray(bookData.image)) {
        firstImage = bookData.image[0];
      } else if (typeof bookData.image === 'string') {
        firstImage = bookData.image.split(',')[0].trim();
      }
    } else if (Array.isArray(bookData.images) && bookData.images[0]) {
      firstImage = bookData.images[0];
    }

    const imageUrl = firstImage
      ? `https://thinkerslane.com/public/uploads/admin/books/${firstImage}`
      : null;

    let images: any[] = [];

    if (bookData.images && bookData.images.length > 0) {
      images = await Promise.all(
        bookData.images.map(async (img: string, index: number) => {
          const imageUrl = img
            ? `https://thinkerslane.com/public/uploads/admin/books/${img}`
            : null;

          if (!imageUrl) {
            console.warn(`No image URL for ${img}`);
            return null;
          }

          try {
            const result = await convertImageToBase64(imageUrl);
            if (!result.base64) {
              console.warn(`Invalid Base64 for image: ${img}`);
              return null;
            }

            return {
              id: `book-image-${index}`,
              name: img,
              mimeType: result.mimeType,
              base64: `data:${result.mimeType};base64,${result.base64}`,
              includeBase64: true,
            };
          } catch (error) {
            console.error(`Error converting ${img} to Base64:`, error);
            return null;
          }
        }),
      );
    }

    if ((!images || images.filter(Boolean).length === 0) && imageUrl) {
      try {
        const result = await convertImageToBase64(imageUrl);
        if (result.base64) {
          images = [
            {
              id: `book-image-0`,
              name: firstImage || 'cover.jpg',
              mimeType: result.mimeType,
              base64: `data:${result.mimeType};base64,${result.base64}`,
              includeBase64: true,
            },
          ];
        }
      } catch (err) {
        console.error('Error with fallback firstImageUrl:', err);
      }
    }

    return {
      information: {
        pageNumber: bookData.page_number,
        isbnNumber: bookData.isbn_number,
        productName: bookData.name,
        shortDescription: bookData.short_description,
        longDescription: bookData.description,
        resourceType:
          bookData.resourceType ||
          (bookData.edited_by
            ? 'edited_by'
            : bookData.collected_by
            ? 'collected_by'
            : 'author'),
        resourceName: bookData.authorName,
        language: bookData.language,
        publisher: bookData.publisher_id?.toString(),
        status: bookData.is_deleted == 0 ? 'active' : 'inactive',
        category: bookData.categoryId?.toString(),
        subCategory: bookData.sub_category_id?.toString(),
        authorName:
          bookData.resource_name ||
          bookData.author ||
          bookData.edited_by ||
          bookData.collected_by ||
          '',
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
      images: images.filter(img => img !== null),
      firstImageUrl: imageUrl,
    };
  };

  const steps = [
    CategoryForm,
    LongDescription,
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
        user_id: formData.information?.isbnNumber || null,
        product_id: bookData.id ? bookData.id : null,
        isbn: formData.information?.isbnNumber || null,
        basic_information: {
          pageNumber: formData.information?.pageNumber || '',
          name: formData.information?.productName || '',
          short_description: formData.information?.shortDescription || '',
          long_description: formData.information?.longDescription || '',
          publisher: parseInt(formData.information?.publisher) || 0,
          status: formData.information?.status == 'active' ? 1 : 0,
          resource_name: formData.information?.authorName || '',
          resource_type: formData.information?.resourceType || '',
          category: parseInt(formData.information?.category) || 0,
          sub_category: formData.information?.subCategory
            ? parseInt(formData.information.subCategory)
            : 0,
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
          og_title: formData.seo?.ogTitle || '',
          og_description: formData.seo?.ogDescription || '',
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
      const result = await updateBook(payload).unwrap();

      if (result?.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Product Added Successfully',
          text2: 'Your product has been added successfully.',
        });
        resetFormData();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Add Product',
          text2: result?.message || 'An unexpected error occurred.',
        });
      }
    } catch (error: any) {
      console.error('API error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Add Product',
        text2:
          error?.data?.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep, formData)) {
      nextStep();
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

        if (mappedData.images && mappedData.images.length > 0) {
          addImage(mappedData.images);
        } else if (mappedData.firstImageUrl) {
          addImage([
            {
              id: 'book-image-0',
              name: 'cover',
              mimeType: 'image/jpeg',
              base64: mappedData.firstImageUrl,
              includeBase64: false,
            },
          ]);
        }
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
