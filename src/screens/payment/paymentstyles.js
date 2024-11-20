import {StyleSheet, Dimensions} from 'react-native';

const paymentstyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  pricingContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  pricingText: {
    fontSize: 16,
    marginBottom: 5,
  },
  grandTotalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
  successText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold',
  },
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default paymentstyles;
