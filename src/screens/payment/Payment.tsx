import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Text,
  Platform,
  StyleSheet,
  findNodeHandle,
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
import {
  useAddOrderCashMutation,
  useCheckCouponMutation,
} from '../../services/orderService';
import QRScanner from '../../components/common/qrScanner';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
  const [pricing, setPricing] = useState<any>({});
  const [result, setResult] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string | null;
    percent: number;
  } | null>(null);

  const [checkCoupon] = useCheckCouponMutation();
  const toastShownRef = useRef(false);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<any>(null);
  const inputRefs = useRef<{[key: string]: TextInput}>({});

  const handleCodeScanned = (code: string) => {
    setResult(code);
    setIsVisible(false);
    toastShownRef.current = false;
  };

  // Pure pricing calculation (book discounts)
  const calculateItemPricing = () => {
    const cartValues = Object.values(cart);
    let total = 0;
    let appliedDiscount = 0;

    const itemsWithPricing = cartValues.map((item: any) => {
      const basePrice = parseFloat(item.price);
      const qty = item.quantity;
      const userDiscount = bookDiscounts[item.id] || 0;
      const itemDiscount = (basePrice * userDiscount) / 100;
      const discountedPrice = basePrice - itemDiscount;

      const itemTotal = basePrice * qty;
      const itemDiscountTotal = itemDiscount * qty;
      const finalPrice = discountedPrice * qty;

      total += itemTotal;
      appliedDiscount += itemDiscountTotal;

      return {
        ...item,
        base_price: basePrice,
        quantity: qty,
        user_discount: userDiscount,
        item_discount: itemDiscountTotal,
        final_price: finalPrice,
      };
    });

    return {
      itemsWithPricing,
      total,
      appliedDiscount,
      grandTotal: total - appliedDiscount,
    };
  };

  // Apply QR coupon
  const applyQRCoupon = async (grandTotal: number) => {
    if (!result || toastShownRef.current) return {grandTotal, coupon: null};

    try {
      Toast.hide();
      const qrData = JSON.parse(result);
      const coupon_code = qrData.coupon_code || null;
      const validUntil = new Date(qrData.valid_to);
      const now = new Date();

      if (now > validUntil) {
        Toast.show({
          type: 'error',
          text1: 'Coupon Expired',
          text2: 'Your coupon is no longer valid.',
        });
        toastShownRef.current = true;
        return {grandTotal, coupon: null};
      }

      const res = await checkCoupon({coupon_code}).unwrap();

      if (res.status === 200 && res.is_used === 1) {
        Toast.show({
          type: 'error',
          text1: 'Coupon Already Used',
          text2: res.message || 'This coupon has already been used.',
        });
        toastShownRef.current = true;
        return {grandTotal, coupon: null};
      }

      if (res.is_used === 0) {
        const percent = parseFloat(qrData.discount_percent) || 0;
        const couponDiscount = (grandTotal * percent) / 100;
        const newGrandTotal = grandTotal - couponDiscount;

        setAppliedCoupon({code: coupon_code, percent});
        Toast.show({
          type: 'success',
          text1: 'Coupon Applied!',
          text2: `${percent}% discount applied.`,
        });
        toastShownRef.current = true;

        return {
          grandTotal: newGrandTotal,
          coupon: {code: coupon_code, percent, discount: couponDiscount},
        };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Coupon',
          text2: res.message || 'Please try again.',
        });
        toastShownRef.current = true;
        return {grandTotal, coupon: null};
      }
    } catch (err) {
      console.error('Coupon validation error:', err);
      Toast.show({
        type: 'error',
        text1: 'Coupon Check Failed',
        text2: 'Unable to verify coupon.',
      });
      toastShownRef.current = true;
      return {grandTotal, coupon: null};
    }
  };

  // Full pricing with coupon discount
  const calculatePricing = async (includeCoupon: boolean = true) => {
    const {itemsWithPricing, total, appliedDiscount, grandTotal} =
      calculateItemPricing();

    let finalGrandTotal = grandTotal;
    let couponData = null;
    let couponDiscountAmount = 0;

    if (includeCoupon && result) {
      const couponResult = await applyQRCoupon(grandTotal);
      finalGrandTotal = couponResult.grandTotal;
      couponData = couponResult.coupon;
      couponDiscountAmount = couponResult.coupon?.discount || 0;
    } else if (appliedCoupon) {
      const percent = appliedCoupon.percent || 0;
      couponDiscountAmount = (grandTotal * percent) / 100;
      finalGrandTotal = grandTotal - couponDiscountAmount;
      couponData = {...appliedCoupon, discount: couponDiscountAmount};
    }

    return {
      total,
      grand_total: finalGrandTotal,
      discount: appliedDiscount,
      coupon_discount: couponDiscountAmount, // NEW
      items: itemsWithPricing,
      discount_add: appliedDiscount > 0 ? 1 : 0,
      coupon_code: couponData?.code ?? null,
    };
  };

  // Debounced recalc
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const result = await calculatePricing(false);
      setPricing(result);
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [cart, bookDiscounts]);

  // Recalc with coupon
  useEffect(() => {
    if (result && !toastShownRef.current) {
      calculatePricing(true).then(setPricing);
    }
  }, [result]);

  const resetPricing = () => {
    setPricing(null);
    setAppliedCoupon(null);
    setResult(null);
    toastShownRef.current = false;
  };
  const resetCoupon = () => {
    setAppliedCoupon(null);
    setResult(null);

    calculatePricing(false).then(setPricing);
  };

  useEffect(() => {
    // Only run when BOTH coupon-related states are cleared
    if (appliedCoupon === null && result === null) {
      calculatePricing(false).then(setPricing);
    }
  }, [appliedCoupon, result]);

  const {fullName, email, address, phone, city, state, zip, userType} =
    formData;

  const payload = {
    params: {
      user_id,
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
        user_type: userType,
      },
      pricing,
      booking_products: Object.values(cart).map((item: any) => {
        const matched = pricing?.items?.find((p: any) => p.id === item.id);
        const totalFinalPrice = matched ? matched.final_price : 0;
        const perUnitPrice =
          matched && item.quantity > 0 ? totalFinalPrice / item.quantity : 0;

        return {
          product_id: item.id,
          quantity: item.quantity || 1,
          sell_price: String(totalFinalPrice),
          per_unit_price: String(perUnitPrice),
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
          clearCart();
          resetPricing();
        }, 2000);
      }, 2000);
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: 'Payment error',
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  };

  const scrollToInput = (reactNode: any) => {
    scrollRef.current?.scrollToFocusedInput?.(reactNode);
  };

  return (
    <View style={paymentstyles.container}>
      {/* Loading & Success */}
      {loading && (
        <BlurView
          style={[StyleSheet.absoluteFill, {zIndex: 9999}]}
          blurType="dark"
          blurAmount={100}>
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

      {/* Success */}
      {paymentSuccess && (
        <BlurView
          style={[StyleSheet.absoluteFill, {zIndex: 9999}]}
          blurType="dark"
          blurAmount={100}>
          <View style={paymentstyles.successContainer}>
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
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 12,
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Checkout')}>
          <FontAwesome6
            name="arrow-left-long"
            color={commonstyles.thinkerslane.color}
            size={24}
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

      {/* PRICING SUMMARY WITH COUPON DISCOUNT */}
      <View style={paymentstyles.pricingContainer}>
        <CustomText style={paymentstyles.pricingText}>
          Total: ₹{pricing?.total?.toFixed(2) || '0.00'}
        </CustomText>

        <CustomText style={paymentstyles.pricingText}>
          Discount: ₹{pricing?.discount?.toFixed(2) || '0.00'}
        </CustomText>

        {pricing?.coupon_discount > 0 && (
          <CustomText
            style={[
              paymentstyles.pricingText,
              {color: '#2e7d32', fontWeight: '600'},
            ]}>
            Coupon Discount: -₹{pricing.coupon_discount.toFixed(2)}
          </CustomText>
        )}

        {pricing?.coupon_code && (
          <CustomText
            style={{
              fontSize: 13,
              color: '#2e7d32',
              textAlign: 'center',
              marginVertical: 4,
            }}>
            Coupon: {pricing.coupon_code}
          </CustomText>
        )}

        <View
          style={{borderTopWidth: 1, borderColor: '#ddd', marginVertical: 8}}
        />

        <CustomText style={paymentstyles.grandTotalText}>
          Grand Total: ₹{pricing?.grand_total?.toFixed(2) || '0.00'}
        </CustomText>
      </View>

      {/* QR Button */}
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          backgroundColor: '#1976d2',
          padding: 16,
          borderRadius: 12,
          margin: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <MaterialCommunityIcons
          name="qrcode-scan"
          color="#fff"
          size={20}
          style={{marginRight: 8}}
        />
        <Text style={{color: '#fff', fontWeight: '600'}}>Scan QR Coupon</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={resetCoupon}
        style={{
          backgroundColor: '#1976d2',
          padding: 10,
          borderRadius: 12,
          margin: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{color: '#fff', fontWeight: '600'}}>Reset Coupon</Text>
      </TouchableOpacity> */}

      {/* BOOK LIST */}
      <KeyboardAwareScrollView
        innerRef={ref => {
          scrollRef.current = ref;
        }}
        extraHeight={15}
        extraScrollHeight={150}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardOpeningTime={0}
        contentContainerStyle={{paddingBottom: 300}}
        showsVerticalScrollIndicator={false}>
        {pricing?.items?.map((item: any) => {
          const imageUrl = item.images?.[0]
            ? `https://thinkerslane.com/public/uploads/admin/books/${item.images[0]}`
            : item.image
            ? `https://thinkerslane.com/public/uploads/admin/books/${
                item.image.split(',')[0]
              }`
            : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpsmmND4V8TKm5UTAtJLvhqaFNgJeHKv-3rQ&s';

          return (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                backgroundColor: '#fff',
                margin: 16,
                marginBottom: 8,
                borderRadius: 14,
                padding: 14,
                borderWidth: 1,
                borderColor: '#eee',
                elevation: 2,
              }}>
              <Image
                source={{uri: imageUrl}}
                style={{
                  width: 90,
                  height: 120,
                  borderRadius: 10,
                  marginRight: 14,
                }}
                resizeMode="cover"
              />
              <View style={{flex: 1}}>
                <Text
                  style={{fontWeight: '700', fontSize: 16, marginBottom: 4}}>
                  {item.name}
                </Text>
                <Text style={{color: '#555', marginBottom: 8}}>
                  ₹{item.base_price} × {item.quantity}
                </Text>

                <TextInput
                  ref={ref => {
                    if (ref) inputRefs.current[item.id] = ref;
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: '#fafafa',
                    fontSize: 15,
                    marginBottom: 8,
                  }}
                  placeholder="Discount %"
                  keyboardType="numeric"
                  value={(bookDiscounts[item.id] || 0).toString()}
                  onChangeText={value => {
                    const num = parseInt(value, 10);
                    setBookDiscounts(prev => ({
                      ...prev,
                      [item.id]: !isNaN(num) && num >= 0 ? num : 0,
                    }));
                  }}
                  onFocus={() => {
                    setTimeout(() => {
                      const handle = findNodeHandle(inputRefs.current[item.id]);
                      if (handle) scrollToInput(handle);
                    }, 100);
                  }}
                />

                <Text style={{color: '#2e7d32', marginBottom: 4}}>
                  Applied: {item.user_discount}% (-₹
                  {item.item_discount.toFixed(2)})
                </Text>
                <Text
                  style={{fontWeight: 'bold', fontSize: 16, color: '#1976d2'}}>
                  Final: ₹{item.final_price.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </KeyboardAwareScrollView>

      {/* QR Scanner Modal */}
      {isVisible && (
        <QRScanner
          isVisible={isVisible}
          onCodeScanned={handleCodeScanned}
          onClose={() => setIsVisible(false)}
        />
      )}

      {/* UPI Modal */}
      <Modal
        visible={showUPIModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUPIModal(false)}>
        <View style={cartStyles.modalContainer}>
          <View style={cartStyles.modalContent}>
            <Image
              source={require('../../assets/qr2.jpg')}
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
