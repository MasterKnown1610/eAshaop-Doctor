import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../../theme/colors';
import TopBar from '../../components/common/TopBar';
import SearchBar from '../../components/common/SearchBar';
import PromotionSlider from '../../components/common/PromotionSlider';
import DashboardStats from '../../components/common/DashboardStats';
import HomeAppointments from '../../components/common/HomeAppointments';
import BottomNavBar from '../../components/common/BottomNavBar';
import Context from '../../context/Context';
import { useSocketMessages } from '../../context/SocketContext';
import Text from '../../components/ui/Text';
import StartCallButton from '../../components/call/StartCallButton';

const DashboardScreen = ({ navigation }) => {
  const drawerNavigation = useNavigation();
  const [storageValues, setStorageValues] = useState({});
  const { socketMessages, clearMessages: clearSocketMessages } =
    useSocketMessages();
  const {
    categories: { getCategories, categories },
    notifications: { getNotifications },
    bookings: { appointments: appointmentList, getAppointments },
  } = useContext(Context);

  useEffect(() => {
    if (socketMessages?.length > 0) {
      console.log('[Dashboard] Socket messages:', socketMessages.length);
      const hasAppointmentUpdate = socketMessages.some(
        msg => msg.event === 'appointmentUpdated',
      );
      if (hasAppointmentUpdate) {
        getAppointments();
      }
      socketMessages.forEach((msg, i) => {
        console.log(
          `[Dashboard] Message ${i + 1}:`,
          msg.event,
          msg.data,
          msg.timestamp,
        );
      });
    }
  }, [socketMessages]);

  useEffect(() => {
    const getStorageValues = async () => {
      try {
        const keys = await AsyncStorage.getAllKeys();
        const pairs = await AsyncStorage.multiGet(keys);
        const values = {};
        pairs.forEach(([key, value]) => {
          if (value != null) {
            if (key === 'userData') {
              try {
                values[key] = JSON.parse(value);
              } catch {
                values[key] = value;
              }
            } else {
              values[key] = value;
            }
          }
        });
        setStorageValues(values);
      } catch (error) {
        console.error('Error reading AsyncStorage:', error);
      }
    };
    getStorageValues();
  }, []);

  useEffect(() => {
    if (!categories) {
      getCategories();
    }
  }, [categories]);

  useEffect(() => {
    if (!appointmentList) {
      getAppointments();
    }
  }, [appointmentList]);

  const userData = storageValues.userData ?? {};
  const userName = userData?.user?.full_name ?? 'Hari';
  const location = userData?.location ?? userData?.city ?? 'Hyderabad';
  const handleLocationPress = () => {
    console.log('Location pressed');
  };
  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };
  const handleProfilePress = () => {
    drawerNavigation.dispatch(DrawerActions.openDrawer());
  };
  const handleSearch = searchText => {
    console.log('Search:', searchText);
  };

  const promotions = [
    {
      id: 1,
      image: 'https://wallpapercave.com/wp/uA17Icg.jpg',
    },
    {
      id: 2,
      image: 'https://cdn.wallpapersafari.com/54/2/8TKvOf.jpg',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3',
    },
  ];

  const handleServicePress = service => {
    navigation.navigate('Doctors', { service: service.title });
    console.log('Service pressed:', service);
  };

  const handleCategoryPress = category => {
    navigation.navigate('Categories', { selectedCategory: category });
  };

  const handleSeeAllCategories = () => {
    navigation.navigate('Categories');
  };

  const handleAppointmentPress = appointment => {
    console.log('Appointment pressed:', appointment);
  };

  const handleSeeAllAppointments = () => {
    navigation.navigate('MyAppointments');
  };

  // Map appointments for HomeAppointments component
  const mapAppointmentForHome = appointment => ({
    id: appointment?.appointmentId || appointment?._id,
    name: appointment?.userId?.full_name || 'Patient',
    consultationType: appointment?.type || 'Online Consultation',
    time:
      appointment?.startTime && appointment?.endTime
        ? `${appointment.startTime} - ${appointment.endTime}`
        : appointment?.time || '10:30am - 11:00am',
    image:
      appointment?.doctor?.profileImage || appointment?.patientImage || null,
  });

  const totalAppointments = appointmentList
    ? [
        ...(appointmentList?.ongoing?.map(mapAppointmentForHome) || []),
        ...(appointmentList?.upcoming?.map(mapAppointmentForHome) || []),
      ]
    : [];

  const handleTotalAppointmentPress = appointment => {
    console.log('Total appointment pressed:', appointment);
    // Navigate to appointment details if needed
  };

  const handleTabPress = tabId => {
    console.log('Tab pressed:', tabId);
    if (tabId === 'Doctor') {
      navigation.navigate('Doctors');
    } else if (tabId === 'Earnings') {
      navigation.navigate('Earnings');
    } else if (tabId === 'set-availability') {
      navigation.navigate('SetAvailability');
    } else if (tabId === 'Patients') {
      navigation.navigate('Patients');
    }
  };

  // Calculate stats from appointments
  const upcomingCount = appointmentList?.upcoming?.length || 0;
  const patientTodayCount = appointmentList?.onGoing?.length || 0;
  // You can calculate earnings and reviews from your data
  const earnings = 2500; // Replace with actual earnings calculation
  const reviewsCount = 5; // Replace with actual reviews count

  const handleStatsCardPress = cardId => {
    console.log('Stats card pressed:', cardId);
    // Handle navigation based on card type
    if (cardId === 'upcoming') {
      navigation.navigate('MyAppointments');
    } else if (cardId === 'patients') {
      // Navigate to patients screen
    } else if (cardId === 'earnings') {
      navigation.navigate('Earnings');
    } else if (cardId === 'reviews') {
      // Navigate to reviews screen
    }
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.primary }}>
        <StatusBar
          backgroundColor={colors.primary} // Android
          barStyle="light-content"
        />
      </SafeAreaView>
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <StatusBar
          backgroundColor={colors.primary} // Android
          barStyle="light-content" // text color
        />

        <TopBar
          userName={userName}
          location={location}
          onLocationPress={handleLocationPress}
          onNotificationPress={handleNotificationPress}
          onProfilePress={handleProfilePress}
        />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.searchBarContainer}>
            <SearchBar placeholder="Search" onSearch={handleSearch} />
          </View>
          <PromotionSlider promotions={promotions} />
          <DashboardStats
            upcomingAppointments={upcomingCount}
            patientToday={patientTodayCount}
            earningsOverview={earnings}
            newReviews={reviewsCount}
            onCardPress={handleStatsCardPress}
          />
          <View style={styles.callSection}>
            <Text variant="h6" style={styles.callSectionTitle}>
              Video consultation
            </Text>
            <StartCallButton
              navigation={navigation}
              displayName={userName}
              role="doctor"
              doctorId={userData?.user?.id || userData?.doctor?.id}
              patientId={null}
            />
          </View>
          <HomeAppointments
            appointments={totalAppointments}
            onSeeAllPress={handleSeeAllAppointments}
            onAppointmentPress={handleTotalAppointmentPress}
          />
        </ScrollView>
        <BottomNavBar activeTab="Dashboard" onTabPress={handleTabPress} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  callSection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  callSectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  socketSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.surface || '#f5f5f5',
    borderRadius: 8,
  },
  socketSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  socketSectionTitle: {
    fontWeight: '600',
  },
  socketClearText: {
    color: colors.primary,
  },
  socketMessageRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  socketEvent: {
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 2,
  },
  socketData: {
    color: '#666',
    fontSize: 12,
  },
});

export default DashboardScreen;
