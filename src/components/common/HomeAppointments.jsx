import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors } from '../../theme/colors';
import Text from '../ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';

const HomeAppointments = ({
  appointments = [],
  onSeeAllPress,
  onAppointmentPress,
}) => {
  // Default sample data if no appointments provided
  const defaultAppointments = [
    {
      id: '1',
      name: 'Miller',
      consultationType: 'Online Consultation',
      time: '10:30am - 11:00am',
      image: null, // You can add default image URI here
    },
    {
      id: '2',
      name: 'Miller',
      consultationType: 'Online Consultation',
      time: '10:30am - 11:00am',
      image: null,
    },
    {
      id: '3',
      name: 'Miller',
      consultationType: 'Online Consultation',
      time: '10:30am - 11:00am',
      image: null,
    },
    {
      id: '4',
      name: 'Miller',
      consultationType: 'Online Consultation',
      time: '10:30am - 11:00am',
      image: null,
    },
  ];

  const displayAppointments =
    appointments.length > 0 ? appointments : defaultAppointments;

  const renderAppointmentCard = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      style={styles.appointmentCard}
      onPress={() => onAppointmentPress && onAppointmentPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <Icon name="person" size={24} color={colors.textSecondary} />
            </View>
          )}
        </View>

        {/* Name and Consultation Type */}
        <View style={styles.infoContainer}>
          <Text variant="h6" style={styles.name}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={styles.consultationType}>
            {item.consultationType}
          </Text>
        </View>

        {/* Time with Clock Icon */}
        <View style={styles.timeContainer}>
          <Icon
            name="time-outline"
            size={18}
            color={colors.textPrimary}
            style={styles.clockIcon}
          />
          <Text variant="body" style={styles.timeText}>
            {item.time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="h5" style={styles.title}>
          Total Appointments
        </Text>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
          <Text variant="bodySmall" style={styles.seeAllText}>
            See all
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <FlatList
        data={displayAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '500',
  },
  appointmentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayLight,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  consultationType: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    marginRight: 6,
  },
  timeText: {
    color: colors.textPrimary,
    fontWeight: '500',
    fontSize: 14,
  },
});

export default HomeAppointments;
