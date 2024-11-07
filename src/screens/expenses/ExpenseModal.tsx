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
              <Text style={styles.boldText}>Time:</Text> {expense.time}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Category:</Text> {expense.category}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Amount:</Text> $
              {expense.amount.toFixed(2)}
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Purpose:</Text> {expense.purpose}
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
    width: 320,
    padding: 20,
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
    marginBottom: 12,
    color: '#666',
  },
  boldText: {
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    maxHeight: 300,
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
