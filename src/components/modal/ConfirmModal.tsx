import React from 'react';
import {Modal, View, TouchableOpacity, StyleSheet} from 'react-native';
import CustomText from '../CustomText';
import commonstyles from '../commonstyles';

interface ConfirmModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  onConfirm,
  onCancel,
  message,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <CustomText style={styles.modalTitle}>{message}</CustomText>
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalButtonCancel}
              onPress={onCancel}>
              <CustomText style={styles.modalButtonText}>Cancel</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButtonConfirm}
              onPress={onConfirm}>
              <CustomText style={styles.modalButtonText}>Confirm</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '70%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    alignContent: 'center',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonCancel: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: commonstyles.cancelButton.backgroundColor,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonConfirm: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: commonstyles.saveButton.backgroundColor,
    borderRadius: 5,
    margin: 5,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ConfirmModal;
