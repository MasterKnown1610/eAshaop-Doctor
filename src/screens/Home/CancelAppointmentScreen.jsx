import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';

const CANCEL_REASONS = [
  'I want to change to another doctor',
  'I want to change package',
  "I don't want to consult",
  'I have recovered from the disease',
  'it is too far',
  'I just want to cancel',
  "I don't want to tell",
  'Others',
];

const CancelAppointmentScreen = ({route, navigation}) => {
  const {appointment} = route.params || {};
  const [selectedReason, setSelectedReason] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleCancel = () => {
    if (!selectedReason) {
      // You can show an error toast here
      return;
    }
    // Handle cancel appointment logic
    console.log('Cancelled appointment:', appointment?.id, 'Reason:', selectedReason);
    // Show success modal
    setShowSuccessModal(true);
  };

  const handleModalDone = () => {
    setShowSuccessModal(false);
    // Navigate back after showing success
    navigation.goBack();
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    // Navigate back if user closes modal
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom', 'top']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Reason for Schedule Change Section */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Reason for Schedule Change
          </Text>

          <View style={styles.reasonsContainer}>
            {CANCEL_REASONS.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonOption}
                onPress={() => setSelectedReason(reason)}
                activeOpacity={0.7}>
                <Text variant="body" style={styles.reasonText}>
                  {reason}
                </Text>
                <View
                  style={[
                    styles.radioButton,
                    selectedReason === reason && styles.radioButtonActive,
                  ]}>
                  {selectedReason === reason && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Information Section */}
        <View style={styles.infoSection}>
          <Text variant="bodySmall" style={styles.infoText}>
            We value your trust and are committed to protecting your personal
            information. When you request a cancellation, we only collect and
            process the necessary details to verify your identity and complete
            the process securely. Your data will not be shared with third
            parties, except as required by law or for completing the cancellation
            request.
          </Text>
          <Text variant="bodySmall" style={[styles.infoText, styles.infoTextMargin]}>
            Once the cancellation is confirmed, only the information needed for
            legal, accounting, or regulatory purposes will be retained; all
            other personal details will be securely deleted in accordance with
            our data retention policy.
          </Text>
          <Text variant="bodySmall" style={[styles.infoText, styles.infoTextMargin]}>
            We ensure that the entire cancellation process is transparent,
            secure, and handled with the utmost confidentiality.
          </Text>
        </View>
      </ScrollView>

      {/* Cancel Button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          variant="primary"
          onPress={handleCancel}
          disabled={!selectedReason}
          style={styles.cancelButton}
        />
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={handleModalClose}
        onDone={handleModalDone}
        title="Appointment Cancelled"
        message="Your appointment has been cancelled successfully"
        buttonText="Done"
        iconName="check-circle"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  reasonsContainer: {
    gap: 12,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  reasonText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  infoTextMargin: {
    marginTop: 16,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelButton: {
    width: '100%',
  },
});

export default CancelAppointmentScreen;
