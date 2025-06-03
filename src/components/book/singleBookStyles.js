import {StyleSheet} from 'react-native';

const singleBookStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomColor: 'black',
    marginVertical: 5,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 220,
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
    flexWrap: 'wrap',
    width: '90%',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '90%',
    color: '#223d79',
  },
  publisher: {
    fontSize: 16,
    flexWrap: 'wrap',
    width: '90%',
    color: '#223d79',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    color: '#223d79',
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
    color: '#223d79',
    fontWeight: 'bold',
  },
  isbn: {
    fontSize: 12,
    color: '#223d79',
  },
  stockLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 14,
  },
});

export default singleBookStyles;
