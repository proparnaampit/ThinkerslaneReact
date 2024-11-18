import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface ExpenseModalProps {
  visible: boolean;
  onClose: () => void;
  expense: {
    date: string;
    time: string;
    category: string;
    amount: number;
    purpose: string;
  };
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  visible,
  onClose,
  expense,
}) => {
  const convertToAmPm = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hourIn12HourFormat = hours % 12 || 12;
    const formattedTime = `${hourIn12HourFormat}:${minutes
      .toString()
      .padStart(2, '0')} ${period}`;
    return formattedTime;
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Expense Details</Text>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Date:</Text> {expense.date}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Time:</Text>{' '}
              {convertToAmPm(expense.time)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Category:</Text>
              {expense.type_details?.name || 'N/A'}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Amount:</Text> $
              {parseFloat(expense.amount).toFixed(2)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Purpose:</Text>
              {expense.description || 'Not provided'}
            </Text>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    padding: 20,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    maxHeight: 300,
    padding: 10, // Adjust padding if necessary
    flexGrow: 1, // Ensures content inside the ScrollView is allowed to expand
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 6,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExpenseModal;
