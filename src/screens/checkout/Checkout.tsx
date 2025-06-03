import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../../contexts/CartContext';
import {Picker} from '@react-native-picker/picker';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import CustomText from '../../components/CustomText';
import commonstyles from '../../components/commonstyles';
import checkoutStyles from './checkoutStyles';
import cartStyles from '../cart/cartStyles';
import {Dropdown} from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import PaymentMethodModal from '../../components/modal/PaymentMethodModal';
import {useGetAllUsersQuery} from '../../services/orderService';

const CheckoutScreen = () => {
  const [orderType, setOrderType] = useState('Online Order');
  const navigation = useNavigation<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const {data: usersData, isLoading, error, refetch} = useGetAllUsersQuery({});

  const [form, setForm] = useState<any>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    landmark: '',
    city: '',
    state: 'West Bengal',
    zip: '',
  });

  const handleChange = (name: any, value: any) => {
    setForm({...form, [name]: value});
  };

  const filteredUsers: any = useMemo(() => {
    return usersData?.data?.filter(
      (user: any) => user.mobile && user.mobile.trim() !== '',
    );
  }, [usersData]);

  const handleValidation = () => {
    const requiredFields: any = {
      fullName: 'Full Name',
      phone: 'Phone number',
      zip: 'Pin Code',
    };

    for (let field in requiredFields) {
      if (!form[field]) {
        Toast.show({
          text2: 'Please fill in all mandatory fields.',
          text1: `${requiredFields[field]} is required`,
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
    refetch();

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

  const handleUserSelection = (item: any) => {
    setSelectedUser(item?.value);
    setForm({
      fullName: item?.name || '',
      email: item?.email || '',
      phone: item?.mobile || '',
      address: item?.address || '',
      landmark: item?.landmark || '',
      city: item?.city || '',
      state: item?.state || 'West Bengal',
      zip: item?.pin || '',
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

      <Dropdown
        data={filteredUsers || []}
        labelField="name"
        valueField="id"
        placeholder="Select a User"
        value={selectedUser}
        onChange={(item: any) => handleUserSelection(item)}
        search={true}
        searchQuery={(keyword, labelValue) => {
          const lowerKeyword = keyword.toLowerCase();
          return (
            labelValue.toLowerCase().includes(lowerKeyword) ||
            filteredUsers
              .find((user: {name: string}) => user.name === labelValue)
              ?.mobile?.toLowerCase()
              .includes(lowerKeyword) ||
            filteredUsers
              .find((user: {name: string}) => user.name === labelValue)
              ?.pin?.toLowerCase()
              .includes(lowerKeyword)
          );
        }}
        searchPlaceholder="Search by Name, Mobile, or PIN..."
        renderItem={item => (
          <View
            style={{
              padding: 15,
              marginVertical: 5,
              backgroundColor: '#fff',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 5,
              borderWidth: 1,
              borderColor: '#ddd',
            }}>
            <View style={{marginBottom: 5}}>
              <CustomText style={{fontWeight: 'bold'}}>
                Name: {item.name}
              </CustomText>
            </View>

            {item.mobile && (
              <View style={{marginBottom: 5}}>
                <CustomText style={{fontWeight: 'bold'}}>
                  Mobile: {item.mobile}
                </CustomText>
              </View>
            )}

            {item.pin && (
              <View>
                <CustomText style={{fontWeight: 'bold'}}>
                  Pin: {item.pin}
                </CustomText>
              </View>
            )}
          </View>
        )}
        style={{
          marginTop: 20,
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 8,
          padding: 8,
        }}
      />

      <ScrollView
        style={checkoutStyles.form}
        showsVerticalScrollIndicator={false}>
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
          placeholder="PIN Code"
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
