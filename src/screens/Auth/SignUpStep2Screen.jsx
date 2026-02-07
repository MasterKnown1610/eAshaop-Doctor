import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Text from '../../components/ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import DocumentUpload from '../../components/ui/DocumentUpload';
import toast from '../../utils/toast';
import Context from '../../context/Context';

const SignUpStep2Screen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const signUpData = route.params?.signUpData || {};
  const {
    login: { registerDoctor },
  } = useContext(Context);

  const [medicalLicense, setMedicalLicense] = useState(null);
  const [governmentId, setGovernmentId] = useState(null);
  const [qualificationCertificates, setQualificationCertificates] =
    useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!medicalLicense) {
      newErrors.medicalLicense = 'Medical License is required';
    }
    if (!governmentId) {
      newErrors.governmentId = 'Government ID Proof is required';
    }
    if (!qualificationCertificates) {
      newErrors.qualificationCertificates =
        'Qualification Certificates are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createFormData = () => {
    const formData = new FormData();

    // Map Step 1 text fields to API field names
    formData.append('name', signUpData.first_name || '');
    formData.append('age', signUpData.age || '');
    formData.append(
      'hospitalLocation',
      signUpData.hospital_clinic_address || '',
    );
    formData.append('hospitalName', signUpData.hospital_clinic_name || '');
    formData.append('education', signUpData.qualification || '');
    formData.append('university', signUpData.university || '');
    formData.append('experience', signUpData.years_of_experience || '');
    formData.append('areaOfInterest', signUpData.areas_of_expertise || '');
    formData.append('speciality', signUpData.speciality || '');

    // categoryUuid - if available in signUpData, otherwise use speciality as fallback
    if (signUpData.categoryUuid) {
      formData.append('categoryUuid', signUpData.categoryUuid);
    }

    formData.append('consultationFee', signUpData.consultation_fee || '');
    formData.append('gender', signUpData.gender || '');
    formData.append('consultationMode', signUpData.consultant_mode || '');

    // Mobile - ensure it includes country code if not already present
    let mobileNumber = signUpData.phone_number || '';
    if (mobileNumber && !mobileNumber.startsWith('+')) {
      // Add +91 for India if not present (adjust based on your default country)
      mobileNumber = `+91${mobileNumber}`;
    }
    formData.append('mobile', mobileNumber);

    formData.append('email', signUpData.email || '');
    formData.append('about', signUpData.description || '');

    // Languages - convert array to comma-separated string
    const languagesString = Array.isArray(signUpData.languages)
      ? signUpData.languages
          .map(lang => {
            // Map language IDs to proper names if needed
            const languageMap = {
              english: 'English',
              hindi: 'Hindi',
              telugu: 'Telugu',
              tamil: 'Tamil',
              kannada: 'Kannada',
            };
            return languageMap[lang] || lang;
          })
          .join(',')
      : '';
    formData.append('languages', languagesString);

    formData.append('verifyBy', 'email');

    // Append files
    // Profile Image
    if (signUpData.profile_image) {
      const profileImageUri = signUpData.profile_image;
      const profileImageName =
        profileImageUri.split('/').pop() || 'profile.jpg';
      // Detect image type from extension or default to jpeg
      const getImageType = filename => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'png') return 'image/png';
        if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
        return 'image/jpeg'; // default
      };
      const profileImageType = getImageType(profileImageName);

      formData.append('profileImage', {
        uri:
          Platform.OS === 'ios'
            ? profileImageUri.replace('file://', '')
            : profileImageUri,
        type: profileImageType,
        name: profileImageName,
      });
    }

    // Medical License
    if (medicalLicense) {
      formData.append('medicalLicense', {
        uri:
          Platform.OS === 'ios'
            ? medicalLicense.uri.replace('file://', '')
            : medicalLicense.uri,
        type: medicalLicense.type || 'application/pdf',
        name: medicalLicense.name || 'medical_license.pdf',
      });
    }

    // Government ID
    if (governmentId) {
      formData.append('govtId', {
        uri:
          Platform.OS === 'ios'
            ? governmentId.uri.replace('file://', '')
            : governmentId.uri,
        type: governmentId.type || 'application/pdf',
        name: governmentId.name || 'government_id.pdf',
      });
    }

    // Education Certificate
    if (qualificationCertificates) {
      formData.append('educationCertificate', {
        uri:
          Platform.OS === 'ios'
            ? qualificationCertificates.uri.replace('file://', '')
            : qualificationCertificates.uri,
        type: qualificationCertificates.type || 'application/pdf',
        name: qualificationCertificates.name || 'education_certificate.pdf',
      });
    }

    return formData;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please upload all required documents');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = createFormData();

      // Log FormData for debugging (note: FormData can't be directly logged)
      console.log('Submitting registration with FormData...');

      // Call registerUser API
      const response = await registerDoctor(formData);

      console.log('Registration response:', response);

      // Navigate to OTP screen
      navigation.navigate('OTP', {
        signUpData: {
          ...signUpData,
          medical_license: medicalLicense,
          government_id: governmentId,
          qualification_certificates: qualificationCertificates,
        },
        isRegistration: true,
        verifyBy: 'email',
      });

      toast.success('Registration successful! Please verify your email.');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const clearError = field => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <>
      <SafeAreaView edges={['top']} style={{ backgroundColor: colors.primary }}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      </SafeAreaView>
      <SafeAreaView
        style={styles.container}
        edges={['left', 'right', 'bottom']}
      >
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text variant="h5" style={styles.headerTitle}>
            Register
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepper}>
              <View style={[styles.stepCircle, styles.stepCircleInactive]}>
                <Text variant="bodySmall" style={styles.stepNumberInactive}>
                  1
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.stepLabelInactive}>
                Step 1
              </Text>
            </View>
            <View style={styles.stepperLine} />
            <View style={styles.stepper}>
              <View style={[styles.stepCircle, styles.stepCircleActive]}>
                <Text variant="bodySmall" style={styles.stepNumberActive}>
                  2
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.stepLabelActive}>
                Step 2
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text variant="h4" style={styles.title}>
            Verification
          </Text>

          {/* Document Upload Sections */}
          <View style={styles.uploadsContainer}>
            <DocumentUpload
              label="Upload Medical License*"
              value={medicalLicense}
              onChange={file => {
                setMedicalLicense(file);
                clearError('medicalLicense');
              }}
              error={errors.medicalLicense}
              maxSize={2 * 1024 * 1024} // 2MB
            />

            <DocumentUpload
              label="Upload Government ID Proof*"
              value={governmentId}
              onChange={file => {
                setGovernmentId(file);
                clearError('governmentId');
              }}
              error={errors.governmentId}
              maxSize={2 * 1024 * 1024} // 2MB
            />

            <DocumentUpload
              label="Upload Qualification Certificates*"
              value={qualificationCertificates}
              onChange={file => {
                setQualificationCertificates(file);
                clearError('qualificationCertificates');
              }}
              error={errors.qualificationCertificates}
              maxSize={2 * 1024 * 1024} // 2MB
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Previous"
              variant="outline"
              onPress={handlePrevious}
              style={styles.previousButton}
            />
            <Button
              title="Submit"
              variant="primary"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={isSubmitting}
              disabled={
                isSubmitting ||
                !medicalLicense ||
                !governmentId ||
                !qualificationCertificates
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.white,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  stepper: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
  },
  stepCircleInactive: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepNumberActive: {
    color: colors.white,
    fontWeight: '600',
  },
  stepNumberInactive: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: '500',
  },
  stepLabelInactive: {
    color: colors.textSecondary,
    fontWeight: '500',
  },
  stepperLine: {
    width: 60,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 12,
    marginBottom: 28,
  },
  title: {
    textAlign: 'left',
    marginBottom: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  uploadsContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  previousButton: {
    minWidth: 100,
  },
  submitButton: {
    minWidth: 100,
  },
});

export default SignUpStep2Screen;
