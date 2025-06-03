import Toast from 'react-native-toast-message';

const showToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: 'Validation Error',
    position: 'top',
  });
};

export const validateStep = (step: number, formData: any) => {
  if (step === 1) {
    const info = formData.information || {};
    if (!info.productName?.trim()) {
      showToast('Product Name is required');
      return false;
    }
    if (!info.shortDescription?.trim()) {
      showToast('Short Description is required');
      return false;
    }
    if (!info.resourceType?.trim()) {
      showToast('Resource Type is required');
      return false;
    }
    if (!info.publisher?.trim()) {
      showToast('Publisher is required');
      return false;
    }
    if (!info.category?.trim()) {
      showToast('Category is required');
      return false;
    }
    if (!info.authorName?.trim()) {
      showToast('Author Name is required');
      return false;
    }
  }
  if (step === 2) {
    const pricing = formData.pricing || {};
    if (!pricing.price?.trim()) {
      showToast('Original Price is required');
      return false;
    }
    if (!pricing.offered_price?.trim()) {
      showToast('Offered Price is required');
      return false;
    }
    const price = parseFloat(pricing.price);
    const offeredPrice = parseFloat(pricing.offered_price);
    if (isNaN(price) || price <= 0) {
      showToast('Original Price must be a valid positive number');
      return false;
    }
    if (isNaN(offeredPrice) || offeredPrice <= 0) {
      showToast('Offered Price must be a valid positive number');
      return false;
    }
    if (offeredPrice > price) {
      showToast('Offered Price cannot be greater than Original Price');
      return false;
    }
  }
  if (step === 3) {
    const product = formData.product || {};
    if (!product.quantity?.trim()) {
      showToast('quantity is required');
      return false;
    }
  }
  return true;
};
