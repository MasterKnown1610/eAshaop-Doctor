import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';

const TopBar = ({
  userName = 'Hari',
  userImage,
  location = 'Hyderabad',
  onLocationPress,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
        <View style={styles.leftSection}>
          <TouchableOpacity
            onPress={onProfilePress}
            style={styles.profileContainer}>
            {userImage ? (
              <Image source={userImage} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Icon name="person" size={24} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.greetingContainer}>
            <Text variant="bodySmall" color={colors.white} style={styles.hiText}>
              Hi {userName}!
            </Text>
            
            <TouchableOpacity
              onPress={onLocationPress}
              style={styles.locationContainer}
              activeOpacity={0.7}>
              {/* <Icon
                name="location-outline"
                size={16}
                color={colors.white}
                style={styles.locationIcon}
              /> */}
              <Text variant="bodySmall" color={colors.white} style={styles.locationText}>
                {location}
              </Text>
              <Icon
                name="chevron-down"
                size={16}
                color={colors.white}
                style={styles.dropdownIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Right Section - Notification Bell */}
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.notificationButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="notifications-outline" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop:Platform.OS === 'ios' ? 0: 0,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  profileContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.white,
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  greetingContainer: {
    flex: 1,
  },
  hiText: {
    // marginBottom: 4,
    fontWeight: '600',
    fontSize: 16,
    opacity: 0.9,
  },
  titleText: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    marginRight: 4,
  },
  dropdownIcon: {
    marginLeft: 2,
  },
  notificationButton: {
    padding: 4,
    marginTop: 4,
  },
});

export default TopBar;
