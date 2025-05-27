import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useGetOrderHistoryQuery} from '../../services/orderService';
import {Calendar} from 'react-native-calendars';
import commonstyles from '../../components/commonstyles';
import styles from './orderHistStyles';

const getIntermediateDates = (start: any, end: any) => {
  if (!start || !end) return {};
  const startDate = new Date(start);
  const endDate = new Date(end);
  const dates: any = {};

  while (startDate < endDate) {
    startDate.setDate(startDate.getDate() + 1);
    dates[startDate.toISOString().split('T')[0]] = {
      color: '#c7a4ff',
      textColor: 'white',
    };
  }
  return dates;
};

const OrderHistory = () => {
  const navigation = useNavigation<any>();
  const user_id = useSelector((state: any) => state?.auth?.userId);
  const {data, error, isLoading} = useGetOrderHistoryQuery({user_id: user_id});

  const currentDate = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState<any>({});
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const sortedOrders = [...(data?.data || [])].sort(
    (a: any, b: any) => b.booking_details.id - a.booking_details.id,
  );

  const handleOrderPress = (orderId: number) => {
    navigation.navigate('Bill', {details: {order_id: orderId}});
  };

  const handleDateSelect = (day: any) => {
    if (!dateRange.startDate) {
      setDateRange({startDate: day.dateString, endDate: null});
    } else if (!dateRange.endDate) {
      if (day.dateString < dateRange.startDate) {
        setDateRange({startDate: day.dateString, endDate: dateRange.startDate});
      } else {
        setDateRange({...dateRange, endDate: day.dateString});
      }
    } else {
      setDateRange({startDate: day.dateString, endDate: null});
    }
  };

  const handleReset = () => {
    setDateRange({});
  };

  const handleDateFilter = (orders: any) => {
    if (!dateRange.startDate || !dateRange.endDate) return orders;
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    return orders.filter((order: any) => {
      const orderDate = new Date(order.booking_details.order_date_time);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const filteredOrders = handleDateFilter(sortedOrders);
  const mainorders = filteredOrders?.slice(-10);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setIsCalendarVisible(true)}>
          <Ionicons
            name="calendar-outline"
            size={20}
            color={commonstyles.thinkerslane.color}
          />
          <Text style={styles.filterText}>
            {dateRange.startDate && dateRange.endDate
              ? `${dateRange.startDate} - ${dateRange.endDate}`
              : 'Select Date Range'}
          </Text>
        </TouchableOpacity>
        {dateRange.startDate && dateRange.endDate && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons
              name="refresh-circle"
              size={24}
              color={commonstyles.thinkerslane.color}
            />
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal visible={isCalendarVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Calendar
            style={styles.calendarContainer}
            markingType="period"
            current={currentDate}
            markedDates={{
              [dateRange.startDate]: {
                startingDay: true,
                ...styles.markingStyle,
              },
              [dateRange.endDate]: {
                endingDay: true,
                ...styles.markingStyle,
              },
              ...getIntermediateDates(dateRange.startDate, dateRange.endDate),
            }}
            onDayPress={handleDateSelect}
            enableSwipeMonths
            theme={{
              textDayFontSize: styles.dayTextStyle.fontSize,
              todayTextColor: styles.todayTextStyle.color,
              todayTextFontWeight: styles.todayTextStyle.fontWeight,
            }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCalendarVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <ScrollView>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size="large"
              color={commonstyles.thinkerslane.color}
            />
            <Text style={styles.loaderText}>Loading Orders...</Text>
          </View>
        ) : (
          mainorders && mainorders.map((order: any, index: any) => (
            <View key={index} style={styles.orderCard}>
              <TouchableOpacity
                onPress={() => handleOrderPress(order.booking_details.id)}
                style={styles.orderDetails}>
                <View style={styles.orderRow}>
                  <Ionicons
                    name="receipt-outline"
                    size={18}
                    color={commonstyles.thinkerslane.color}
                  />
                  <Text style={styles.orderId}>
                    Order ID: {order.booking_details.id}
                  </Text>
                </View>
                <View style={styles.orderRow}>
                  <Ionicons
                    name="key-outline"
                    size={18}
                    color={commonstyles.thinkerslane.color}
                  />
                  <Text style={styles.uniqueCode}>
                    Unique Code: {order.booking_details.unique_code}
                  </Text>
                </View>
                <View style={styles.orderRow}>
                  <Ionicons
                    name="wallet-outline"
                    size={18}
                    color={commonstyles.thinkerslane.color}
                  />
                  <Text style={styles.orderAmount}>
                    Total Amount: ₹{order.booking_details.amount}
                  </Text>
                </View>
                <View style={styles.orderRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={commonstyles.thinkerslane.color}
                  />
                  <Text style={styles.orderDate}>
                    Order Date: {order.booking_details.order_date_time}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.productHeader}>Products:</Text>
              {order.booking_product_details.map((product: any, idx: any) => (
                <View key={idx} style={styles.productCard}>
                  <View style={styles.productRow}>
                    <MaterialIcons
                      name="shopping-cart"
                      size={18}
                      color="#555"
                    />
                    <Text style={styles.productName}>
                      Name: {product.product_name}
                    </Text>
                  </View>
                  <View style={styles.productRow}>
                    <Ionicons name="cube-outline" size={18} color="#555" />
                    <Text style={styles.productQuantity}>
                      Quantity: {product.quantity}
                    </Text>
                  </View>
                  <View style={styles.productRow}>
                    <Ionicons name="pricetag-outline" size={18} color="#555" />
                    <Text style={styles.productPrice}>
                      Price: ₹{product.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default OrderHistory;
