import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import {Picker} from '@react-native-picker/picker';
import ExpenseModal from './ExpenseModal';
import {useSelector} from 'react-redux';
import commonstyles from '../../components/commonstyles';
import CustomText from '../../components/CustomText';
import {
  useFetchAllExpenseCategoryQuery,
  useGetExpensesQuery,
} from '../../services/expenseService';
import allExpensestyles from './allExpensestyles';

const ExpenseScreen = () => {
  const navigation = useNavigation<any>();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Choose Category');
  const [selectedMonth, setSelectedMonth] = useState('Choose Month');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const user_id = useSelector((state: any) => state?.auth?.userId);
  const {
    data: expensesData,
    error: expensesError,
    isLoading: expensesLoading,
  } = useGetExpensesQuery(user_id);

  const {
    data: expenseCategory,
    isLoading: expenseCatloading,
    error: expenseError,
  } = useFetchAllExpenseCategoryQuery({});

  useEffect(() => {
    if (
      expenseCategory?.status === 'successs' &&
      expenseCategory.data?.categories
    ) {
      const categoryNames = expenseCategory.data.categories.map((cat: any) =>
        cat.name.trim(),
      );
      setCategories(categoryNames);
    }
  }, [expenseCategory]);

  useEffect(() => {
    const fetchData = async () => {
      if (!expensesLoading && !expenseCatloading && user_id) {
        if (expensesData?.data?.expenses && expensesData.status) {
          const expensesDataArray = expensesData.data.expenses;
          setExpenses(expensesDataArray);
        } else {
        }
      }
    };

    fetchData();
  }, [
    expensesData,
    expenseCategory,
    user_id,
    expensesLoading,
    expenseCatloading,
  ]);

  const filteredExpenses = expenses.filter(expense => {
    const monthMatch =
      selectedMonth === 'Choose Month' || expense.date.includes(selectedMonth);

    const categoryMatch =
      selectedCategory === 'Choose Category' ||
      expense.type_details?.name === selectedCategory;

    return monthMatch && categoryMatch;
  });

  const totalExpenses = filteredExpenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const handleReset = () => {
    setSelectedCategory('Choose Category');
    setSelectedMonth('Choose Month');
  };

  const openModal = (expense: any) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleAddExpense = () => {
    navigation.navigate('AddExpenses');
  };

  const convertToAmPm = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hourIn12HourFormat = hours % 12 || 12;
    const formattedTime = `${hourIn12HourFormat}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
    return formattedTime;
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={allExpensestyles.row}>
        <CustomText style={allExpensestyles.cell}>{item.date}</CustomText>
        <CustomText style={allExpensestyles.cell}>
          {convertToAmPm(item.time)}
        </CustomText>
        <CustomText style={allExpensestyles.cell}>
          {item.type_details?.name}
        </CustomText>
        <CustomText style={allExpensestyles.cell}>
          Rs. {parseFloat(item.amount).toFixed(2)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={allExpensestyles.container}>
      <View
        style={[
          allExpensestyles.buttonsContainer,
          {flexDirection: 'row', gap: 10},
        ]}>
        <TouchableOpacity
          style={[commonstyles.button, commonstyles.expenseButton]}
          onPress={handleAddExpense}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7}}
            />
            <CustomText style={commonstyles.buttonText}>Add Expense</CustomText>
          </View>
        </TouchableOpacity>
      </View>
      <CustomText style={allExpensestyles.totalText}>
        Total Expenses: Rs.{totalExpenses.toFixed(2)}
      </CustomText>
      <View style={allExpensestyles.filterRow}>
        <View style={allExpensestyles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            style={allExpensestyles.picker}
            onValueChange={itemValue => setSelectedCategory(itemValue)}>
            <Picker.Item label="Category" value="Choose Category" />
            {categories.map(category => (
              <Picker.Item
                key={category}
                label={category}
                value={category}
                style={{fontSize: 12}}
              />
            ))}
          </Picker>
        </View>

        <View style={allExpensestyles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            style={allExpensestyles.picker}
            onValueChange={itemValue => setSelectedMonth(itemValue)}>
            <Picker.Item label="Month" value="Choose Month" />
            {months.map(month => (
              <Picker.Item
                key={month}
                label={month}
                value={month}
                style={{fontSize: 12}}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={allExpensestyles.resetButton}
          onPress={handleReset}>
          <Entypo
            name="circle-with-cross"
            size={24}
            style={allExpensestyles.resetIcon}
          />
          <CustomText>Reset</CustomText>
        </TouchableOpacity>
      </View>
      <View style={allExpensestyles.tableHeader}>
        <CustomText style={allExpensestyles.headerCell}>Date</CustomText>
        <CustomText style={allExpensestyles.headerCell}>Time</CustomText>
        <CustomText style={allExpensestyles.headerCell}>Category</CustomText>
        <CustomText style={allExpensestyles.headerCell}>Amount</CustomText>
      </View>

      {expensesLoading ? (
        <View style={allExpensestyles.loaderContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={allExpensestyles.loaderText}>Loading expenses...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExpenses}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={allExpensestyles.emptyContainer}>
              <Text style={allExpensestyles.emptyText}>No expenses found.</Text>
            </View>
          }
          ListFooterComponent={<View style={{marginBottom: 20}} />}
        />
      )}

      {selectedExpense && (
        <ExpenseModal
          visible={modalVisible}
          onClose={closeModal}
          expense={selectedExpense}
        />
      )}
    </View>
  );
};

export default ExpenseScreen;
