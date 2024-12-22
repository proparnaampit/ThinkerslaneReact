import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

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
}: any) => {
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
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <Entypo name="circle-with-cross" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.scrollView}>
            <View style={styles.viewPurpose}>
              <Text style={styles.boldText}>Date:</Text>
              <Text style={styles.normalText}>{expense.date}</Text>
            </View>
            <View style={styles.viewPurpose}>
              <Text style={styles.boldText}>Time:</Text>
              <Text style={styles.normalText}>
                {convertToAmPm(expense.time)}
              </Text>
            </View>
            <View style={styles.viewPurpose}>
              <Text style={styles.boldText}>Category:</Text>
              <Text style={styles.normalText}>
                {expense.type_details?.name || 'N/A'}
              </Text>
            </View>
            <View style={styles.viewPurpose}>
              <Text style={styles.boldText}>Amount:</Text>
              <Text style={styles.normalText}>
                Rs.{parseFloat(expense.amount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.viewPurposeDesc}>
              <Text style={styles.boldText}>Purpose:</Text>
              <ScrollView style={styles.descriptionScroll}>
                <Text style={styles.normalText}>
                  {expense.description || 'Not provided'}
                </Text>
              </ScrollView>
            </View>
          </View>
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
  viewPurpose: {
    marginBottom: 20,
  },
  viewPurposeDesc: {
    flex: 1,
    height: 500,
  },
  descriptionScroll: {
    maxHeight: 'auto',
    paddingBottom: 20,
    borderRadius: 8,
  },
  scrollView: {
    padding: 10,
    flexGrow: 1,
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10, // Ensures it stays on top of other elements
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
  normalText: {
    fontWeight: 'normal',
    color: '#333',
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
