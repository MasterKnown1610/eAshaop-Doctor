import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import Text from '../ui/Text';
import { useAuth } from '../../context/AuthContext';
import Context from '../../context/Context';

const ProfileDrawerContent = ({ navigation }) => {
  const { logout } = useAuth();
  const {
    doctors: { doctorProfile },
  } = useContext(Context);
  const [userName, setUserName] = useState('Hari');

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('userData');
        if (!raw) return;
        const userData = JSON.parse(raw);
        const name =
          userData?.user?.full_name ??
          userData?.user?.name ??
          userData?.full_name ??
          userData?.name ??
          userData?.email?.split?.('@')?.[0];
        if (name) setUserName(name);
      } catch (e) {
        // ignore
      }
    };
    loadUser();
  }, []);

  const handleNavigate = screen => {
    navigation.closeDrawer();
    navigation.navigate('Dashboard', { screen });
  };

  const menuItems = [
    {
      id: 'editProfile',
      title: 'Edit Profile',
      icon: 'account-edit-outline',
      onPress: () => handleNavigate('Profile'),
    },
    {
      id: 'payments',
      title: 'Payments',
      icon: 'credit-card-outline',
      onPress: () => {},
    },
    {
      id: 'myAppointments',
      title: 'My Appointments',
      icon: 'calendar-outline',
      onPress: () => handleNavigate('MyAppointments'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell-alert-outline',
      onPress: () => {},
    },
    {
      id: 'privacyPolicy',
      title: 'Privacy & Policy',
      icon: 'file-document-outline',
      onPress: () => handleNavigate('PrivacyPolicy'),
    },
    {
      id: 'helpCenter',
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => handleNavigate('HelpCenter'),
    },
    {
      id: 'reviewsAndRecords',
      title: 'Reviews and Records',
      icon: 'star-outline',
      onPress: () => handleNavigate('ReviewsAndRecords'),
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Icon name="account-outline" size={40} color={colors.primary} />
        </View>
        <View style={styles.profileInfo}>
          <Text variant="h4" style={styles.userName}>
            {doctorProfile?.name ?? userName}
          </Text>
          <TouchableOpacity onPress={() => handleNavigate('Profile')}>
            <Text variant="bodySmall" style={styles.editProfileText}>
              View and edit profile
            </Text>
          </TouchableOpacity>
          <Text variant="caption" style={styles.completedText}>
            10% completed
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <Icon name={item.icon} size={24} color={colors.textPrimary} />
            <Text variant="body" style={styles.menuItemText}>
              {item.title}
            </Text>
            <Icon name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}

        {/* Logout in menu */}
        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Icon name="logout" size={24} color={colors.error} />
          <Text variant="body" style={[styles.menuItemText, styles.logoutText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Logout Button */}
      <SafeAreaView edges={['bottom']} style={styles.bottomLogoutContainer}>
        <TouchableOpacity
          style={styles.bottomLogoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Icon name="logout" size={24} color={colors.white} />
          <Text variant="body" style={styles.bottomLogoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    backgroundColor: colors.grayLight,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  editProfileText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 2,
  },
  completedText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  logoutText: {
    color: colors.error,
  },
  bottomLogoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  bottomLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F87171',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  bottomLogoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});

export default ProfileDrawerContent;
