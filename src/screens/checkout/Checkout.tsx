import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../../context/CartContext';
import {Picker} from '@react-native-picker/picker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomText from '../../components/CustomText';
import commonstyles from '../../components/commonstyles';
import checkoutStyles from './checkoutStyles';
import cartStyles from '../cart/cartStyles';
import Toast from 'react-native-toast-message';
import PaymentMethodModal from '../../components/modal/PaymentMethodModal';

const CheckoutScreen = () => {
  const [orderType, setOrderType] = useState('Online Order');
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    country: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (name: any, value: any) => {
    setForm({...form, [name]: value});
  };

  const handleValidation = () => {
    const requiredFields = {
      fullName: 'Full Name',
      phone: 'Phone number',
      address: 'Address',
      zip: 'Zip code',
    };

    for (let field in requiredFields) {
      if (!form[field]) {
        Toast.show({
          text1: 'Please fill in all mandatory fields.',
          text2: `${requiredFields[field]} is required`,
          type: 'error',
          position: 'top',
          visibilityTime: 2000,
        });
        return false;
      }
    }
    return true;
  };

  const handleCheckout = () => {
    if (handleValidation()) {
      setModalVisible(true);
    }
  };

  const handleSelectMethod = (method: any) => {
    if (!handleValidation()) return;

    Toast.show({
      text1: `Proceeding with ${method}`,
      type: 'info',
      position: 'top',
      visibilityTime: 2000,
    });

    navigation.navigate('Payment', {
      formData: form,
      paymentMethod: method,
    });
  };

  return (
    <View style={checkoutStyles.container}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <FontAwesome6
            name="arrow-left-long"
            color={commonstyles.thinkerslane.color}
            size={24}
            style={{margin: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={cartStyles.proceedButton}
          onPress={handleCheckout}>
          <FontAwesome6
            name="money-check"
            color="#fff"
            size={20}
            style={cartStyles.proceedButtonIcon}
          />
          <CustomText style={cartStyles.proceedButtonText}>
            Proceed to Pay
          </CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={checkoutStyles.form}
        showsVerticalScrollIndicator={false}>
        <Picker
          selectedValue={orderType}
          style={checkoutStyles.input}
          onValueChange={itemValue => setOrderType(itemValue)}>
          <Picker.Item label="Online Order" value="Online Order" />
          <Picker.Item label="Self Collection" value="Self Collection" />
        </Picker>

        <TextInput
          style={checkoutStyles.input}
          placeholder="Full Name"
          value={form.fullName}
          onChangeText={text => handleChange('fullName', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="Email Id"
          value={form.email}
          keyboardType="email-address"
          onChangeText={text => handleChange('email', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="Phone No"
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={text => handleChange('phone', text)}
        />
        <TextInput
          style={checkoutStyles.inputAddress}
          placeholder="Address"
          multiline={true}
          value={form.address}
          onChangeText={text => handleChange('address', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="Landmark"
          value={form.landmark}
          onChangeText={text => handleChange('landmark', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="Country"
          value={form.country}
          onChangeText={text => handleChange('country', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="City"
          value={form.city}
          onChangeText={text => handleChange('city', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="State"
          value={form.state}
          onChangeText={text => handleChange('state', text)}
        />
        <TextInput
          style={checkoutStyles.input}
          placeholder="Zip"
          value={form.zip}
          keyboardType="numeric"
          onChangeText={text => handleChange('zip', text)}
        />
      </ScrollView>

      <PaymentMethodModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectMethod={handleSelectMethod}
      />
    </View>
  );
};

export default CheckoutScreen;
