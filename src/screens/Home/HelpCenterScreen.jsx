/**
 * Help Center Screen
 * Displays contact information and support options.
 */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';

const HelpCenterScreen = ({ navigation }) => {
  const handlePhonePress = () => {
    Linking.openURL(`tel:7369070327`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Contact Us
            </Text>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handlePhonePress}
              activeOpacity={0.7}
            >
              <Icon name="phone-outline" size={24} color={colors.textPrimary} />
              <Text variant="body" style={styles.contactText}>
                7369070327
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 32,
  },
  content: {
    padding: 20,
  },
  section: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
    fontSize: 18,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 4,
  },
  contactText: {
    marginLeft: 12,
    color: colors.textPrimary,
    fontSize: 16,
  },
});

export default HelpCenterScreen;
