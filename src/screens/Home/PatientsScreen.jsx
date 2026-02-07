import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';
import SearchBar from '../../components/common/SearchBar';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../../context/Context';

const PatientsScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const {
    bookings: { getAppointments, appointments, loadingAppointments },
  } = useContext(Context);

  useEffect(() => {
    getAppointments();
  }, []);

  console.log(appointments, 'this is the appointments');

  // Sample patients data
  const defaultPatients = [
    {
      id: '1',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '2',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '3',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '4',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '5',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '6',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '7',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
    {
      id: '8',
      name: 'Jane',
      age: '32',
      gender: 'Female',
      lastVisit: '11:05:2025',
      image: null,
    },
  ];

  let data = appointments?.past?.map(appointment => ({
    id: appointment?._id,
    name: appointment?.userId?.full_name,
    lastVisit: appointment?.date,
  }));

  // Filter patients based on search
  const filteredPatients = data?.filter(patient => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.age.includes(searchText) ||
      patient.gender.toLowerCase().includes(searchLower)
    );
  });

  const handlePatientPress = patient => {
    // Navigate to patient details or prescription screen
    console.log('Patient pressed:', patient);
    // navigation.navigate('PatientDetails', { patient });
    // Or navigate to Digital Prescription
    navigation.navigate('DigitalPrescription', { patient });
  };

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => handlePatientPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            style={styles.patientImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.patientImagePlaceholder}>
            <Icon name="person" size={32} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* Patient Information */}
      <View style={styles.patientInfo}>
        <Text variant="h6" style={styles.patientName}>
          {item.name}
        </Text>

        <Text variant="bodySmall" style={styles.lastVisit}>
          Last visit: {item.lastVisit}
        </Text>
      </View>

      {/* Chevron Icon */}
      <Icon
        name="chevron-forward"
        size={20}
        color={colors.textSecondary}
        style={styles.chevronIcon}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search Patients"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Patients List */}
      {loadingAppointments ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loaderText}>Loading patients...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPatients}
          renderItem={renderPatientItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No patients found</Text>
            </View>
          }
        />
      )}
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  patientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 1,
  },
  imageContainer: {
    marginRight: 16,
  },
  patientImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.grayLight,
  },
  patientImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    fontSize: 16,
  },
  patientDemographics: {
    color: colors.primary,
    marginBottom: 4,
    fontSize: 13,
  },
  lastVisit: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  chevronIcon: {
    marginLeft: 8,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loaderText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default PatientsScreen;
