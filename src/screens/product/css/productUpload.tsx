import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const productStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: Math.max(width * 0.04, 10),
    borderColor: '#e5e7eb',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flex: 1,
    paddingBottom: Math.max(height * 0.02, 12),
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '500',
    color: 'gray',
    textAlign: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    minWidth: Math.max(width * 0.35, 120),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  backButtonText: {
    color: '#374151',
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#223d79',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    minWidth: Math.max(width * 0.35, 120),
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    minWidth: Math.max(width * 0.35, 120),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Math.max(width * 0.04, 16),
    fontWeight: '600',
  },
});

export default productStyles;
