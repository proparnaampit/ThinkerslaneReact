import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import expensestyles from './addExpensestyles';
import {useNavigation} from '@react-navigation/native';
import {Dropdown} from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomText from '../../components/CustomText';
import Toast from 'react-native-toast-message';
import {
  useFetchAllExpenseCategoryQuery,
  useAddExpenseMutation,
} from '../../services/expenseService';

const AddExpenseScreen = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const user_id = useSelector((state: any) => state?.auth?.userId);
  const [isFocus, setIsFocus] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  const {
    data: expenseCategory,
    isLoading: expenseCatLoading,
    error: expenseError,
  } = useFetchAllExpenseCategoryQuery({});
  const [addExpense] = useAddExpenseMutation();
  useEffect(() => {
    if (!expenseCatLoading && expenseCategory?.data?.categories) {
      const mappedCategories = expenseCategory.data.categories.map(
        (cat: any) => ({
          label: cat.name,
          value: cat.id,
        }),
      );
      setCategories(mappedCategories);
    }
  }, [expenseCatLoading, expenseCategory]);

  const handleSubmit = async () => {
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
      user_id,
      amount,
      type: category,
      description,
    };

    const response = await addExpense(expenseData).unwrap();

    if (response.status && response.status.status == 'Success') {
      Toast.show({
        text1: 'Expense Added Succesfully',
        type: 'success',
        position: 'top',
      });

      navigation.navigate('Expenses');
    } else {
      Toast.show({
        text1: 'Expense not added',
        type: 'error',
        position: 'top',
      });
    }
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
          value={description}
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescription}
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
