import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import Text from '../ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';

const AppointmentCardNew = ({
  patient,
  appointment,
  onReschedule,
  onCancel,
  onAttend,
}) => {
  const {
    name = 'Jane',
    age = '32',
    gender = 'Female',
    image = null,
    healthCondition = 'Health condition',
  } = patient || {};

  const {
    status = 'Confirmed',
    time = '10:30am - 5:30pm',
    date = '2-9-2025',
    consultationType = 'Video Call',
  } = appointment || {};

  return (
    <View style={styles.container}>
      {/* Top Section - Patient Info & Appointment Details */}
      <View style={styles.topSection}>
        {/* Left Side - Patient Info */}
        <View style={styles.patientInfo}>
          {image ? (
            <Image source={{ uri: image }} style={styles.patientImage} />
          ) : (
            <View style={styles.patientImagePlaceholder}>
              <Icon name="person" size={32} color={colors.textSecondary} />
            </View>
          )}
          <View>
            <Text variant="h6" style={styles.patientName}>
              {name}
            </Text>
            {/* <Text variant="bodySmall" style={styles.patientDetails}>
              {age} years, {gender}
            </Text>
            <Text variant="bodySmall" style={styles.healthCondition}>
              {healthCondition}
            </Text> */}
          </View>
        </View>

        {/* Right Side - Appointment Details */}
        <View style={styles.appointmentDetails}>
          <Text variant="bodySmall" style={styles.status}>
            {status}
          </Text>

          <View style={styles.detailRow}>
            <Icon name="time-outline" size={16} color={colors.textPrimary} />
            <Text variant="bodySmall" style={styles.detailText}>
              {time}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Icon
              name="calendar-outline"
              size={16}
              color={colors.textPrimary}
            />
            <Text variant="bodySmall" style={styles.detailText}>
              {date}
            </Text>
          </View>
        </View>
      </View>

      {/* Middle Section - Consultation Type */}
      <View style={styles.consultationSection}>
        <Icon name="videocam-outline" size={16} color={colors.textPrimary} />
        <Text variant="bodySmall" style={styles.consultationText}>
          {consultationType}
        </Text>
      </View>

      {/* Bottom Section - Action Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.rescheduleButton}
          onPress={onReschedule}
          activeOpacity={0.7}
        >
          <Icon name="refresh-outline" size={18} color={colors.primary} />
          <Text variant="bodySmall" style={styles.rescheduleText}>
            Reschedule
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          activeOpacity={0.7}
        >
          <Icon name="close-outline" size={18} color={colors.primary} />
          <Text variant="bodySmall" style={styles.cancelText}>
            Cancel
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={styles.attendButton}
          onPress={onAttend}
          activeOpacity={0.7}
        >
          <Icon name="play-outline" size={18} color={colors.white} />
          <Text variant="bodySmall" style={styles.attendText}>
            Attend
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 16,
    flex: 0.4,
  },
  patientImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.grayLight,
    marginBottom: 8,
  },
  patientImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  patientName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 10,
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 16,
  },
  patientDetails: {
    color: colors.primary,
    marginBottom: 4,
    textAlign: 'center',
    fontSize: 13,
  },
  healthCondition: {
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 13,
  },
  appointmentDetails: {
    flex: 0.6,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  status: {
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  detailText: {
    color: colors.textPrimary,
    marginLeft: 8,
    fontSize: 13,
  },
  consultationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 0,
  },
  consultationText: {
    color: colors.textPrimary,
    marginLeft: 8,
    fontSize: 13,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  rescheduleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  rescheduleText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  cancelText: {
    color: colors.primary,
    fontWeight: '500',
    fontSize: 13,
  },
  attendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  attendText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
});

export default AppointmentCardNew;
