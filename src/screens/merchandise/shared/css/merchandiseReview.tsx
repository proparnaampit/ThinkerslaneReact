import {StyleSheet} from 'react-native';
import {BORDER, PRIMARY} from './merchandiseUpload';

const merchandiseReviewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  summaryImage: {
    width: 130,
    height: 130,
    borderRadius: 14,
    backgroundColor: '#f1f1f4',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  metaKey: {
    width: 80,
    fontSize: 13,
    color: '#6b7280',
  },
  metaValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#111',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  editText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 14,
  },
  variantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  variantThumb: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f1f1f4',
    overflow: 'hidden',
  },
  variantInfo: {
    flex: 1,
    marginLeft: 14,
  },
  variantTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  variantPrice: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
  },
  stockText: {
    fontSize: 13,
    color: '#4b5563',
  },
  stockValue: {
    fontWeight: '700',
    color: '#111',
  },
});

export default merchandiseReviewStyles;
