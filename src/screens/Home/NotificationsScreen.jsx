import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import NotificationCard from '../../components/common/NotificationCard';
import Context from '../../context/Context';

const NotificationsScreen = ({navigation}) => {
  const {notifications: {notifications: notificationList, getNotifications, markAsRead}} = useContext(Context);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      await getNotifications();
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (Array.isArray(notificationList)) {
      setNotifications(notificationList);
    }
  }, [notificationList]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await getNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === notification._id ? {...n, isRead: true} : n
      )
    );
    await markAsRead(notification?._id);
  };

  const formatMessage = (notification) => {
    const messageText = notification?.message?.text ?? '';
    const messageLink = notification?.message?.link;
    return messageLink ? `${messageText}` : messageText;
  };
 
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  console.log(notifications,notificationList, "this is the notifications");

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }>
        {notifications.map((notification, index) => {
          const doctor = {
            image:
              notification?.doctor?.profileImage ||
              notification?.doctor?.image ||
              null,
          };
          return (
            <NotificationCard
              key={notification?._id ?? index}
              doctor={doctor}
              link={notification?.message?.link || ""}
              message={formatMessage(notification)}
              isRead={notification?.isRead}
              onPress={() => handleNotificationPress(notification)}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationsScreen;
