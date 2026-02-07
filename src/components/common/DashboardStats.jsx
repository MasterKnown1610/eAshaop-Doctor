import React from 'react';
import {View, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';
import GroupIcon from './icons/GroupIcon';
import PeopleIcon from './icons/PeopleIcon';
import MoneysIcon from './icons/MoneysIcon';
import StarIcon from './icons/StarIcon';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 48 - CARD_MARGIN) / 2; // 24px padding each side, minus margin between cards

const DashboardStats = ({
  upcomingAppointments = 5,
  patientToday = 5,
  earningsOverview = 2500,
  newReviews = 5,
  onCardPress,
}) => {
  const stats = [
    {
      id: 'upcoming',
      title: 'Upcoming Appointments',
      value: upcomingAppointments.toString(),
      icon: GroupIcon,
    },
    {
      id: 'patients',
      title: 'Patient Today',
      value: patientToday.toString(),
      icon: PeopleIcon,
    },
    {
      id: 'earnings',
      title: 'Earnings Overview',
      value: `₹${earningsOverview.toLocaleString()}`,
      icon: MoneysIcon,
    },
    {
      id: 'reviews',
      title: 'New Reviews',
      value: newReviews.toString(),
      icon: StarIcon,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <TouchableOpacity
              key={stat.id}
              style={[
                styles.card,
                index % 2 === 0 && styles.cardLeft,
                index % 2 === 1 && styles.cardRight,
                index < 2 && styles.cardTop,
                index >= 2 && styles.cardBottom,
              ]}
              onPress={() => onCardPress && onCardPress(stat.id)}
              activeOpacity={0.7}>
              <View style={styles.iconContainer}>
                <IconComponent color={colors.primary} size={24} />
              </View>
              <Text variant="bodySmall" style={styles.title}>
                {stat.title}
              </Text>
              <Text variant="h4" style={styles.value}>
                {stat.value}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CARD_MARGIN,
  },
  cardLeft: {
    marginRight: CARD_MARGIN / 2,
  },
  cardRight: {
    marginLeft: CARD_MARGIN / 2,
  },
  cardTop: {
    marginBottom: CARD_MARGIN,
  },
  cardBottom: {
    marginBottom: 0,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default DashboardStats;
