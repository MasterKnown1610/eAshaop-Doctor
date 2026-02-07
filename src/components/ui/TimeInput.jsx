import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Text from './Text';

const MODAL_HEIGHT = 380;

const formatTime = (date) => {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatTimeDisplay12h = (date) => {
  if (!date) return '';
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes} ${ampm}`;
};

const formatTimeDisplay24h = (date) => {
  if (!date) return '';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const TimeInput = ({
  value,
  onChange,
  placeholder = 'Select time',
  label,
  error,
  is24Hour = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const time = value ? new Date(value) : new Date();
  const formatTimeDisplay = is24Hour ? formatTimeDisplay24h : formatTimeDisplay12h;

  const handleChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event?.type === 'set' && selectedTime) {
      onChange(selectedTime);
    }
  };

  const openPicker = () => setShowPicker(true);
  const closePicker = () => setShowPicker(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={openPicker}
        style={[styles.touchable, error && styles.inputError]}
        activeOpacity={0.7}>
        <Icon name="time-outline" size={20} color={colors.gray} />
        <Text
          variant="body"
          style={[styles.value, !value && styles.placeholder]}
          numberOfLines={1}>
          {value ? formatTimeDisplay(time) : placeholder}
        </Text>
      </TouchableOpacity>
      {error ? (
        <Text variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalWrapper}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={closePicker}
            />
            <SafeAreaView
              style={styles.modalContent}
              edges={['bottom']}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closePicker}>
                  <Text variant="body" color={colors.primary}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={time}
                  mode="time"
                  display="spinner"
                  onChange={handleChange}
                  is24Hour={is24Hour}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleChange}
            is24Hour={is24Hour}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputError: {
    borderColor: colors.error,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  placeholder: {
    color: colors.gray,
  },
  errorText: {
    marginTop: 4,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    minHeight: MODAL_HEIGHT,
  },
  pickerWrapper: {
    flex: 1,
    paddingVertical: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});

export default TimeInput;
