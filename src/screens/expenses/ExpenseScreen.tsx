import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {Picker} from '@react-native-picker/picker';
import ExpenseModal from './ExpenseModal';
import XLSX from 'xlsx';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import commonstyles from '../../components/commonstyles';
import CustomText from '../../components/CustomText';

const ExpenseScreen = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const categories = [
    'Choose Category',
    'Food',
    'Transport',
    'Entertainment',
    'Groceries',
  ];
  const months = [
    'Choose Month',
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

  useEffect(() => {
    const fetchData = async () => {
      const expensesData = require('./expenseData.json');
      setExpenses(expensesData);
    };
    fetchData();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState('Choose Category');
  const [selectedMonth, setSelectedMonth] = useState('Choose Month');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const filteredExpenses = expenses.filter(expense => {
    const monthMatch =
      selectedMonth === 'Choose Month' || expense.date.includes(selectedMonth);
    const categoryMatch =
      selectedCategory === 'Choose Category' ||
      expense.category === selectedCategory;
    return monthMatch && categoryMatch;
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  const openModal = (expense: any) => {
    setSelectedExpense(expense);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigation = useNavigation();

  const handleAddExpense = () => {
    navigation.navigate('AddExpenses');
  };

  const renderItem = ({item}: any) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <View style={styles.row}>
        <CustomText style={styles.cell}>{item.date}</CustomText>
        <CustomText style={styles.cell}>{item.time}</CustomText>
        <CustomText style={styles.cell}>{item.category}</CustomText>
        <CustomText style={styles.cell}>
          Rs. {item.amount.toFixed(2)}
        </CustomText>
      </View>
    </TouchableOpacity>
  );

  const exportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredExpenses);
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

    const path = `${RNFS.DownloadDirectoryPath}/Expenses.xlsx`;

    try {
      await RNFS.writeFile(
        path,
        XLSX.write(wb, {bookType: 'xlsx', type: 'binary'}),
        'ascii',
      );
      Toast.show({
        text1: 'Excel File Saved!',
        type: 'success',
        position: 'top',
      });
    } catch (error) {
      console.error('Export error:', error);
      Toast.show({
        text1: 'There is some error exporting excel',
        type: 'error',
        position: 'top',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.totalText}>
        Total Expenses: Rs.{totalExpenses.toFixed(2)}
      </Text>
      <View style={[styles.buttonsContainer, {flexDirection: 'row', gap: 10}]}>
        <TouchableOpacity
          style={[commonstyles.button, commonstyles.expenseButton]}
          onPress={handleAddExpense}>
          <FontAwesome name="money" size={24} style={{color: 'white'}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome
              name="plus-circle"
              size={16}
              style={{color: 'white', marginRight: 7}}
            />
            <CustomText style={commonstyles.buttonText}>Add Expense</CustomText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={exportToExcel}
          style={[commonstyles.button, commonstyles.normalButton]}>
          <FontAwesome6 name="file-excel" size={22} style={{color: 'white'}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <CustomText style={commonstyles.buttonText}>Export</CustomText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedCategory}
            style={styles.picker}
            onValueChange={itemValue => setSelectedCategory(itemValue)}>
            {categories.map(category => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
        <View style={styles.filterContainer}>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={itemValue => setSelectedMonth(itemValue)}>
            {months.map(month => (
              <Picker.Item key={month} label={month} value={month} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Time</Text>
        <Text style={styles.headerCell}>Category</Text>
        <Text style={styles.headerCell}>Amount</Text>
      </View>
      <FlatList
        data={filteredExpenses}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterContainer: {
    flex: 1,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    backgroundColor: '#f1f1f1',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'left',
    color: '#555',
  },
});

export default ExpenseScreen;
