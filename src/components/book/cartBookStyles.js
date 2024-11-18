import {StyleSheet} from 'react-native';

const cartBookStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomColor: 'black',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '100%',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    color: 'red',
    fontWeight: 'bold',
    flexDirection: 'row',
  },
  priceText: {
    color: 'red',
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
  },
  stock: {
    fontSize: 14,
    color: 'green',
    marginTop: 4,
    fontWeight: 'bold',
  },
  stockLabel: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 30,
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  totalPriceContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
});

export default cartBookStyles;
