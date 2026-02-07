import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';
import SearchBar from '../../components/common/SearchBar';
import AppointmentCardNew from '../../components/common/AppointmentCardNew';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import Context from '../../context/Context';

const MyAppointmentsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const {
    bookings: {
      appointments: appointmentList,
      loadingAppointments,
      getAppointments,
    },
  } = useContext(Context);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample appointments data

  useEffect(() => {
    getAppointments();
  }, []);

  const handleSearch = text => {
    setSearchText(text);
  };

  const handleCancelAppointment = appointment => {
    navigation.navigate('CancelAppointment', {
      appointment: appointment,
    });
  };

  const handleJoin = appointment => {
    // Handle join video call
    console.log('Join appointment:', appointment);
  };

  const handleAttend = appointment => {
    // Handle attend appointment
    console.log('Attend appointment:', appointment);
    handleJoin(appointment);
  };

  const getDateDisplay = selectedDate => {
    if (!selectedDate) return '';

    const date =
      selectedDate instanceof Date ? selectedDate : new Date(selectedDate);

    if (isNaN(date.getTime())) {
      return String(selectedDate);
    }

    // Format as "2-9-2025"
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = time => {
    if (!time) return '10:30am - 5:30pm';
    // If time is already formatted, return as is
    if (time.includes('-')) return time;
    // Otherwise format it
    return time;
  };

  const handleReschedule = appointment => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    const doctor = selectedAppointment?.doctor;
    setShowRescheduleModal(false);
    setSelectedAppointment(null);

    // Navigate to doctor details screen for rescheduling
    if (doctor) {
      navigation.navigate('DoctorDetails', {
        doctor: {
          ...doctor,
          rating: 4.5,
          price: '₹1000/hr',
          hospital: 'Apollo Hospital',
        },
      });
    }
  };

  const tabs = [
    { id: 'ongoing', label: 'ongoing' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
  ];

  // Filter appointments based on active tab
  const getFilteredAppointments = () => {
    if (!appointmentList) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'ongoing':
        return (
          appointmentList?.onGoing?.filter(apt => {
            const aptDate = new Date(apt.date);
            aptDate.setHours(0, 0, 0, 0);
            return aptDate.getTime() === today.getTime();
          }) || []
        );
      case 'upcoming':
        return appointmentList?.upcoming || [];
      case 'past':
        return appointmentList?.completed || appointmentList?.past || [];
      default:
        return appointmentList?.ongoing || [];
    }
  };

  const AppointmentList = getFilteredAppointments();

  // Filter by search text
  const filteredAppointments = AppointmentList.filter(appointment => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const patientName =
      appointment?.userId?.full_name || appointment?.doctor?.name || '';

    return patientName.toLowerCase().includes(searchLower);
  });

  if (loadingAppointments) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search Appointments"
          value={searchText}
          onChangeText={setSearchText}
          onSearch={handleSearch}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                variant="bodySmall"
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Appointments List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAppointments?.length > 0 ? (
          filteredAppointments.map((appointment, index) => {
            // Map appointment data to patient format
            const patient = {
              name: appointment?.userId?.full_name || 'Patient',
              age: appointment?.patient?.age || '32',
              gender: appointment?.patient?.gender || 'Female',
              image:
                appointment?.patient?.image ||
                appointment?.doctor?.profileImage ||
                null,
              healthCondition:
                appointment?.healthCondition ||
                appointment?.reason ||
                'Health condition',
            };

            const appointmentData = {
              status: appointment?.status || 'Confirmed',
              time: appointment?.time,
              date: getDateDisplay(appointment?.date),
              consultationType:
                appointment?.type === 'video'
                  ? 'Video Call'
                  : appointment?.type === 'clinic'
                  ? 'Clinic Visit'
                  : 'Home Visit',
            };

            return (
              <AppointmentCardNew
                key={appointment?._id || appointment?.appointmentId || index}
                patient={patient}
                appointment={appointmentData}
                onReschedule={() => handleReschedule(appointment)}
                onCancel={() => handleCancelAppointment(appointment)}
                onAttend={() => handleAttend(appointment)}
              />
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments found</Text>
          </View>
        )}
      </ScrollView>

      {/* Reschedule Confirmation Modal */}
      <ConfirmationModal
        visible={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        onConfirm={handleConfirmReschedule}
        message="Are you sure want to reschedule this appointment?"
        confirmText="Yes"
        cancelText="No"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: colors.white2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default MyAppointmentsScreen;
