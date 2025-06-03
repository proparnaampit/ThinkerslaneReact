import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, ScrollView} from 'react-native';
import {useCart} from '../../contexts/CartContext';
import {useNavigation} from '@react-navigation/native';
import cartStyles from './cartStyles';
import commonstyles from '../../components/commonstyles';
import CustomText from '../../components/CustomText';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import addOrderStyles from '../order/addOrderStyles';
import CartBook from '../../components/book/CartBook';
import ConfirmModal from '../../components/modal/ConfirmModal';
import AddOrderButton from '../../components/buttons/AddOrderButton';

const Cart = () => {
  const navigation = useNavigation<any>();
  const {cart, clearCart} = useCart();
  const calculateTotal = () => {
    return Object.values(cart).reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const total = calculateTotal();
  const isCartEmpty = Object.keys(cart).length === 0;

  const handleClearCart = () => {
    clearCart();
    setModalVisible(false);
  };
  const handleFormSubmit = () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={cartStyles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        {!isCartEmpty && (
          <TouchableOpacity
            style={cartStyles.proceedButton}
            onPress={handleFormSubmit}>
            <FontAwesome6
              name="credit-card"
              color="#fff"
              size={20}
              style={cartStyles.proceedButtonIcon}
            />
            <CustomText style={cartStyles.proceedButtonText}>
              Proceed to Checkout
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {isCartEmpty ? (
        <View style={cartStyles.emptyCartContainer}>
          <CustomText style={cartStyles.emptyCartText}>
            Your Cart is Empty
          </CustomText>
          <AddOrderButton />
        </View>
      ) : (
        <>
          <View style={cartStyles.totalContainers}>
            <CustomText style={cartStyles.totaltext}>
              Total: ₹{total}
            </CustomText>
          </View>

          <TouchableOpacity
            style={cartStyles.clearCartButton}
            onPress={() => setModalVisible(true)}>
            <CustomText style={cartStyles.clearCartButtonText}>
              Clear Cart
            </CustomText>
          </TouchableOpacity>
        </>
      )}

      <ScrollView style={addOrderStyles.booksContainer}>
        {Object.values(cart).map((item: any) => (
          <View key={item.id} style={cartStyles.bookItem}>
            <CartBook data={item} />
          </View>
        ))}
      </ScrollView>

      <ConfirmModal
        visible={modalVisible}
        onConfirm={handleClearCart}
        onCancel={() => setModalVisible(false)}
        message="Are you sure you want to clear the cart?"
      />
    </View>
  );
};

export default Cart;
