import {StyleSheet} from 'react-native';
import commonstyles from '../../components/commonstyles';
const cartStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 40,
  },
  bookItem: {
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalContainer: {
    flex: 1, // Ensures the modal takes up the full screen height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adds a semi-transparent background
  },
  modalContent: {
    width: '90%', // Adjust width if needed
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrImage: {
    width: '100%',
    height: '90%',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearCartButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#d9534f',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  clearCartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  bookPrice: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  bookQuantity: {
    fontSize: 14,
    color: '#888',
  },
  totalContainers: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  totaltext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: commonstyles.thinkerslane.color,
    borderRadius: 5,
  },
  proceedButtonIcon: {
    marginRight: 10,
  },
  proceedButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyCartText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default cartStyles;
