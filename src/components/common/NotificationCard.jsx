import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity,Linking} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';
import {useNavigation} from '@react-navigation/native';


const NotificationCard = ({
  doctor,
  message,
  isRead = false,
  onPress,
  link,
}) => {
  const navigation = useNavigation();
  const handleLinkPress = (targetLink) => {
    if (!targetLink) {
      return;
    }

    if (targetLink.includes('appointment')) {
      navigation.navigate('MyAppointments');
      return;
    }

    if (targetLink.startsWith('http://') || targetLink.startsWith('https://')) {
      Linking.openURL(targetLink).catch((error) =>
        console.error('Failed to open link:', error)
      );
    }
  };
  const imageSource = doctor?.image
    ? typeof doctor.image === 'string'
      ? {uri: doctor.image}
      : doctor.image
    : require('../../assets/login/logo.png');

  return (
    <TouchableOpacity
      style={[styles.container, isRead && styles.containerRead]}
      onPress={onPress}
      activeOpacity={0.7}>
      <Image
        source={imageSource}
        style={styles.doctorImage}
        resizeMode="cover"
      />
      <View style={styles.contentContainer}>
        <Text variant="body" style={[styles.message, isRead && styles.messageRead]}>
          {message}{' '}
          {link ? (
            <Text variant="body" style={styles.link} onPress={() => handleLinkPress(link)}>
              Click here
            </Text>
          ) : null}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  containerRead: {
    borderColor: colors.grayLight,
  },
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayLight,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 12,
  },
  message: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  messageRead: {
    color: colors.textSecondary,
  },
  link: {
    color: colors.primary,
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default NotificationCard;
