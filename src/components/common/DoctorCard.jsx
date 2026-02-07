import React from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';

const DoctorCard = ({doctor, onBookNow, onPress}) => {
  const renderStarRating = (rating) => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.starIcon}>★</Text>
        <Text style={styles.ratingText}>{rating}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.doctorCard}
      onPress={() => onPress && onPress(doctor)}
      activeOpacity={0.9}>
      <Image
        source={{uri: doctor.image}}
        style={styles.doctorImage}
        resizeMode="cover"
      />
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <Text variant="h4" style={styles.doctorName}>
            {doctor.name}
          </Text>
          
        </View>
        <Text variant="bodySmall" style={styles.specialty}>
          {doctor.specialty} <Text variant="bodySmall" style={styles.experience}>
            ({doctor.experience})
          </Text>
        </Text>
        <View style={styles.hospitalRow}>
          <View style={styles.availableDot} />
          <Text variant="caption" style={styles.hospitalText}>
            Works at {doctor.hospital}
          </Text>
        </View>
        <View style={styles.bookButtonContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => onBookNow && onBookNow(doctor)}
          activeOpacity={0.8}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
        <View style={styles.rightSection}>
        {renderStarRating(doctor.rating)}
        <Text variant="bodySmall" style={styles.priceText}>
          {doctor.price}
        </Text>
       </View>
      </View>
      </View>
      
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorImage: {
    width: 100,
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.grayLight,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 4,
  },
  experience: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  specialty: {
    fontSize: 13,
    color: colors.primary,
    marginTop: 2,
  },
  bookButtonContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  availableDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  hospitalText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    paddingLeft: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 18,
    color: '#FFD700',
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default DoctorCard;
