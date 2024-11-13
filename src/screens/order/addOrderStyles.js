import {StyleSheet} from 'react-native';
import commonstyles from '../../components/commonstyles';

const addOrderStyles = StyleSheet.create({
  header: {
    padding: 10,
    backgroundColor: 'white',
    zIndex: 10,
  },
  footerLoader: {
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  totalCart: {
    fontSize: 18,
    backgroundColor: 'green',
    color: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
  booksContainer: {
    flex: 1,
    // padding: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    padding: 6,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  counter: {
    fontSize: 18,
    padding: 15,
  },
  cartCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 8,
    backgroundColor: '#ffc107',
    borderRadius: 20,
    textAlign: 'center',
    minWidth: 30,
  },
  bookContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    fontSize: 16,
    color: '#ff4d4d',
    textAlign: 'center',
    marginTop: 20,
  },
  quantityBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  quantityText: {
    marginHorizontal: 4,
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default addOrderStyles;
