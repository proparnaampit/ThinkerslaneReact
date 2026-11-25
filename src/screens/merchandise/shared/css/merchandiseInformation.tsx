import {StyleSheet} from 'react-native';
import {BORDER} from './merchandiseUpload';

const merchandiseInformationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  textAreaShort: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  counter: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
  bottomSpace: {
    height: 8,
  },
});

export default merchandiseInformationStyles;
