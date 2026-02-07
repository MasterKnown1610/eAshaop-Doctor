import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import DateInput from '../../components/ui/DateInput';
import TimeInput from '../../components/ui/TimeInput';
import Dropdown from '../../components/ui/Dropdown';
import Button from '../../components/ui/Button';
import Context from '../../context/Context';
import toast from '../../utils/toast';

const SetAvailabilityScreen = ({ navigation }) => {
  const {
    bookings: { setDoctorAvailability },
  } = useContext(Context);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [repeatType, setRepeatType] = useState('custom'); // daily, weekly, custom
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [slotDuration, setSlotDuration] = useState('30');
  const [selectedDays, setSelectedDays] = useState(['tue']);
  const [selectedDate, setSelectedDate] = useState(new Date('2025-03-04'));
  const [timeSlots, setTimeSlots] = useState([
    { id: '1', start: '8:00', end: '12:00' },
    { id: '2', start: '8:00', end: '12:00' },
  ]);
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');

  const daysOfWeek = [
    { id: 'mon', label: 'Mon' },
    { id: 'tue', label: 'Tue' },
    { id: 'wed', label: 'Wed' },
    { id: 'thu', label: 'Thu' },
    { id: 'fri', label: 'Fri' },
    { id: 'sat', label: 'Sat' },
    { id: 'sun', label: 'Sun' },
  ];

  const slotDurationOptions = [
    // {label: '15 Mins', value: '15'},
    { label: '30 Mins', value: '30' },
    // {label: '45 Mins', value: '45'},
    { label: '60 Mins', value: '60' },
  ];

  const formatDateDisplay = date => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const handleDayToggle = dayId => {
    setSelectedDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId],
    );
  };

  const handleDeleteSlot = slotId => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== slotId));
  };

  const handleAddSlot = () => {
    if (newSlotStart && newSlotEnd) {
      const newSlot = {
        id: Date.now().toString(),
        start: newSlotStart,
        end: newSlotEnd,
      };
      setTimeSlots(prev => [...prev, newSlot]);
      setNewSlotStart('');
      setNewSlotEnd('');
    }
  };

  /** Format Date to "HH:mm" (24h) for API payload */
  const formatTimeToHHmm = date => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleSave = async () => {
    const dateStr =
      typeof startDate === 'string'
        ? startDate
        : startDate
        ? (() => {
            const d = new Date(startDate);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
          })()
        : '';

    const payload = {
      date: dateStr,
      startTime: formatTimeToHHmm(startTime),
      endTime: formatTimeToHHmm(endTime),
      slotDuration: Number(slotDuration) || 30,
    };

    console.log('Saving availability payload:', payload);
    const response = await setDoctorAvailability(payload);
    
    console.log(response, 'this is the response');
    if (response?.status >= 200 && response?.status < 300) {
      toast.success('Availability set successfully');
      // Clear inputs
      setStartDate(null);
      setStartTime(null);
      setEndTime(null);
      setSlotDuration('30');
    } else {
      toast.error('Failed to set availability');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selection */}
        <View style={styles.section}>
          <Text variant="h6" style={styles.sectionTitle}>
            Date selection
          </Text>
          <View style={styles.row}>
            <View style={styles.fullWidth}>
              <DateInput
                label="Select Date"
                value={startDate}
                onChange={dateString => setStartDate(dateString)}
                placeholder="Select Date"
                minimumDate={new Date()}
              />
            </View>
            {/* <View style={styles.halfWidth}>
              <DateInput
                label="End Date"
                value={endDate}
                onChange={dateString => setEndDate(dateString)}
                placeholder="9-09-2025"
                minimumDate={startDate ? new Date(startDate) : new Date()}
              />
            </View> */}
          </View>
        </View>

        {/* Repeat Availability */}
        {/* <View style={styles.section}>
          <Text variant="h6" style={styles.sectionTitle}>
            Repeat Availability
          </Text>
          <View style={styles.repeatButtons}>
            {['daily', 'weekly', 'custom'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.repeatButton,
                  repeatType === type && styles.repeatButtonActive,
                ]}
                onPress={() => setRepeatType(type)}
                activeOpacity={0.7}
              >
                <Text
                  variant="bodySmall"
                  style={[
                    styles.repeatButtonText,
                    repeatType === type && styles.repeatButtonTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Time Slot Settings */}
        <View style={styles.section}>
          <Text variant="h6" style={styles.sectionTitle}>
            Time Slot Settings
          </Text>
          <View style={styles.row}>
            <View style={styles.halfWidth}>
              <TimeInput
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
                placeholder="Select start time"
                is24Hour={true}
              />
            </View>
            <View style={styles.halfWidth}>
              <TimeInput
                label="End Time"
                value={endTime}
                onChange={setEndTime}
                placeholder="Select end time"
                is24Hour={true}
              />
            </View>
          </View>
          <Dropdown
            label="Slot Duration"
            options={slotDurationOptions}
            selectedValue={slotDuration}
            onSelect={setSlotDuration}
            placeholder="Select duration"
          />
        </View>

        {/* Days of Week */}
        {/* {repeatType === 'custom' && (
          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Days of week
            </Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map(day => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayButton,
                      isSelected && styles.dayButtonActive,
                    ]}
                    onPress={() => handleDayToggle(day.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      variant="bodySmall"
                      style={[
                        styles.dayButtonText,
                        isSelected && styles.dayButtonTextActive,
                      ]}
                    >
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )} */}

        {/* Manage Time Slots */}
        {/* <View style={styles.section}>
          <Text variant="h6" style={styles.sectionTitle}>
            Manage time slots for{' '}
            <Text variant="h6" style={styles.boldText}>
              {formatDateDisplay(selectedDate)}
            </Text>
          </Text>
          <Text variant="bodySmall" style={styles.subtitle}>
            Add, edit or remove blocks of time you are available
          </Text>

          {timeSlots.map(slot => (
            <View key={slot.id} style={styles.timeSlotRow}>
              <View style={styles.timeSlotInput}>
                <Text variant="body" style={styles.timeSlotText}>
                  {slot.start} - {slot.end}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteSlot(slot.id)}
                style={styles.deleteButton}
                activeOpacity={0.7}
              >
                <Icon
                  name="trash-outline"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.addSlotContainer}>
            <View style={styles.addSlotInputs}>
              <TextInput
                style={styles.addSlotInput}
                placeholder="8:00"
                value={newSlotStart}
                onChangeText={setNewSlotStart}
                placeholderTextColor={colors.gray}
              />
              <Text variant="body" style={styles.dashText}>
                -
              </Text>
              <TextInput
                style={styles.addSlotInput}
                placeholder="12:00"
                value={newSlotEnd}
                onChangeText={setNewSlotEnd}
                placeholderTextColor={colors.gray}
              />
            </View>
            <TouchableOpacity
              onPress={handleAddSlot}
              style={styles.addSlotButton}
              activeOpacity={0.7}
            >
              <Icon name="add" size={20} color={colors.textPrimary} />
              <Text variant="bodySmall" style={styles.addSlotText}>
                Add slot
              </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Save Button */}
        <Button
          title="Save Availability"
          variant="primary"
          onPress={handleSave}
          style={styles.saveButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: -8,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },
  repeatButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  repeatButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  repeatButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  repeatButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  repeatButtonTextActive: {
    color: colors.white,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    backgroundColor: colors.white,
    minWidth: 60,
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayButtonText: {
    color: colors.primary,
    fontWeight: '500',
  },
  dayButtonTextActive: {
    color: colors.white,
  },
  timeSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  timeSlotInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  timeSlotText: {
    color: colors.textPrimary,
  },
  deleteButton: {
    padding: 8,
  },
  addSlotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  addSlotInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addSlotInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dashText: {
    color: colors.textPrimary,
  },
  addSlotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  addSlotText: {
    color: colors.textPrimary,
  },
  saveButton: {
    marginTop: 8,
    paddingVertical: 14,
  },
});

export default SetAvailabilityScreen;
