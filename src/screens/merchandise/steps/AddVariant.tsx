import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ImagePicker, {
  Image as PickedImage,
} from 'react-native-image-crop-picker';
import {FeatherIcon, MaterialCommunityIcon} from '../../../components/common/Icons';
import {useMerchandiseContext, Variant} from '../../context/MerchandiseContext';
import CustomPicker from '../../../components/common/CustomPicker';
import {validateVariant} from '../../../utils/merchandiseValidation';
import type {VariantField} from '../shared/merchandiseOptions';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import styles from '../shared/css/addVariant';
import uploadStyles, {PRIMARY} from '../shared/css/merchandiseUpload';

const generateId = () =>
  `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const AddVariant: React.FC = () => {
  const {formData, variantEditor, setVariantEditor, saveVariant} =
    useMerchandiseContext();

  const {variantFields: fields} = useCategoryConfig();

  const existing: Variant | undefined = formData.variants.find(
    (v: Variant) => v.id === variantEditor,
  );

  const [variant, setVariant] = useState<Variant>(
    existing || {
      id: generateId(),
      attributes: {},
      sku: '',
      price: '',
      stock: '',
      images: [],
    },
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const patch = (data: Partial<Variant>) =>
    setVariant(prev => ({...prev, ...data}));

  const setAttribute = (key: string, value: string) =>
    setVariant(prev => ({
      ...prev,
      attributes: {...prev.attributes, [key]: value},
    }));

  const addImages = async () => {
    try {
      const results: PickedImage[] = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        includeBase64: true,
        cropping: false,
        compressImageQuality: 0.8,
        maxFiles: 10,
      });
      const newImages = results.map((result, index) => ({
        id: generateId(),
        name: result.filename ?? `variant_${Date.now()}_${index}.jpg`,
        mimeType: result.mime ?? 'image/jpeg',
        base64: `data:${result.mime};base64,${result.data}`,
      }));
      setVariant(prev => ({...prev, images: [...prev.images, ...newImages]}));
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.error('Error picking variant images:', err);
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  };

  const takePhoto = async () => {
    try {
      const result: PickedImage = await ImagePicker.openCamera({
        mediaType: 'photo',
        includeBase64: true,
        cropping: true,
        freeStyleCropEnabled: true,
        cropperToolbarTitle: 'Crop Photo',
        compressImageQuality: 0.8,
      });
      const newImage = {
        id: generateId(),
        name: result.filename ?? `variant_${Date.now()}.jpg`,
        mimeType: result.mime ?? 'image/jpeg',
        base64: `data:${result.mime};base64,${result.data}`,
      };
      setVariant(prev => ({...prev, images: [...prev.images, newImage]}));
      setActiveIndex(variant.images.length);
    } catch (err: any) {
      if (err?.message !== 'User cancelled image selection') {
        console.error('Error taking variant photo:', err);
        Alert.alert(
          'Error',
          'Failed to open camera. Please check camera permission and try again.',
        );
      }
    }
  };

  const chooseImageSource = () => {
    Alert.alert('Add Image', 'Choose an image source', [
      {text: 'Use Camera', onPress: takePhoto},
      {text: 'Choose from Gallery', onPress: addImages},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const removeActiveImage = () => {
    setVariant(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== activeIndex),
    }));
    setActiveIndex(0);
  };

  const onSave = () => {
    if (!validateVariant(variant, fields)) {
      return;
    }
    saveVariant(variant);
    setVariantEditor(null);
  };

  const mainImage = variant.images[activeIndex];

  const renderField = (field: VariantField) => {
    const label = field.required ? `${field.label} *` : field.label;
    const value = variant.attributes[field.key] || '';

    if (field.type === 'select') {
      return (
        <CustomPicker
          key={field.key}
          label={label}
          selectedValue={value}
          onValueChange={(v: any) => setAttribute(field.key, v || '')}
          data={
            field.optionItems
              ? field.optionItems.map(o => ({id: o.value, name: o.label}))
              : (field.options || []).map(o => ({id: o, name: o}))
          }
          labelKey="name"
          placeholder={`Select ${field.label.toLowerCase()}`}
        />
      );
    }

    return (
      <View key={field.key}>
        <Text style={styles.label}>
          {field.label}
          {field.required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        <TextInput
          style={styles.input}
          placeholder={field.placeholder}
          placeholderTextColor="#9ca3af"
          keyboardType={field.type === 'number' ? 'decimal-pad' : 'default'}
          value={value}
          onChangeText={text =>
            setAttribute(
              field.key,
              field.type === 'number' ? text.replace(/[^0-9.]/g, '') : text,
            )
          }
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
        <TouchableOpacity
          onPress={() => setVariantEditor(null)}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <FeatherIcon name="chevron-left" size={24} color="#111" />
        </TouchableOpacity>
        <Text
          style={[
            uploadStyles.headerTitle,
            {flex: 1, textAlign: 'center', marginRight: 24},
          ]}>
          {existing ? 'Edit Variant' : 'Add Variant'}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.mainImageWrapper}>
          {mainImage ? (
            <>
              <Image
                source={{uri: mainImage.base64}}
                style={styles.mainImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.removeMainButton}
                onPress={removeActiveImage}>
                <FeatherIcon name="x" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={chooseImageSource}
              style={{alignItems: 'center'}}>
              <MaterialCommunityIcon
                name="image-plus"
                size={40}
                color="#9ca3af"
              />
              <Text style={styles.addImageText}>Tap to add images</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbRow}>
          {variant.images.map((img, index) => (
            <TouchableOpacity
              key={img.id}
              onPress={() => setActiveIndex(index)}
              style={[styles.thumb, index === activeIndex && styles.thumbActive]}>
              <Image
                source={{uri: img.base64}}
                style={styles.thumbImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.addImageBox}
            onPress={chooseImageSource}>
            <FeatherIcon name="plus" size={20} color={PRIMARY} />
            <Text style={styles.addImageText}>Add Image</Text>
          </TouchableOpacity>
        </ScrollView>

        {fields.map(renderField)}

        <Text style={styles.label}>SKU (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. TS-BLK-M"
          placeholderTextColor="#9ca3af"
          autoCapitalize="characters"
          value={variant.sku}
          onChangeText={text => patch({sku: text})}
        />

        <Text style={styles.label}>
          Price <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>$</Text>
          <TextInput
            style={styles.priceInput}
            placeholder="0.00"
            placeholderTextColor="#9ca3af"
            keyboardType="decimal-pad"
            value={variant.price}
            onChangeText={text => patch({price: text.replace(/[^0-9.]/g, '')})}
          />
        </View>

        <Text style={styles.label}>
          Stock Quantity <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          value={variant.stock}
          onChangeText={text => patch({stock: text.replace(/[^0-9]/g, '')})}
        />
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onSave}>
        <Text style={uploadStyles.primaryButtonText}>Save Variant</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddVariant;
