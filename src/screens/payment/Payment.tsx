import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import paymentstyles from './paymentstyles';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import commonstyles from '../../components/commonstyles';
import cartStyles from '../cart/cartStyles';
import CustomText from '../../components/CustomText';
import {useCart} from '../../context/CartContext';
import {useSelector} from 'react-redux';
import {BlurView} from '@react-native-community/blur';
import LottieView from 'lottie-react-native';
import Toast from 'react-native-toast-message';
import {useAddOrderCashMutation} from '../../services/orderService';

const PaymentScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [showUPIModal, setShowUPIModal] = useState(false);
  const {formData, paymentMethod} = route.params;
  const {cart, clearCart} = useCart();
  const [discount, setDiscount] = useState(0);
  const [discountAdded, setDiscountAdded] = useState(false);
  const user_id = useSelector((state: any) => state?.auth?.userId);
  const [addOrderCash] = useAddOrderCashMutation();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const calculatePricing = () => {
    const total = Object.values(cart).reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);

    const appliedDiscount = discountAdded ? (total * discount) / 100 : 0;
    const grandTotal = total - appliedDiscount;

    return {
      discount_added: discountAdded,
      total,
      grand_total: grandTotal,
      discount: appliedDiscount,
    };
  };

  const pricing = calculatePricing();
  const {fullName, email, address, phone, city, state, zip} = formData;

  const payload = {
    user_id: user_id,
    payment_method: paymentMethod,
    booking_user_details: {
      user_id: 1,
      name: fullName,
      email,
      address,
      phone: parseInt(phone, 10),
      city,
      state,
      country: 'India',
      pin: parseInt(zip, 10),
      is_paid: 1,
    },
    pricing,
    booking_products: Object.values(cart).map((item: any) => ({
      product_id: item.id,
      quantity: item.quantity || 1,
    })),
  };

  const handlePayment = async () => {
    if (paymentMethod === 'upi') {
      setShowUPIModal(true);
      return;
    }

    await processPayment(payload);
  };

  const processPayment = async (payload: any) => {
    try {
      setLoading(true);
      const details = await addOrderCash(payload).unwrap();

      setTimeout(() => {
        setLoading(false);
        setPaymentSuccess(true);
        setTimeout(() => {
          setPaymentSuccess(false);
          navigation.navigate('Bill', {details});
          Toast.show({
            text1: 'Order added successfully',
            type: 'success',
            position: 'top',
            visibilityTime: 2000,
          });
        }, 2000);
      }, 2000);
      clearCart();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Toast.show({
        text1: 'There is an error processing this payment',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={paymentstyles.container}>
      {loading && (
        <BlurView
          style={[StyleSheet.absoluteFill, {zIndex: 9999}]}
          blurType="dark"
          blurAmount={100}
          reducedTransparencyFallbackColor="white">
          <View style={paymentstyles.loadingContainer}>
            <LottieView
              source={require('../../assets/animation-processing.json')}
              autoPlay
              loop
              style={paymentstyles.lottieAnimation}
            />
            <CustomText style={paymentstyles.loadingText}>
              Processing Payment...
            </CustomText>
          </View>
        </BlurView>
      )}

      {paymentSuccess && (
        <BlurView
          style={[StyleSheet.absoluteFill, {zIndex: 9999}]}
          blurType="dark"
          blurAmount={100}
          reducedTransparencyFallbackColor="white">
          <View style={[paymentstyles.successContainer, {zIndex: 9999}]}>
            <LottieView
              source={require('../../assets/animation-paysuccess.json')}
              autoPlay
              loop={false}
              style={paymentstyles.lottieAnimation}
            />
            <CustomText style={paymentstyles.successText}>
              Payment Successful!
            </CustomText>
          </View>
        </BlurView>
      )}

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
          <FontAwesome6
            name="arrow-left-long"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={cartStyles.proceedButton}
          onPress={handlePayment}>
          <MaterialCommunityIcons
            name="cash-check"
            color="#fff"
            size={20}
            style={cartStyles.proceedButtonIcon}
          />
          <CustomText style={cartStyles.proceedButtonText}>
            {paymentMethod === 'upi' ? 'Pay with UPI' : 'Pay'}
          </CustomText>
        </TouchableOpacity>
      </View>

      <View style={paymentstyles.pricingContainer}>
        <CustomText style={paymentstyles.pricingText}>
          Total: ₹{pricing.total}
        </CustomText>
        <CustomText style={paymentstyles.pricingText}>
          Discount: ₹{pricing.discount}
        </CustomText>
        <CustomText style={paymentstyles.grandTotalText}>
          Grand Total: ₹{pricing.grand_total}
        </CustomText>
      </View>

      <View style={{marginTop: 20}}>
        <CustomText style={{marginBottom: 10}}>Apply Discount in %</CustomText>
        <TextInput
          style={paymentstyles.discountInput}
          placeholder="Enter discount amount"
          keyboardType="numeric"
          onChangeText={value => {
            const discountValue = parseInt(value, 10);
            if (!isNaN(discountValue) && discountValue >= 0) {
              setDiscount(discountValue);
              setDiscountAdded(discountValue > 0);
            } else {
              setDiscount(0);
              setDiscountAdded(false);
            }
          }}
          value={discount.toString()}
        />
      </View>

      <Modal
        visible={showUPIModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowUPIModal(false)}>
        <View style={cartStyles.modalContainer}>
          <View style={cartStyles.modalContent}>
            <Image
              source={require('../../assets/qr.jpg')}
              style={cartStyles.qrImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={cartStyles.doneButton}
              onPress={async () => {
                setShowUPIModal(false);
                await processPayment(payload);
              }}>
              <CustomText style={cartStyles.doneButtonText}>Done</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PaymentScreen;
