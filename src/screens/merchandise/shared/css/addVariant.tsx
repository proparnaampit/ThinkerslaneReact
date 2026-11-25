import {StyleSheet} from 'react-native';
import {BORDER, PRIMARY} from './merchandiseUpload';

const addVariantStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainImageWrapper: {
    height: 220,
    borderRadius: 16,
    backgroundColor: '#f1f1f4',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  removeMainButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(55,55,60,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: '#f6f6f8',
    marginRight: 10,
    overflow: 'hidden',
  },
  thumbActive: {
    borderColor: PRIMARY,
    borderWidth: 2,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  addImageBox: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#9ca3af',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 10,
    color: '#374151',
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginTop: 14,
    marginBottom: 6,
  },
  required: {
    color: '#c1121f',
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fafafa',
  },
  currency: {
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 14,
  },
});

export default addVariantStyles;
