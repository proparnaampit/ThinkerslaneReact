import {StyleSheet, Dimensions} from 'react-native';

const checkoutStyles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 15,
    elevation: 2, // for slight shadow on Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputAddress: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  paymentButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  paymentButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cashButton: {
    backgroundColor: '#28a745', // green for cash payment
  },
  phonePeButton: {
    backgroundColor: '#007bff', // blue for PhonePe payment
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#007bff', // primary color for proceed button
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  proceedButtonIcon: {
    marginRight: 10,
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default checkoutStyles;
