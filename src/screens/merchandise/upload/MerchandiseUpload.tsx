import React from 'react';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  MerchandiseProvider,
  useMerchandiseContext,
} from '../../context/MerchandiseContext';
import {useUploadMerchandiseMutation} from '../../../services/merchandiseService';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import MerchandiseSteps from '../steps/MerchandiseSteps';
import {buildBasePayload, isSuccessResult} from '../shared/merchandisePayload';

// "MerchandiseAdd": upload a NEW product. Updating lives in MerchandiseEdit.
const AddForm: React.FC = () => {
  const {formData, resetFormData} = useMerchandiseContext();
  const navigation: any = useNavigation();
  const [uploadMerchandise, {isLoading}] = useUploadMerchandiseMutation();
  const {variantFields, sizeChart} = useCategoryConfig();

  const onSubmit = async () => {
    const {payload} = buildBasePayload(formData, variantFields, sizeChart);
    console.log('marchendise payload', JSON.stringify(payload));

    try {
      const result: any = await uploadMerchandise(payload).unwrap();
      console.log('marchendise response', JSON.stringify(result));
      if (isSuccessResult(result)) {
        Toast.show({
          type: 'success',
          text1: 'Product Added Successfully',
          text2:
            result?.message || 'Your merchandise has been added successfully.',
        });
        resetFormData();
        navigation.navigate('Merchandise');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Add Product',
          text2: result?.message || 'Something went wrong.',
        });
      }
    } catch (error: any) {
      console.error('Merchandise upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Add Product',
        text2: error?.data?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <MerchandiseSteps
      onSubmit={onSubmit}
      submitLabel="Save Product"
      isLoading={isLoading}
    />
  );
};

const MerchandiseUpload: React.FC = () => (
  <MerchandiseProvider key="add">
    <AddForm />
  </MerchandiseProvider>
);

export default MerchandiseUpload;
