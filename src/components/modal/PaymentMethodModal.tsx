import React from 'react';
import {Modal, View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

const PaymentMethodModal = ({visible, onClose, onSelectMethod}: any) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Choose Payment Method</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSelectMethod('cash');
              onClose();
            }}>
            <FontAwesome6 name="money-bill-alt" size={24} color="#4CAF50" />
            <Text style={styles.buttonText}>Proceed with Cash</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onSelectMethod('upi');
              onClose();
            }}>
            <FontAwesome6 name="credit-card" size={24} color="#009688" />
            <Text style={styles.buttonText}>Proceed with UPI</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#f1f1f1',
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'red',
  },
});

export default PaymentMethodModal;
