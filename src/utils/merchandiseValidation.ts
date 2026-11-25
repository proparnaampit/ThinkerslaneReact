import Toast from 'react-native-toast-message';
import {InfoField, VariantField} from '../screens/merchandise/shared/merchandiseOptions';

const showToast = (message: string) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: 'Validation Error',
    position: 'top',
  });
};

export const validateMerchandiseInfo = (
  info: any = {},
  subTypeRequired = true,
) => {
  if (!info.productName?.trim()) {
    showToast('Product Name is required');
    return false;
  }
  if (!info.productType) {
    showToast('Product Type is required');
    return false;
  }
  if (subTypeRequired && !info.subType) {
    showToast('Sub Type is required');
    return false;
  }
  if (!info.shortDescription?.trim()) {
    showToast('Short Description is required');
    return false;
  }
  return true;
};

export const validateMerchandisePricing = (info: any = {}) => {
  const price = parseFloat(info.price);
  if (isNaN(price) || price <= 0) {
    showToast('Price is required');
    return false;
  }
  const offered = parseFloat(info.offeredPrice);
  if (!isNaN(offered) && offered > 0 && offered >= price) {
    showToast('Offered price must be less than price');
    return false;
  }
  return true;
};

export const validateProductInfo = (
  fields: InfoField[],
  values: Record<string, string>,
) => {
  for (const field of fields) {
    // yes/no questions always have a value (default "no")
    if (field.required && field.type !== 'yesno' && !values[field.key]?.trim()) {
      showToast(`${field.label} is required`);
      return false;
    }
  }
  return true;
};

export const validateVariant = (variant: any, fields: VariantField[]) => {
  for (const field of fields) {
    if (field.required && !variant.attributes?.[field.key]?.trim()) {
      showToast(`${field.label} is required`);
      return false;
    }
  }
  if (!variant.price?.trim() || isNaN(parseFloat(variant.price))) {
    showToast('Price is required');
    return false;
  }
  if (!variant.stock?.trim() || isNaN(parseInt(variant.stock, 10))) {
    showToast('Stock Quantity is required');
    return false;
  }
  return true;
};

export const validateVariantList = (variants: any[]) => {
  if (!variants || variants.length === 0) {
    showToast('Add at least one variant');
    return false;
  }
  return true;
};
