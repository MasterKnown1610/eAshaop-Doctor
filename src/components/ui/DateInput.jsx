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

const formatDate = (d) => {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const formatDisplay = (d) => {
  if (!d) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1);
  const day = String(d.getDate());
  return `${day}-${m}-${y}`;
};

/** Parse date string as local date to avoid timezone shifting (e.g. "2025-01-31" -> Jan 31 in local time) */
const parseLocalDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  const str = String(value).trim();
  const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const [, y, m, day] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(day));
  }
  return new Date(value);
};

const DateInput = ({
  value,
  onChange,
  placeholder = 'Select date of birth',
  label = 'Date of Birth',
  error,
  maximumDate,
  minimumDate,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const date = value ? parseLocalDate(value) : null;

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (event?.type === 'set' && selectedDate) {
      onChange(formatDate(selectedDate));
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
        <Text
          variant="body"
          style={[styles.value, !date && styles.placeholder]}
          numberOfLines={1}>
          {date ? formatDisplay(date) : placeholder}
        </Text>
        <Icon name="calendar-outline" size={20} color={colors.gray} />
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
                  value={date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleChange}
                  maximumDate={maximumDate}
                  minimumDate={minimumDate}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default DateInput;
