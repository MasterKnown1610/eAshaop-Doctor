/**
 * Reusable "Start Call" button.
 * Generates room ID (or uses backend) and navigates to CallScreen with roomId, displayName, role.
 */
import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../ui/Text';
import { colors } from '../../theme/colors';
import { generateRoomId } from '../../utils/callUtils';

const ROLE_DOCTOR = 'doctor';
const ROLE_PATIENT = 'patient';

/**
 * @param {object} props
 * @param {function} props.navigation - React Navigation navigation object
 * @param {string} props.displayName - User display name in the call
 * @param {'doctor'|'patient'} props.role - Role for UI/config
 * @param {string} [props.doctorId] - For room ID generation
 * @param {string} [props.patientId] - For room ID generation
 * @param {string} [props.roomId] - If provided, skip generation (e.g. from backend)
 * @param {string} [props.appointmentId] - Optional: fetch room from backend (stub)
 * @param {boolean} [props.disabled]
 * @param {boolean} [props.loading]
 * @param {object} [props.style]
 */
const StartCallButton = ({
  navigation,
  displayName,
  role = ROLE_DOCTOR,
  doctorId,
  patientId,
  roomId: roomIdProp,
  appointmentId,
  disabled = false,
  loading = false,
  style,
}) => {
  const handlePress = async () => {
    if (disabled || loading) return;
    let roomId = roomIdProp;
    if (!roomId) {
      // TODO: If appointmentId, call fetchRoomIdFromBackend(appointmentId) and use returned roomId
      roomId = generateRoomId(doctorId, patientId);
    }
    navigation.navigate('Call', {
      roomId,
      displayName: displayName || (role === ROLE_DOCTOR ? 'Doctor' : 'Patient'),
      role,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.button, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          <Icon name="video" size={22} color={colors.white} style={styles.icon} />
          <Text variant="body" style={styles.label}>
            Start Call
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minHeight: 48,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default StartCallButton;
export { ROLE_DOCTOR, ROLE_PATIENT };
