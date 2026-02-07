/**
 * Privacy & Policy Screen
 * Displays privacy policy and terms of service content.
 */
import React from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text variant="h4" style={styles.title}>
            Privacy Policy for Doctors
          </Text>
          <Text variant="bodySmall" style={styles.lastUpdated}>
            Last updated: January 2026
          </Text>

          <View style={styles.section}>
            <Text variant="body" style={styles.sectionText}>
              When you register as a doctor on our app, we collect certain
              information about you to create your profile and help patients
              connect with you. This includes your personal details such as
              name, phone number, email address, qualifications, specialization,
              registration number, clinic or hospital details, availability
              schedule, and payment information for settlements. We may also
              store communication records, consultation notes, prescriptions you
              issue, and any media shared during video or chat consultations.
              Technical information like device identifiers, IP address, and
              usage patterns may also be collected for security and support.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Use of Data
            </Text>
            <Text variant="body" style={styles.sectionText}>
              This information is used only to provide and improve the services
              offered through the app. It helps us:
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Show your profile to patients
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Manage appointments & consultations
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Process payments
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Support prescriptions, labs, or pharmacy requests
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Send reminders & important updates
            </Text>
            <Text variant="body" style={styles.sectionText}>
              We may also use the data to send you important updates, reminders,
              or notifications about your practice.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Sharing of Data
            </Text>
            <Text variant="body" style={styles.sectionText}>
              Information is shared only with patients who book consultations
              with you, payment partners for settlements, and labs or pharmacies
              if required for fulfilling a patient's request. It is never sold
              to advertisers, and it is disclosed only with your consent or when
              required by law.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Security
            </Text>
            <Text variant="body" style={styles.sectionText}>
              We protect your data with strict security measures. All sensitive
              information is encrypted during transfer and securely stored. Only
              authorized staff and patients consulting you can access relevant
              information. At the same time, you are responsible for keeping
              your login credentials safe and ensuring that patient data you
              handle through the app is treated with confidentiality and
              professional care.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Your Rights
            </Text>
            <Text variant="body" style={styles.sectionText}>
              As a registered doctor, you have rights to access, update, or
              correct your personal and professional details stored with us. You
              may also request closure of your account and deletion of related
              data, except where records must be retained for legal or
              compliance reasons. If you wish to stop using certain optional
              features, you may withdraw your consent for those services. We
              retain your records only as long as necessary for service purposes
              or as per applicable laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Your Responsibilities
            </Text>
            <Text variant="body" style={styles.sectionText}>
              By using the app as a doctor, you agree to the terms of service.
              You confirm that the information you provide, including your
              registration details and qualifications, is true and valid. You
              agree to use the app responsibly, provide genuine medical advice,
              and follow all professional and legal obligations under applicable
              laws and medical council guidelines. You also understand that the
              platform serves only as a medium to connect you with patients, and
              you remain solely responsible for the advice, prescriptions, or
              treatment you provide.
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Provide accurate registration and qualification details
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • Offer genuine medical advice following legal & professional
              guidelines
            </Text>
            <Text variant="body" style={styles.bulletPoint}>
              • You remain responsible for treatment, advice, and prescriptions
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Payments & Liability
            </Text>
            <Text variant="body" style={styles.sectionText}>
              Payments for your consultations will be processed through secure
              gateways, and settlements will follow the timelines and policies
              defined by the platform. While we make every effort to ensure
              smooth and secure operations, we are not responsible for issues
              beyond our control such as internet disruptions, delays in
              settlements caused by third parties, or misuse of the app by
              patients.
            </Text>
          </View>

          <View style={styles.section}>
            <Text variant="h6" style={styles.sectionTitle}>
              Ownership & Terms
            </Text>
            <Text variant="body" style={styles.sectionText}>
              All content, design, and features of the app belong to us, and you
              may not copy or misuse them. The terms are governed by the laws of
              India, and any disputes will fall under the jurisdiction of the
              courts where the company is registered.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  title: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  lastUpdated: {
    color: colors.textSecondary,
    marginBottom: 24,
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    fontSize: 16,
  },
  sectionText: {
    color: colors.textPrimary,
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletPoint: {
    color: colors.textPrimary,
    lineHeight: 22,
    marginLeft: 8,
    marginBottom: 4,
  },
  contactInfo: {
    color: colors.primary,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default PrivacyPolicyScreen;
