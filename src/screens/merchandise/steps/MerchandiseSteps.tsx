import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {FeatherIcon} from '../../../components/common/Icons';
import {useMerchandiseContext} from '../../context/MerchandiseContext';
import MerchandiseInformation from './MerchandiseInformation';
import MerchandisePricing from './MerchandisePricing';
import ProductInformation from './ProductInformation';
import MerchandiseVariants from './MerchandiseVariants';
import SeoDetails from './SeoDetails';
import MerchandiseReview from './MerchandiseReview';
import styles from '../shared/css/merchandiseUpload';

const STEP_TITLES = [
  'Add Product',
  'Pricing',
  'Product Information',
  'Product Variants',
  'SEO Details',
  'Review Product',
];

interface Props {
  onSubmit: () => void;
  submitLabel: string;
  isLoading: boolean;
  /** Header of step 1 ("Add Product" / "Update Product"). */
  firstTitle?: string;
}

/** The six wizard steps with their header, shared by "add" and "update". */
const MerchandiseSteps: React.FC<Props> = ({
  onSubmit,
  submitLabel,
  isLoading,
  firstTitle,
}) => {
  const {currentStep, previousStep, variantEditor} = useMerchandiseContext();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // The variant form draws its own header (back goes to the variant list).
  const showHeader = !(currentStep === 4 && variantEditor);

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.headerRow}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={previousStep}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <FeatherIcon name="chevron-left" size={24} color="#111" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {currentStep === 1
              ? firstTitle || STEP_TITLES[0]
              : STEP_TITLES[currentStep - 1]}
          </Text>
        </View>
      )}

      <View style={styles.stepContainer}>
        {currentStep === 1 && <MerchandiseInformation />}
        {currentStep === 2 && <MerchandisePricing />}
        {currentStep === 3 && <ProductInformation />}
        {currentStep === 4 && <MerchandiseVariants />}
        {currentStep === 5 && <SeoDetails />}
        {currentStep === 6 && (
          <MerchandiseReview onSubmit={onSubmit} submitLabel={submitLabel} />
        )}
      </View>
    </View>
  );
};

export default MerchandiseSteps;
