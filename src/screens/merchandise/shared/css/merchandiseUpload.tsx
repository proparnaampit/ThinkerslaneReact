import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

// Same primary color as the rest of the app (buttons, labels, active tab)
export const PRIMARY = '#223d79';
export const PRIMARY_LIGHT = '#e7ecf6';
export const BORDER = '#e5e7eb';

const merchandiseUploadStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Math.max(width * 0.04, 10),
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    marginBottom: 12,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  stepContainer: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default merchandiseUploadStyles;
