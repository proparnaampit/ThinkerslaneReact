import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import expensestyles from './addExpensestyles';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../components/CustomText';
import Toast from 'react-native-toast-message';

const AddExpenseScreen = () => {
  const [expenseName, setExpenseName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const navigation = useNavigation();

  const categories = [
    {label: 'Food', value: 'food'},
    {label: 'Transport', value: 'transport'},
    {label: 'Shopping', value: 'shopping'},
    {label: 'Other', value: 'other'},
  ];

  const handleSubmit = () => {
    if (!amount || !category) {
      Toast.show({
        text1: 'Amount and category are required fields',
        text2: 'Validation Error.',
        type: 'error',
        position: 'top',
      });
      return;
    }

    const expenseData = {
      expenseName,
      amount,
      date,
      category,
      purpose,
    };

    Toast.show({
      text1: 'Expense Added Succesfully',
      type: 'success',
      position: 'top',
    });

    navigation.navigate('Expenses');
  };

  return (
    <ScrollView style={expensestyles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <MaterialIcons
          name="keyboard-backspace"
          color={'black'}
          size={24}
          style={{marginBottom: 20}}
        />
      </TouchableOpacity>

      <CustomText
        style={{
          color: 'black',
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 29,
        }}>
        Add Your Expense For Today
      </CustomText>
      <View style={expensestyles.formContainer}>
        <Text style={expensestyles.label}>Amount</Text>
        <TextInput
          style={expensestyles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={expensestyles.label}>Category</Text>
        <Dropdown
          style={[expensestyles.input, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={{color: 'gray', fontFamily: 'monospace'}}
          selectedTextStyle={{color: 'black', fontFamily: 'monospace'}}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select category' : '...'}
          value={category}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setCategory(item.value);
            setIsFocus(false);
          }}
        />

        <Text style={expensestyles.label}>Purpose</Text>
        <TextInput
          style={expensestyles.multilineInput}
          placeholder="Enter Purpose"
          value={purpose}
          multiline={true}
          numberOfLines={4}
          onChangeText={setPurpose}
        />

        <TouchableOpacity
          style={expensestyles.submitButton}
          onPress={handleSubmit}>
          <Text style={expensestyles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddExpenseScreen;
