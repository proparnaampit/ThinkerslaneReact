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
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '90%',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    width: '90%',
    color: 'grey',
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default singleBookStyles;
