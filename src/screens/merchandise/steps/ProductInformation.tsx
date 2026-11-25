import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import CustomPicker from '../../../components/common/CustomPicker';
import {validateProductInfo} from '../../../utils/merchandiseValidation';
import type {InfoField} from '../shared/merchandiseOptions';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import styles from '../shared/css/productInformation';
import uploadStyles from '../shared/css/merchandiseUpload';

const ProductInformation: React.FC = () => {
  const {formData, updateProductInfo, nextStep} = useMerchandiseContext();
  console.log('odhoi', JSON.stringify(formData));
  const {subType} = formData.information || {};
  const {
    infoFields: fields,
    isFetching,
    isError,
    refetch,
  } = useCategoryConfig();

  const values: Record<string, string> = formData.productInfo || {};

  // Map saved values (edit mode) onto the field keys, then default Yes/No to "no".
  // Saved attributes may use another key style (age_group vs age-group, label
  // instead of slug) or another value style (1/0, option label), so normalise.
  useEffect(() => {
    const norm = (s: any) =>
      String(s ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
    const raw: Record<string, any> = {};
    const src: any = formData.productInfo;
    if (Array.isArray(src)) {
      src.forEach((a: any) => {
        const k = a?.slug ?? a?.key ?? a?.name ?? a?.label;
        if (k != null) {
          raw[norm(k)] = a?.value ?? a?.attribute_value;
        }
      });
    } else if (src && typeof src === 'object') {
      Object.keys(src).forEach(k => {
        raw[norm(k)] = src[k];
      });
    }

    const updates: Record<string, string> = {};
    fields.forEach(f => {
      let v = raw[norm(f.key)] ?? raw[norm(f.label)];
      if (v === undefined || v === null || v === '') {
        if (f.type === 'yesno' && values[f.key] === undefined) {
          updates[f.key] = 'no';
        }
        return;
      }
      if (f.type === 'yesno') {
        const s = String(v).toLowerCase();
        v = ['yes', '1', 'true', 'y'].includes(s) ? 'yes' : 'no';
      } else if (f.type === 'select' && f.optionItems) {
        const s = norm(v);
        const hit = f.optionItems.find(
          o => norm(o.value) === s || norm(o.label) === s,
        );
        v = hit ? hit.value : String(v);
      } else {
        v = String(v);
      }
      if (values[f.key] !== v) {
        updates[f.key] = v;
      }
    });
    if (Object.keys(updates).length) {
      updateProductInfo(updates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  // Yes/No questions default to "no" (matches the form design).
  const valueOf = (field: InfoField) =>
    values[field.key] ?? (field.type === 'yesno' ? 'no' : '');

  const onNext = () => {
    if (validateProductInfo(fields, values)) {
      nextStep();
    }
  };

  const renderLabel = (field: InfoField) => (
    <Text style={styles.label}>
      {field.label}
      {field.required ? <Text style={styles.required}> *</Text> : null}
    </Text>
  );

  const renderField = (field: InfoField, index: number) => {
    const value = valueOf(field);

    switch (field.type) {
      case 'select':
        return (
          <CustomPicker
            key={field.key}
            label={field.label}
            selectedValue={value}
            onValueChange={(v: any) =>
              updateProductInfo({[field.key]: v || ''})
            }
            data={
              field.optionItems
                ? field.optionItems.map(o => ({id: o.value, name: o.label}))
                : (field.options || []).map(o => ({id: o, name: o}))
            }
            labelKey="name"
            placeholder={`Select ${field.label.toLowerCase()}`}
          />
        );
      case 'yesno':
        return (
          <View key={field.key}>
            {/* A divider before the first yes/no question, like the form design */}
            {fields[index - 1]?.type !== 'yesno' && (
              <View style={styles.divider} />
            )}
            {renderLabel(field)}
            <View style={styles.radioRow}>
              {['yes', 'no'].map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioOption}
                  onPress={() => updateProductInfo({[field.key]: option})}>
                  <View
                    style={[
                      styles.radioCircle,
                      value === option && styles.radioCircleActive,
                    ]}>
                    {value === option && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.radioText}>
                    {option === 'yes' ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return (
          <View key={field.key}>
            {renderLabel(field)}
            <TextInput
              style={[
                styles.input,
                field.type === 'textarea' && styles.textArea,
              ]}
              placeholder={field.placeholder}
              placeholderTextColor="#9ca3af"
              multiline={field.type === 'textarea'}
              value={value}
              onChangeText={text => updateProductInfo({[field.key]: text})}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>
          Details for {subType || 'this product'}
        </Text>
        {isFetching ? (
          <ActivityIndicator style={{marginTop: 24}} />
        ) : isError ? (
          <TouchableOpacity onPress={refetch}>
            <Text style={styles.subtitle}>
              Could not load fields. Tap to retry.
            </Text>
          </TouchableOpacity>
        ) : fields.length === 0 ? (
          <Text style={styles.subtitle}>
            No extra details needed for this category.
          </Text>
        ) : (
          fields.map(renderField)
        )}
        <View style={styles.bottomSpace} />
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onNext}>
        <Text style={uploadStyles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProductInformation;
