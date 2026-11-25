import React, {useEffect, useRef} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  MerchandiseProvider,
  useMerchandiseContext,
  Variant,
} from '../../context/MerchandiseContext';
import {
  useGetMerchandiseEditDetailsQuery,
  useUpdateMerchandiseMutation,
} from '../../../services/merchandiseService';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import MerchandiseSteps from '../steps/MerchandiseSteps';
import {buildInitialValues, mergeEditDetails} from './editMapper';
import {buildBasePayload, isSuccessResult} from '../shared/merchandisePayload';
import styles from '../shared/css/merchandiseUpload';

// "MerchandiseEdit": UPDATE an existing product (`item` = the list row).
const EditForm: React.FC<{item: any}> = ({item}) => {
  const {formData, resetFormData, setVariants} = useMerchandiseContext();
  const navigation: any = useNavigation();
  const [updateMerchandise, {isLoading}] = useUpdateMerchandiseMutation();
  const {variantFields, sizeChart} = useCategoryConfig();

  // Saved variants use field slugs (size, colour...); the wizard keys them by
  // attr_<id>, so map them once the category fields are loaded.
  const hydrated = useRef(false);
  useEffect(() => {
    if (hydrated.current || variantFields.length === 0) {
      return;
    }
    hydrated.current = true;
    setVariants(
      formData.variants.map((v: Variant) => {
        const attributes: Record<string, string> = {};
        // Saved rows may use another spelling (color/colour, age_group/age-group).
        const flat = (s: any) =>
          String(s ?? '')
            .toLowerCase()
            .replace(/colour/g, 'color')
            .replace(/[^a-z0-9]/g, '');
        let extra: any = v.raw?.variant_attributes;
        if (typeof extra === 'string') {
          try {
            extra = JSON.parse(extra);
          } catch {
            extra = null;
          }
        }
        const source: Record<string, any> = {
          ...(extra && typeof extra === 'object' ? extra : {}),
          ...(v.raw || {}),
        };
        const byKey: Record<string, any> = {};
        Object.keys(source).forEach(k => {
          if (source[k] != null && source[k] !== '') {
            byKey[flat(k)] = source[k];
          }
        });
        variantFields.forEach(f => {
          let val = byKey[flat(f.slug || f.key)] ?? byKey[flat(f.label)];
          if (val != null) {
            const hit = f.optionItems?.find(
              o => flat(o.value) === flat(val) || flat(o.label) === flat(val),
            );
            val = hit ? hit.value : val;
            attributes[f.key] = String(val);
          }
        });
        return {...v, attributes};
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantFields]);

  const onSubmit = async () => {
    const {payload: base, keptIds} = buildBasePayload(
      formData,
      variantFields,
      sizeChart,
    );
    // Saved images that were removed in the form are deleted on the server.
    const deleteImages = (Array.isArray(item.images) ? item.images : [])
      .map((im: any) => Number(im.id))
      .filter((id: number) => id && !keptIds.includes(id));

    const payload = {
      product_id: item.product_id ?? item.id,
      delete_images: deleteImages,
      ...base,
    };
    console.log('marchendise update payload', JSON.stringify(payload));

    try {
      const result: any = await updateMerchandise(payload).unwrap();
      console.log('marchendise update response', JSON.stringify(result));
      if (isSuccessResult(result)) {
        Toast.show({
          type: 'success',
          text1: 'Product Updated Successfully',
          text2: result?.message || 'Your merchandise has been updated.',
        });
        resetFormData();
        navigation.navigate('Merchandise');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to Update Product',
          text2: result?.message || 'Something went wrong.',
        });
      }
    } catch (error: any) {
      console.error('Merchandise update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to Update Product',
        text2: error?.data?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <MerchandiseSteps
      onSubmit={onSubmit}
      submitLabel="Update Product"
      firstTitle="Update Product"
      isLoading={isLoading}
    />
  );
};

const MerchandiseEdit: React.FC = () => {
  const route: any = useRoute();
  const item = route.params?.item;
  const productId = item ? item.product_id ?? item.id : undefined;

  // Load the product's full edit details (fields + saved values).
  // `currentData` is only ever the response for THIS product id. (`data` keeps
  // the previous product's response while the next one loads, which opened the
  // wrong product when this reused screen was opened for a second item.)
  const {currentData, isFetching} = useGetMerchandiseEditDetailsQuery(
    productId,
    {skip: !productId, refetchOnMountOrArgChange: true},
  );

  console.log('currec data', JSON.stringify(currentData));
  const details =
    currentData?.data &&
    String(currentData.data.product_id) === String(productId)
      ? currentData.data
      : undefined;

  if (!item || (isFetching && !details)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const merged = mergeEditDetails(item, details);
  // Remount (fresh wizard state) whenever another product is opened.
  const providerKey = `edit_${productId}_${item.updated_at}_${
    details ? 'full' : 'list'
  }`;
  return (
    <MerchandiseProvider
      key={providerKey}
      initialValues={buildInitialValues(merged)}>
      <EditForm item={merged} />
    </MerchandiseProvider>
  );
};

export default MerchandiseEdit;
