import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';
import Button from '../ui/Button';

const AppointmentCard = ({
  doctor,
  appointmentTime,
  onCancelPress,
  onActionPress,
  actionButtonTitle = 'Join',
  showReschedule = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Doctor Info */}
      <View style={styles.doctorInfo}>
        <Image
          source={{uri: doctor.image}}
          style={styles.doctorImage}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text variant="h4" style={styles.doctorName}>
            {doctor.name}
          </Text>
          <Text variant="bodySmall" style={styles.specialty}>
            {doctor.specialty} <Text variant="body" style={styles.experience}>
            {doctor.experience}
          </Text>
          </Text>
          
          <Text variant="bodySmall" style={styles.appointmentTime}>
            {appointmentTime}
          </Text>
        </View>
      </View>

     
      <View style={styles.buttonsContainer}>
        <Button
          title="Cancel"
          variant="primary"
          onPress={onCancelPress}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
        <Button
          title={showReschedule ? 'Reschedule' : actionButtonTitle}
          variant="primary"
          onPress={onActionPress}
          style={styles.actionButton}
          textStyle={styles.actionButtonText}
        />
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
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 4,
  },
  appointmentTime: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    minHeight: 36,
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    minHeight: 36,
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
});

export default AppointmentCard;
