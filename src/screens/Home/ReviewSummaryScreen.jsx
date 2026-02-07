import React, {useState, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import SuccessModal from '../../components/ui/SuccessModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import toast from '../../utils/toast';
import Context from '../../context/Context';

const ReviewSummaryScreen = ({route, navigation}) => {
  const {doctor, selectedDate, selectedTime, patient, selectedTab} = route.params;
  const {bookings: {bookAppointment, loadingBookAppointment}} = useContext(Context);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleProceed = async () => {
    const userId = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(userId);
    console.log(userData, "this is the userId");
    const payload = {
      userId: userData?.user?.id,
      doctorId: doctor?._id,
      date: selectedDate,
      time: selectedTime?.start,
      type: selectedTab,
      amount: doctor?.consultationFee,
      dependent: {
        name: patient?.full_name,
        age: calculateAge(),
        sex: patient?.gender,
      }
  }
  
  const response = await bookAppointment(payload);
  
  if(response?.status >= 200 && response?.status < 300) {
    setShowSuccessModal(true);
  } else {
    toast.error("Failed to book appointment");
  }
 
  };





  const handleDone = () => {
    setShowSuccessModal(false);
    
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'DashboardMain'}],
      })
    );
  };

  const handleCancel = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    navigation.goBack();
  };

  // Format the date display
  const getDateDisplay = () => {
    if (!selectedDate) {
      return '';
    }

    if (selectedDate instanceof Date) {
      return selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    const parts = String(selectedDate).split('-');
    if (parts.length !== 3) {
      return String(selectedDate);
    }

    const [year, month, day] = parts.map(Number);
    if ([year, month, day].some(Number.isNaN)) {
      return String(selectedDate);
    }

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateAge = () => {
    if (!patient) {
      return '-';
    }

    const dobValue = patient?.dob;
    if (!dobValue) {
      return patient?.age ?? '-';
    }

    const birthDate = new Date(dobValue);
    if (Number.isNaN(birthDate.getTime())) {
      return patient?.age ?? '-';
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }

    return Math.max(age, 0);
  };


  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Doctor Info */}
        <View style={styles.doctorCard}>
          <Image
            source={{uri: doctor?.profileImage}}
            style={styles.doctorImage}
            resizeMode="cover"
          />
          <View style={styles.doctorInfo}>
            <Text variant="h4" style={styles.doctorName}>
              {doctor?.name}
            </Text>
            <Text variant="bodySmall" style={styles.specialty}>
              {doctor?.speciality}
            </Text>
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Patient details
          </Text>
          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>
              Name
            </Text>
            <Text variant="body" style={styles.infoColon}>:</Text>
            <Text variant="body" style={styles.infoValue}>
              {patient?.full_name ||'-'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>
              Age
            </Text>
            <Text variant="body" style={styles.infoColon}>:</Text>
            <Text variant="body" style={styles.infoValue}>
              {calculateAge()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text variant="body" style={styles.infoLabel}>
              Sex
            </Text>
            <Text variant="body" style={styles.infoColon}>:</Text>
            <Text variant="body" style={styles.infoValue}>
              {patient?.sex || patient?.gender || '-'}
            </Text>
          </View>
        </View>

        {/* Scheduled Appointment */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Scheduled Appointment
          </Text>
          <Text variant="body" style={styles.appointmentTime}>
            {selectedTime?.start} - {selectedTime?.end}
          </Text>
          <Text variant="body" style={styles.appointmentDate}>
            {getDateDisplay()}
          </Text>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text variant="h4" style={styles.sectionTitle}>
            Payment Method
          </Text>
          <Text variant="body" style={styles.paymentMethod}>
            PhonePe
          </Text>
        </View>

        {/* Amount Details */}
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text variant="body" style={styles.amountLabel}>
              Amount
            </Text>
            <Text variant="body" style={styles.amountColon}>:</Text>
            <Text variant="body" style={styles.amountValue}>
              ₹{doctor?.consultationFee}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text variant="h4" style={styles.totalLabel}>
              Total
            </Text>
            <Text variant="body" style={styles.amountColon}>:</Text>
            <Text variant="h4" style={styles.totalValue}>
            ₹{doctor?.consultationFee}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.bottomButtonsContainer}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={handleCancel}
          style={styles.cancelButton}
          textStyle={styles.cancelButtonText}
        />
        <Button
          title="Pay at Clinic"
          variant="primary"
          onPress={handleProceed}
          loading={loadingBookAppointment}
          style={styles.proceedButton}
          textStyle={styles.proceedButtonText}
        />
      </View>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onDone={handleDone}
        title="Thank You"
        message="Your Appointment Successfull"
        buttonText="Done"
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
        message="Are you sure want to cancel?"
        confirmText="Yes"
        cancelText="No"
      />
    </View>
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
    paddingBottom: 120,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: colors.grayLight,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    width: 60,
  },
  infoColon: {
    fontSize: 14,
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  appointmentTime: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  appointmentDate: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  paymentMethod: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  amountSection: {
    marginTop: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    width: 60,
  },
  amountColon: {
    fontSize: 14,
    color: colors.textPrimary,
    marginHorizontal: 8,
  },
  amountValue: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 60,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  proceedButton: {
    flex: 1,
  },
  proceedButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default ReviewSummaryScreen;
