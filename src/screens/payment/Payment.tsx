import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  FlatList,
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
  const user_id = useSelector((state: any) => state?.auth?.userId);
  const [addOrderCash] = useAddOrderCashMutation();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [bookDiscounts, setBookDiscounts] = useState<{[key: string]: number}>(
    {},
  );
  console.log('cart', cart);

  const calculatePricing = () => {
    const cartValues = Object.values(cart);

    const itemsWithPricing = cartValues.map((item: any) => {
      const basePrice = parseFloat(item.price);
      const qty = item.quantity;

      const userDiscount = bookDiscounts[item.id] || 0;
      const itemDiscount = (basePrice * userDiscount) / 100;
      const discountedPrice = basePrice - itemDiscount;

      return {
        ...item,
        base_price: basePrice,
        quantity: qty,
        user_discount: userDiscount,
        item_discount: itemDiscount * qty,
        final_price: discountedPrice * qty,
      };
    });

    const total = itemsWithPricing.reduce(
      (acc, item) => acc + item.base_price * item.quantity,
      0,
    );

    const appliedDiscount = itemsWithPricing.reduce(
      (acc, item) => acc + item.item_discount,
      0,
    );

    const grandTotal = total - appliedDiscount;

    return {
      total,
      grand_total: grandTotal,
      discount: appliedDiscount,
      items: itemsWithPricing,
      discount_add: appliedDiscount > 0 ? 1 : 0,
    };
  };

  const pricing = calculatePricing();

  const {fullName, email, address, phone, city, state, zip} = formData;
  const payload = {
    params: {
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
      booking_products: Object.values(cart).map((item: any) => {
        // find the same product inside pricing.items
        const matched = pricing.items.find((p: any) => p.id === item.id);

        // final price for all quantities
        const totalFinalPrice = matched ? matched.final_price : 0;

        // per-unit discounted price
        const perUnitPrice =
          matched && item.quantity > 0 ? totalFinalPrice / item.quantity : 0;

        return {
          product_id: item.id,
          quantity: item.quantity || 1,
          sell_price: String(totalFinalPrice), // total discounted price for qty
          per_unit_price: String(perUnitPrice), // new key → discounted price per unit
        };
      }),
    },
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
      console.log(error);
      setLoading(false);
      Toast.show({
        text1: 'There is an error processing this payment',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
    }
    console.log(JSON.stringify(payload));
  };

  return (
    <View style={paymentstyles.container}>
      {/* Loading animation */}
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

      {/* Success animation */}
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

      {/* Header */}
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

      {/* Summary */}
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

      {/* Per book details */}

      <FlatList
        data={pricing.items}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({item}) => {
          // build image url
          const imageUrl =
            item.images && item.images.length > 0
              ? `https://thinkerslane.com/public/uploads/admin/books/${item.images[0]}`
              : item.image
              ? `https://thinkerslane.com/public/uploads/admin/books/${
                  item.image?.split(',')[0]
                }`
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpsmmND4V8TKm5UTAtJLvhqaFNgJeHKv-3rQ&s';

          return (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                padding: 10,
                borderWidth: 1,
                borderRadius: 8,
              }}>
              {/* Book image */}
              <Image
                source={{uri: imageUrl}}
                style={{
                  width: 100,
                  height: 130,
                  marginRight: 10,
                  borderRadius: 10,
                }}
                resizeMode="contain"
              />

              {/* Book details */}
              <View style={{flex: 1}}>
                <CustomText
                  style={{fontWeight: 'bold', marginBottom: 5, fontSize: 20}}>
                  {item.name}
                </CustomText>
                <CustomText>
                  Price: ₹{item.base_price} × {item.quantity}
                </CustomText>

                <TextInput
                  style={paymentstyles.discountInput}
                  placeholder="Enter discount %"
                  keyboardType="numeric"
                  value={(bookDiscounts[item.id] || 0).toString()}
                  onChangeText={value => {
                    const discountValue = parseInt(value, 10);
                    setBookDiscounts(prev => ({
                      ...prev,
                      [item.id]:
                        !isNaN(discountValue) && discountValue >= 0
                          ? discountValue
                          : 0,
                    }));
                  }}
                />

                <CustomText>
                  Applied Discount: {item.user_discount}% (₹
                  {item.item_discount.toFixed(2)})
                </CustomText>
                <CustomText style={{fontWeight: 'bold', marginTop: 5}}>
                  Final Price: ₹{item.final_price.toFixed(2)}
                </CustomText>
              </View>
            </View>
          );
        }}
      />

      {/* UPI Modal */}
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
