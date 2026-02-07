import React from 'react';
import { View, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../theme/colors';
import Text from '../ui/Text';
import DashboardIcon from './icons/DashboardIcon';
import DoctorIcon from './icons/DoctorIcon';
import VanIcon from './icons/VanIcon';
import LabIcon from './icons/LabIcon';
import CalenderIcon from './icons/CalendarIcon';
import UserIcon from './icons/UserIcon';
import MoneyIcon from './icons/MoneyIcon';

const BottomNavBar = ({ activeTab = 'Dashboard', onTabPress, style }) => {
  const tabs = [
    {
      id: 'Dashboard',
      label: 'Dashboard',
      icon: DashboardIcon,
      isActive: activeTab === 'Dashboard',
    },
    {
      id: 'set-availability',
      label: 'Set Availability',
      icon: CalenderIcon,
      isActive: activeTab === 'set-availability',
    },
    {
      id: 'Patients',
      label: 'Patients',
      icon: UserIcon,
      isActive: activeTab === 'Patients',
    },
    {
      id: 'Earnings',
      label: 'Earnings',
      icon: MoneyIcon,
      isActive: activeTab === 'Earnings',
    },
  ];

  const handleTabPress = tabId => {
    if (onTabPress) {
      onTabPress(tabId);
    }
  };

  return (
    <View style={styles.navBar}>
      {tabs.map(tab => {
        const IconComponent = tab.icon;
        const iconColor = tab.isActive ? colors.primary : colors.textPrimary;
        const textColor = tab.isActive ? colors.primary : colors.textPrimary;

        // Get appropriate icon size based on tab
        const getIconSize = () => {
          if (tab.id === 'Dashboard') return 16;
          if (tab.id === 'Doctor') return 20;
          if (tab.id === 'MedicalDelivery') return 20;
          if (tab.id === 'Lab') return 18;
          return 18;
        };

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => handleTabPress(tab.id)}
            activeOpacity={0.7}
          >
            {IconComponent && (
              <IconComponent color={iconColor} size={getIconSize()} />
            )}
            <Text
              variant="caption"
              color={textColor}
              style={[styles.tabLabel, tab.isActive && styles.tabLabelActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    marginHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: colors.white2,
    minHeight: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    minHeight: 60,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '600',
  },
});

export default BottomNavBar;
