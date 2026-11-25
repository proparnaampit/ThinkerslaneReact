import {StyleSheet} from 'react-native';
import {BORDER, PRIMARY, PRIMARY_LIGHT} from './merchandiseUpload';

const merchandiseVariantsStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    color: '#222',
  },
  subtitleMuted: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#f1f1f4',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  cardPrice: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 4,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 4,
  },
  addButtonText: {
    color: PRIMARY,
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginVertical: 20,
  },
});

export default merchandiseVariantsStyles;
