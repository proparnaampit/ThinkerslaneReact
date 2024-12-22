import {StyleSheet, Dimensions} from 'react-native';
import commonstyles from '../../components/commonstyles';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: commonstyles.thinkerslane.color,
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  filterText: {
    marginLeft: 10,
    fontSize: 14,
    color: commonstyles.thinkerslane.color,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ffcccc',
    borderRadius: 5,
  },
  resetText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6200ea',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#6200ea',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderDetails: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  uniqueCode: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
  orderAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  productHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },
  productCard: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  productQuantity: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
  },
  productPrice: {
    fontSize: 13,
    color: '#555',
    marginLeft: 5,
  },
  calendarContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  markingStyle: {
    borderRadius: 5, // Smooth edges for marked dates
    color: '#6200ea',
    textColor: 'white',
  },
  dayTextStyle: {
    fontSize: 14,
    color: '#000',
  },
  todayTextStyle: {
    fontWeight: 'bold',
    color: '#6200ea',
  },
});

export default styles;
