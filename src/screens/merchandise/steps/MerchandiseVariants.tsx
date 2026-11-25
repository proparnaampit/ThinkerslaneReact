import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {FeatherIcon, MaterialCommunityIcon} from '../../../components/common/Icons';
import {useMerchandiseContext, Variant} from '../../context/MerchandiseContext';
import AddVariant from './AddVariant';
import {getVariantTitle} from '../shared/merchandiseOptions';
import {useCategoryConfig} from '../shared/useCategoryConfig';
import SizeChartTable from './SizeChartTable';
import {validateVariantList} from '../../../utils/merchandiseValidation';
import styles from '../shared/css/merchandiseVariants';
import uploadStyles, {PRIMARY} from '../shared/css/merchandiseUpload';

const MerchandiseVariants: React.FC = () => {
  const {
    formData,
    nextStep,
    variantEditor,
    setVariantEditor,
    removeVariant,
    setSizeChartRows,
  } = useMerchandiseContext();
  const variants: Variant[] = formData.variants || [];
  const {
    variantFields: fields,
    sizeChart,
    sizeChartDefaultCount,
  } = useCategoryConfig();
  const [showChart, setShowChart] = useState(false);

  if (variantEditor) {
    return <AddVariant />;
  }

  const onMenu = (variant: Variant) => {
    Alert.alert(getVariantTitle(variant.attributes, fields), undefined, [
      {text: 'Edit', onPress: () => setVariantEditor(variant.id)},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeVariant(variant.id),
      },
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const onNext = () => {
    if (validateVariantList(variants)) {
      nextStep();
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Add different variants for your product
        </Text>
        <Text style={styles.subtitleMuted}>
          {formData.information?.subType} - e.g.{' '}
          {fields
            .filter(f => f.inTitle)
            .map(f => f.label.toLowerCase())
            .join(', ') || 'colors'}
        </Text>

        {sizeChart ? (
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 8}}
            onPress={() => setShowChart(true)}>
            <MaterialCommunityIcon name="ruler" size={20} color={PRIMARY} />
            <Text style={{color: PRIMARY, marginLeft: 6, fontWeight: '600'}}>
              View size chart
            </Text>
          </TouchableOpacity>
        ) : null}

        {variants.length === 0 && (
          <Text style={styles.emptyText}>No variants added yet</Text>
        )}

        {variants.map(variant => (
          <TouchableOpacity
            key={variant.id}
            activeOpacity={0.8}
            style={styles.card}
            onPress={() => setVariantEditor(variant.id)}>
            <View style={styles.thumb}>
              {variant.images[0] ? (
                <Image
                  source={{uri: variant.images[0].base64}}
                  style={styles.thumbImage}
                  resizeMode="cover"
                />
              ) : (
                <MaterialCommunityIcon
                  name="tshirt-crew-outline"
                  size={30}
                  color="#9ca3af"
                />
              )}
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>
                {getVariantTitle(variant.attributes, fields)}
              </Text>
              <Text style={styles.cardPrice}>$ {variant.price}</Text>
            </View>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => onMenu(variant)}>
              <MaterialCommunityIcon
                name="dots-vertical"
                size={22}
                color="#111"
              />
            </TouchableOpacity>
            <FeatherIcon name="chevron-right" size={22} color="#111" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setVariantEditor('new')}>
          <MaterialCommunityIcon
            name="plus-circle"
            size={22}
            color={PRIMARY}
          />
          <Text style={styles.addButtonText}>Add Variant</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onNext}>
        <Text style={uploadStyles.primaryButtonText}>Next</Text>
      </TouchableOpacity>

      <Modal
        visible={showChart}
        transparent
        animationType="slide"
        onRequestClose={() => setShowChart(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}>
          <View
            style={{
              margin: 20,
              padding: 16,
              borderRadius: 8,
              backgroundColor: '#fff',
              maxHeight: '80%',
            }}>
            <Text style={{fontSize: 16, fontWeight: '700', marginBottom: 12}}>
              Size Chart
            </Text>
            <ScrollView keyboardShouldPersistTaps="handled">
              {sizeChart ? (
                <SizeChartTable
                  chart={sizeChart}
                  onChangeRows={setSizeChartRows}
                  lockedCount={sizeChartDefaultCount}
                />
              ) : null}
            </ScrollView>
            <TouchableOpacity
              style={uploadStyles.primaryButton}
              onPress={() => setShowChart(false)}>
              <Text style={uploadStyles.primaryButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MerchandiseVariants;
