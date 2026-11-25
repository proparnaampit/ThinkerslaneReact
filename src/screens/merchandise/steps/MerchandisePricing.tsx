import React from 'react';
import {View, Text, TextInput, TouchableOpacity} from 'react-native';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import {validateMerchandisePricing} from '../../../utils/merchandiseValidation';
import styles from '../shared/css/merchandiseInformation';
import uploadStyles from '../shared/css/merchandiseUpload';

const numeric = (text: string) => text.replace(/[^0-9.]/g, '');

const MerchandisePricing: React.FC = () => {
  const {formData, updateInformation, nextStep} = useMerchandiseContext();
  const info = formData.information || {};

  const onNext = () => {
    if (validateMerchandisePricing(info)) {
      nextStep();
    }
  };

  return (
    <View style={styles.container}>
      <View style={{flex: 1}}>
        <Text style={styles.label}>
          Price<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 750"
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
          value={info.price || ''}
          onChangeText={t => updateInformation({price: numeric(t)})}
        />

        <Text style={styles.label}>Offered Price</Text>
        <TextInput
          style={styles.input}
          placeholder="0 = no offer"
          placeholderTextColor="#9ca3af"
          keyboardType="decimal-pad"
          value={info.offeredPrice || ''}
          onChangeText={t => updateInformation({offeredPrice: numeric(t)})}
        />
      </View>

      <TouchableOpacity style={uploadStyles.primaryButton} onPress={onNext}>
        <Text style={uploadStyles.primaryButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MerchandisePricing;
