import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from './Text';
import Button from './Button';

const ConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  onCancel,
  message = 'Are you sure want to cancel?',
  confirmText = 'Yes',
  cancelText = 'No',
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <SafeAreaView edges={['bottom']} style={styles.modalContainer}>
          {/* Message */}
          <Text variant="body" style={styles.messageText}>
            {message}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <Button
              title={confirmText}
              variant="primary"
              onPress={handleConfirm}
              style={styles.confirmButton}
              textStyle={styles.confirmButtonText}
            />
            <Button
              title={cancelText}
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default ConfirmationModal;
