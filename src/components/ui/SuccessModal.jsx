import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../theme/colors';
import Text from './Text';
import Button from './Button';

const SuccessModal = ({
  visible,
  onClose,
  onDone,
  title = 'Thank You',
  message = 'Your Appointment Successfull',
  buttonText = 'Done',
  iconName = 'thumb-up',
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={50} color={colors.primary} />
          </View>

          {/* Title */}
          <Text variant="h2" style={styles.titleText}>
            {title}
          </Text>

          {/* Message */}
          <Text variant="body" style={styles.messageText}>
            {message}
          </Text>

          {/* Done Button */}
          <Button
            title={buttonText}
            variant="primary"
            onPress={onDone}
            style={styles.doneButton}
            textStyle={styles.doneButtonText}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 24,
  },
  titleText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  doneButton: {
    paddingHorizontal: 48,
    paddingVertical: 12,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessModal;
