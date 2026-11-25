import React from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {MaterialCommunityIcon} from '../../../components/common/Icons';
import {useMerchandiseContext, Variant} from '../../context/MerchandiseContext';
import {getProductTypeName, getVariantTitle} from '../shared/merchandiseOptions';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import SizeChartTable from './SizeChartTable';
import styles from '../shared/css/merchandiseReview';
import uploadStyles from '../shared/css/merchandiseUpload';

interface Props {
  onSubmit: () => void;
  submitLabel?: string;
}

const MerchandiseReview: React.FC<Props> = ({
  onSubmit,
  submitLabel = 'Save Product',
}) => {
  const {formData, setVariantEditor, goToStep} = useMerchandiseContext();
  const info = formData.information || {};
  const variants: Variant[] = formData.variants || [];
  const {variantFields: fields, sizeChart} = useCategoryConfig();
  const coverImage = variants.find(v => v.images.length > 0)?.images[0];

  const onEdit = () => {
    // Variants live on step 2; closing any open editor shows the list.
    setVariantEditor(null);
    goToStep(4);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryImage}>
            {coverImage ? (
              <Image
                source={{uri: coverImage.base64}}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcon
                name="image-outline"
                size={40}
                color="#9ca3af"
              />
            )}
          </View>
          <View style={styles.summaryInfo}>
            <Text style={styles.productName}>{info.productName}</Text>
            <Text style={styles.description} numberOfLines={2}>
              {info.shortDescription || 'No description'}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Type</Text>
              <Text style={styles.metaValue}>
                {info.productTypeName || getProductTypeName(info.productType)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Sub Type</Text>
              <Text style={styles.metaValue}>{info.subType || '-'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Variants ({variants.length})</Text>
          <TouchableOpacity onPress={onEdit}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {variants.map(variant => (
          <View key={variant.id} style={styles.variantCard}>
            <View style={styles.variantThumb}>
              {variant.images[0] && (
                <Image
                  source={{uri: variant.images[0].base64}}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.variantInfo}>
              <Text style={styles.variantTitle}>
                {getVariantTitle(variant.attributes, fields)}
              </Text>
              <Text style={styles.variantPrice}>$ {variant.price}</Text>
            </View>
            <Text style={styles.stockText}>
              Stock: <Text style={styles.stockValue}>{variant.stock}</Text>
            </Text>
          </View>
        ))}

        {sizeChart ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Size Chart</Text>
            </View>
            <SizeChartTable chart={sizeChart} />
          </>
        ) : null}
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onSubmit}>
        <Text style={uploadStyles.primaryButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MerchandiseReview;
