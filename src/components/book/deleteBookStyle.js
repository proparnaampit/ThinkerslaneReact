import {StyleSheet} from 'react-native';

const singleBookStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 8,
    elevation: 2,
  },
  image: {
    width: 70,
    height: 90,
    borderRadius: 6,
    alignSelf: 'center',
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 0,
    marginLeft: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#3b4c68',
    marginBottom: 4,
  },
  publisher: {
    fontSize: 12,
    color: '#3b4c68',
    marginBottom: 4,
  },
  price: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  priceText: {
    color: '#d32f2f',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stock: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
    marginBottom: 4,
  },
  isbn: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  isbnBold: {
    fontSize: 13,
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#444',
    lineHeight: 20,
  },
  stockLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  deleteButtonDetails: {
    backgroundColor: 'red',
    padding: 8,
    marginTop: 20,
    borderRadius: 5,
    width: '70%',
    justifyContent: 'space-between',
    margin: 'auto',
    alignItems: 'center',
    marginRight: 80,
  },
});

export default singleBookStyles;
