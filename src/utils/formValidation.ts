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
    if (!info.isbnNumber?.trim()) {
      showToast('ISBN Number is required');
      return false;
    }
    if (!info.shortDescription?.trim()) {
      showToast('Short Description is required');
      return false;
    }
    if (!info.longDescription?.trim()) {
      showToast('Long Description is required');
      return false;
    }
    if (!info.resourceType?.trim()) {
      showToast('Resource Type is required');
      return false;
    }
    if (!info.language?.trim()) {
      showToast('Language is required');
      return false;
    }
    if (!info.publisher?.trim()) {
      showToast('Publisher is required');
      return false;
    }
    if (!info.status?.trim()) {
      showToast('Status is required');
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

  return true;
};
