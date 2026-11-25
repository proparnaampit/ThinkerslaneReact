import React, {useEffect} from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import CustomPicker from '../../../components/common/CustomPicker';
import {validateMerchandiseInfo} from '../../../utils/merchandiseValidation';
import {useGetAllMerchantCategoryQuery} from '../../../services/merchandiseService';
import {DESCRIPTION_MAX} from '../shared/merchandiseOptions';
import styles from '../shared/css/merchandiseInformation';
import uploadStyles from '../shared/css/merchandiseUpload';

const Label = ({text, required}: {text: string; required?: boolean}) => (
  <Text style={styles.label}>
    {text}
    {required ? <Text style={styles.required}> *</Text> : null}
  </Text>
);

const MerchandiseInformation: React.FC = () => {
  const {
    formData,
    updateInformation,
    clearVariants,
    clearProductInfo,
    nextStep,
  } = useMerchandiseContext();
  const info = formData.information || {};
  const hasVariants = formData.variants.length > 0;

  const {data: categoryData} = useGetAllMerchantCategoryQuery({});

  console.log(categoryData);

  const categoryList: any[] = Array.isArray(categoryData)
    ? categoryData
    : categoryData?.data || [];
  // Only active categories are selectable.
  const productTypeData = categoryList.filter(c => c.is_active === '1');
  const selectedCategory = productTypeData.find(c => c.id === info.productType);
  const subTypeData = (selectedCategory?.subcategories || []).filter(
    (s: any) => s.is_active === '1',
  );

  // Edit mode: the saved product may only carry the subcategory name (or an id
  // in a different shape), so resolve it against the loaded category tree.
  useEffect(() => {
    if (!info.productType || subTypeData.length === 0) {
      return;
    }
    const match = info.subTypeId
      ? subTypeData.find((s: any) => String(s.id) === String(info.subTypeId))
      : subTypeData.find(
          (s: any) =>
            info.subType &&
            String(s.name).trim().toLowerCase() ===
              String(info.subType).trim().toLowerCase(),
        );
    if (match && String(match.id) !== String(info.subTypeId)) {
      updateInformation({subTypeId: String(match.id), subType: match.name});
    } else if (!match && !info.subTypeId && info.subType) {
      // A saved name that is not one of this category's subcategories.
      updateInformation({subType: ''});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info.productType, info.subTypeId, info.subType, subTypeData.length]);

  const applyProductType = (value: any) => {
    const cat = productTypeData.find(c => c.id === value);
    updateInformation({
      productType: value || '',
      productTypeName: cat?.name || '',
      subType: '',
      subTypeId: '',
    });
    clearVariants();
    clearProductInfo();
  };

  const onProductTypeChange = (value: any) => {
    if (value === info.productType) {
      return;
    }
    if (hasVariants) {
      // Variant fields depend on the product type, so they must be re-entered.
      Alert.alert(
        'Change product type?',
        'Information and variants you added use fields of the current type and will be removed.',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Change',
            style: 'destructive',
            onPress: () => applyProductType(value),
          },
        ],
      );
      return;
    }
    applyProductType(value);
  };

  const onSubTypeChange = (value: any) => {
    if (value === info.subTypeId) {
      return;
    }
    const sub = subTypeData.find((s: any) => s.id === value);
    updateInformation({subType: sub?.name || '', subTypeId: value || ''});
    // Sub types can change the information/variant fields (e.g. Belts vs Caps).
    clearVariants();
    clearProductInfo();
  };

  const onNext = () => {
    if (validateMerchandiseInfo(info, subTypeData.length > 0)) {
      nextStep();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Label text="Name" required />
        <TextInput
          style={styles.input}
          placeholder="e.g. Men's T-Shirt"
          placeholderTextColor="#9ca3af"
          value={info.productName || ''}
          onChangeText={text => updateInformation({productName: text})}
        />

        <CustomPicker
          label="Product Type *"
          selectedValue={info.productType || ''}
          onValueChange={onProductTypeChange}
          data={productTypeData}
          labelKey="name"
          placeholder="Select product type"
        />

        {info.productType && subTypeData.length > 0 ? (
          <CustomPicker
            // remount so the filtered list follows the selected type
            key={info.productType}
            label="Sub Type *"
            valueKey="id"
            selectedValue={info.subTypeId || ''}
            onValueChange={onSubTypeChange}
            data={subTypeData}
            labelKey="name"
            placeholder="Select sub type"
          />
        ) : null}

        <Label text="Short Description" required />
        <TextInput
          style={[styles.input, styles.textAreaShort]}
          placeholder="One or two lines about the product"
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={150}
          value={info.shortDescription || ''}
          onChangeText={text => updateInformation({shortDescription: text})}
        />
        <Text style={styles.counter}>
          {(info.shortDescription || '').length}/150
        </Text>

        <Label text="Long Description" />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Write a detailed description..."
          placeholderTextColor="#9ca3af"
          multiline
          maxLength={DESCRIPTION_MAX}
          value={info.longDescription || ''}
          onChangeText={text => updateInformation({longDescription: text})}
        />
        <Text style={styles.counter}>
          {(info.longDescription || '').length}/{DESCRIPTION_MAX}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 16,
          }}>
          <Text style={styles.label}>
            Status: {info.isActive === false ? 'Inactive' : 'Active'}
          </Text>
          <Switch
            value={info.isActive !== false}
            onValueChange={v => updateInformation({isActive: v})}
          />
        </View>
        <View style={styles.bottomSpace} />
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onNext}>
        <Text style={uploadStyles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MerchandiseInformation;
