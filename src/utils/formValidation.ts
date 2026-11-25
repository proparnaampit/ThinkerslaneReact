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
  if (step === 3) {
    const pricing = formData.pricing || {};
    if (!pricing.price?.trim()) {
      showToast('Original Price is required');
      return false;
    }
  }
  if (step === 4) {
    const product = formData.product || {};
    if (!product.quantity?.trim()) {
      showToast('quantity is required');
      return false;
    }

    if (!product.weight?.trim()) {
      showToast('weight is required');
      return false;
    }

    if (!product.width?.trim()) {
      showToast('width is required');
      return false;
    }

    if (!product.length?.trim()) {
      showToast('length is required');
      return false;
    }

    if (!product.height?.trim()) {
      showToast('height is required');
      return false;
    }

    if (!product.binding?.trim()) {
      showToast('binding is required');
      return false;
    }
  }
  return true;
};
