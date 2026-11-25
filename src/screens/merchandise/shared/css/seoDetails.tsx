import {StyleSheet} from 'react-native';
import {BORDER} from './merchandiseUpload';

const seoDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  note: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
  },
  counter: {
    fontSize: 12,
    color: '#6b7280',
  },
  counterOver: {
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
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    marginTop: 22,
  },
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginTop: 18,
  },
  bottomSpace: {
    height: 8,
  },
});

export default seoDetailsStyles;
