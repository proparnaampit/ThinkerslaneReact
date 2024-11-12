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
    elevation: 3,
    marginVertical: 5,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
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
    width: '70%',
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
    color: '#666',
    marginTop: 4,
  },
  stockLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default singleBookStyles;
