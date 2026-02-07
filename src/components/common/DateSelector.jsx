import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';

const DateSelector = ({
  selectedDate,
  onDateSelect,
  title = 'Select Date',
  showSlotsInfo = false,
  getSlotsInfo = null,
  minimumDate = null,
  style,
}) => {
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState(null);

  // Set default to today if no date is selected
  useEffect(() => {
    if (!selectedDate && onDateSelect) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      onDateSelect(today);
    }
  }, []);

  // Generate 7 days from today
  const getNext7Days = () => {
    const days = [];
    const today = minimumDate || new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const next7Days = getNext7Days();

  // Format date for display
  const formatDateDisplay = (date) => {
    if (!date) return '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    if (dateToCheck.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateToCheck.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return `${dayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]}`;
    }
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    const selected = new Date(selectedDate);
    const check = new Date(date);
    selected.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return selected.getTime() === check.getTime();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
    setCustomDate(null);
  };

  // Handle custom date picker
  const handleCustomDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowCustomDatePicker(false);
    }
    if (event?.type === 'set' && date) {
      setCustomDate(date);
      if (onDateSelect) {
        onDateSelect(date);
      }
    }
  };

  // Get slots info for a date
  const getDateSlotsInfo = (date, index) => {
    if (!showSlotsInfo) return null;
    if (getSlotsInfo && typeof getSlotsInfo === 'function') {
      return getSlotsInfo(date, index);
    }
    // Default slots info
    return index === 0 ? 'No slots' : '12 slots';
  };

  return (
    <View style={[styles.container, style]}>
      {title && (
        <Text variant="h4" style={styles.dateTitle}>
          {title}
        </Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}>
        {next7Days.map((date, index) => {
          const isSelected = isDateSelected(date);
          const slotsInfo = getDateSlotsInfo(date, index);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateTab,
                {height: showSlotsInfo ? 'auto' : 50},
                isSelected && styles.dateTabActive,
              ]}
              onPress={() => handleDateSelect(date)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.dateTabText,
                  isSelected && styles.dateTabTextActive,
                ]}>
                {formatDateDisplay(date)}
              </Text>
              {slotsInfo && (
                <Text
                  style={[
                    styles.slotsText,
                    isSelected && styles.slotsTextActive,
                  ]}>
                  {slotsInfo}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
        {/* Custom Date Option */}
        <TouchableOpacity
          style={[
            styles.dateTab,
            {height: showSlotsInfo ? 'auto' : 50},
            customDate && isDateSelected(customDate) && styles.dateTabActive,
          ]}
          onPress={() => setShowCustomDatePicker(true)}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.dateTabText,
              customDate && isDateSelected(customDate) && styles.dateTabTextActive,
            ]}>
            Custom
          </Text>
          <Text
            style={[
              styles.slotsText,
              customDate && isDateSelected(customDate) && styles.slotsTextActive,
            ]}>
            {customDate ? formatDateDisplay(customDate) : 'Pick date'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Date Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={showCustomDatePicker}
          transparent
          animationType="slide">
          <View style={styles.modalWrapper}>
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowCustomDatePicker(false)}
            />
            <SafeAreaView style={styles.modalContent} edges={['bottom']}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowCustomDatePicker(false)}>
                  <Text variant="body" color={colors.primary}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.pickerWrapper}>
                <DateTimePicker
                  value={customDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleCustomDateChange}
                  minimumDate={minimumDate || new Date()}
                />
              </View>
            </SafeAreaView>
          </View>
        </Modal>
      )}
      {Platform.OS === 'android' && showCustomDatePicker && (
        <DateTimePicker
          value={customDate || new Date()}
          mode="date"
          display="default"
          onChange={handleCustomDateChange}
          minimumDate={minimumDate || new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
  },
  dateScrollContent: {
    paddingRight: 16,
  },
  dateTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  dateTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dateTabTextActive: {
    color: colors.white,
  },
  slotsText: {
    fontSize: 11,
    marginTop: 4,
    color: colors.textSecondary,
  },
  slotsTextActive: {
    color: colors.white,
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
    minHeight: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerWrapper: {
    flex: 1,
    paddingVertical: 8,
  },
});

export default DateSelector;
