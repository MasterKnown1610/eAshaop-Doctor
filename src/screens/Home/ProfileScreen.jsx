/**
 * Profile Screen
 * Displays and allows editing of doctor profile information.
 */
import React, { useState, useMemo, useContext, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';
import Input from '../../components/ui/Input';
import Dropdown from '../../components/ui/Dropdown';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';
import Context from '../../context/Context';
import toast from '../../utils/toast';

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const CONSULTATION_MODE_OPTIONS = [
  { label: 'Video Consultation', value: 'Video Consultation' },
  { label: 'Clinic Visit', value: 'Clinic Visit' },
  { label: 'Both', value: 'Both' },
];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada'];

const ProfileScreen = ({ navigation }) => {
  const {
    doctors: { doctorProfile, getDoctorProfile, updateDoctorProfile },
  } = useContext(Context);

  // Initialize info state from doctorProfile or dummy data
  const initializeInfo = profileData => {
    if (!profileData) return null;
    return {
      // Read-only fields
      firstName: profileData.name || '',
      phone: profileData.mobile?.replace('+91', '') || '',
      email: profileData.email || '',
      gender: profileData.gender || '',
      // Editable fields
      age: String(profileData.age || ''),
      consultationMode: profileData.consultationMode || '',
      hospitalName: profileData.hospitalName || '',
      hospitalAddress: profileData.hospitalLocation || '',
      qualification: profileData.education || '',
      university: profileData.university || '',
      yearsOfExperience: String(profileData.experience || ''),
      consultationFee: String(profileData.consultationFee || ''),
      areasOfExpertise: profileData.areaOfInterest || '',
      selectedLanguages: Array.isArray(profileData.languages)
        ? profileData.languages
        : [],
      description: profileData.about || '',
      profileImage: profileData.profileImage || '',
      speciality: profileData.speciality || '',
      profileImageChanged: false,
    };
  };

  const [info, setInfo] = useState(() => initializeInfo(doctorProfile));
  const [initialInfo, setInitialInfo] = useState(() =>
    initializeInfo(doctorProfile),
  );

  useEffect(() => {
    if (!doctorProfile) {
      getDoctorProfile();
    }
  }, []);

  useEffect(() => {
    if (doctorProfile) {
      const initialized = initializeInfo(doctorProfile);
      setInfo(initialized);
      setInitialInfo(initialized);
    }
  }, [doctorProfile]);

  // Check if any editable field has changed
  const hasChanges = useMemo(() => {
    if (!info || !initialInfo) return false;

    const languagesChanged =
      JSON.stringify([...info.selectedLanguages].sort()) !==
      JSON.stringify([...initialInfo.selectedLanguages].sort());

    return (
      info.age !== initialInfo.age ||
      info.consultationMode !== initialInfo.consultationMode ||
      info.hospitalName !== initialInfo.hospitalName ||
      info.hospitalAddress !== initialInfo.hospitalAddress ||
      info.qualification !== initialInfo.qualification ||
      info.university !== initialInfo.university ||
      info.yearsOfExperience !== initialInfo.yearsOfExperience ||
      info.consultationFee !== initialInfo.consultationFee ||
      info.areasOfExpertise !== initialInfo.areasOfExpertise ||
      info.description !== initialInfo.description ||
      languagesChanged ||
      info.profileImageChanged
    );
  }, [info, initialInfo]);

  // Handle profile image picker
  const handleProfileImagePicker = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        return;
      }
      if (response.errorCode || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setInfo(prev => ({
          ...prev,
          profileImage: asset.uri,
          profileImageChanged: true,
        }));
      }
    });
  };

  // Handle language toggle
  const toggleLanguage = language => {
    if (!info) return;
    const currentLanguages = info.selectedLanguages || [];
    if (currentLanguages.includes(language)) {
      setInfo(prev => ({
        ...prev,
        selectedLanguages: currentLanguages.filter(l => l !== language),
      }));
    } else {
      setInfo(prev => ({
        ...prev,
        selectedLanguages: [...currentLanguages, language],
      }));
    }
  };

  // Handle view current file
  const handleViewFile = url => {
    if (url) {
      Linking.openURL(url);
    }
  };

  // Create FormData payload similar to signup screen
  const createFormData = () => {
    if (!info || !initialInfo) return null;

    const formData = new FormData();

    // Read-only fields (from initial values)

    formData.append(
      'mobile',
      initialInfo.phone.startsWith('+')
        ? initialInfo.phone
        : `+91${initialInfo.phone}`,
    );
    formData.append('email', initialInfo.email);

    // Editable fields
    formData.append('age', info.age);
    formData.append('consultationMode', info.consultationMode);
    formData.append('hospitalName', info.hospitalName);
    formData.append('hospitalLocation', info.hospitalAddress);
    formData.append('education', info.qualification);
    formData.append('university', info.university);
    formData.append('experience', info.yearsOfExperience);
    formData.append('consultationFee', info.consultationFee);
    formData.append('areaOfInterest', info.areasOfExpertise);
    formData.append('about', info.description);

    // Languages - convert array to comma-separated string
    const languagesString = Array.isArray(info.selectedLanguages)
      ? info.selectedLanguages.join(',')
      : '';
    formData.append('languages', languagesString);

    // Profile Image (only if changed)
    if (info.profileImageChanged && info.profileImage) {
      const profileImageUri = info.profileImage;
      const profileImageName =
        profileImageUri.split('/').pop() || 'profile.jpg';
      const getImageType = filename => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'png') return 'image/png';
        if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
        return 'image/jpeg';
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

    return formData;
  };

  // Handle update profile
  const handleUpdateProfile = async () => {
    if (!hasChanges) {
      return;
    }

    const formData = createFormData();
    const response = await updateDoctorProfile(formData);
    if (response.status >= 200 && response.status < 300) {
      toast.success('Profile updated successfully');
    } else {
      toast.error('Failed to update profile');
    }

    // Example API call structure:
    // const response = await axios.put(
    //   `${API_URLS.Doctors}/profile`,
    //   formData,
    //   {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   }
    // );
  };

  // Get certificate URL by type
  const getCertificateUrl = type => {
    if (!doctorProfile?.medicalCertificates) return null;
    const cert = doctorProfile.medicalCertificates.find(c => c.type === type);
    return cert?.fileUrl || null;
  };

  // Show loading state if profile not loaded
  if (!info || !doctorProfile) {
    return (
      <SafeAreaView style={styles.container} edges={['left', 'right', 'top']}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text variant="body">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerContent}>
              <Icon name="medical-bag" size={24} color={colors.white} />
              <View style={styles.bannerText}>
                <Text variant="bodySmall" style={styles.bannerTitle}>
                  PATIENTS ARE OUR PRIORITY
                </Text>
                <Text variant="caption" style={styles.bannerSubtitle}>
                  Offers for August
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.bannerEditButton}>
              <Icon name="pencil" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            {info.profileImage ? (
              <Image
                source={{ uri: info.profileImage }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Icon name="account" size={50} color={colors.primary} />
              </View>
            )}
            <TouchableOpacity
              style={styles.profileImageEditButton}
              onPress={handleProfileImagePicker}
            >
              <Icon name="pencil" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Basic Information Section */}
          <View style={styles.section}>
            {/* Read-only: First Name */}
            <View style={styles.readOnlyField}>
              <Text variant="label" style={styles.label}>
                First Name
              </Text>
              <View style={styles.readOnlyInput}>
                <Text variant="body" style={styles.readOnlyText}>
                  {info.firstName}
                </Text>
              </View>
            </View>

            {/* Editable: Age */}
            <Input
              label="Age"
              value={info.age}
              onChangeText={value => setInfo(prev => ({ ...prev, age: value }))}
              placeholder="Enter age"
              keyboardType="numeric"
            />

            {/* Read-only: Phone */}
            <View style={styles.readOnlyField}>
              <Text variant="label" style={styles.label}>
                Phone
              </Text>
              <View style={styles.readOnlyInput}>
                <Text variant="body" style={styles.readOnlyText}>
                  {info.phone}
                </Text>
              </View>
            </View>

            {/* Read-only: Email */}
            <View style={styles.readOnlyField}>
              <Text variant="label" style={styles.label}>
                Email
              </Text>
              <View style={styles.readOnlyInput}>
                <Text variant="body" style={styles.readOnlyText}>
                  {info.email}
                </Text>
              </View>
            </View>

            {/* Read-only: Gender */}
            <View style={styles.readOnlyField}>
              <Text variant="label" style={styles.label}>
                Gender
              </Text>
              <View style={styles.readOnlyInput}>
                <Text variant="body" style={styles.readOnlyText}>
                  {info.gender}
                </Text>
              </View>
            </View>

            {/* Editable: Consultation Mode */}
            <Dropdown
              label="Consultation Mode"
              options={CONSULTATION_MODE_OPTIONS}
              selectedValue={info.consultationMode}
              onSelect={value =>
                setInfo(prev => ({ ...prev, consultationMode: value }))
              }
              placeholder="Select consultation mode"
            />
            <Input
              label="Hospital Name"
              value={info.hospitalName}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, hospitalName: value }))
              }
              placeholder="Enter hospital name"
            />
            <Input
              label="Hospital Address"
              value={info.hospitalAddress}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, hospitalAddress: value }))
              }
              placeholder="Enter hospital address"
            />
            <Input
              label="Qualification"
              value={info.qualification}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, qualification: value }))
              }
              placeholder="Enter qualification"
            />
            <Input
              label="University"
              value={info.university}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, university: value }))
              }
              placeholder="Enter university"
            />
          </View>

          {/* Professional Information Section */}
          <View style={styles.section}>
            <Input
              label="Years of Experience"
              value={info.yearsOfExperience}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, yearsOfExperience: value }))
              }
              placeholder="Enter years of experience"
              keyboardType="numeric"
            />
            <View style={styles.readOnlyField}>
              <Text variant="label" style={styles.label}>
                Speciality
              </Text>
              <View style={styles.readOnlyInput}>
                <Text variant="body" style={styles.readOnlyText}>
                  {info.speciality}
                </Text>
              </View>
            </View>
            <Input
              label="Consultation Fee"
              value={info.consultationFee}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, consultationFee: value }))
              }
              placeholder="Enter consultation fee"
              keyboardType="numeric"
            />
            <Input
              label="Areas of Expertise"
              value={info.areasOfExpertise}
              onChangeText={value =>
                setInfo(prev => ({ ...prev, areasOfExpertise: value }))
              }
              placeholder="Enter areas of expertise"
            />

            {/* Languages Spoken */}
            <View style={styles.languagesSection}>
              <Text variant="label" style={styles.label}>
                Languages Spoken
              </Text>
              <View style={styles.languagesContainer}>
                {LANGUAGE_OPTIONS.map(language => (
                  <Checkbox
                    key={language}
                    checked={info.selectedLanguages.includes(language)}
                    onPress={() => toggleLanguage(language)}
                    label={language}
                    style={styles.languageCheckbox}
                  />
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text variant="label" style={styles.label}>
                Description
              </Text>
              <TextInput
                style={styles.descriptionInput}
                value={info.description}
                onChangeText={value =>
                  setInfo(prev => ({ ...prev, description: value }))
                }
                placeholder="Enter description"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={colors.gray}
              />
            </View>

            {/* File Uploads (Read-only - View only) */}
            <View style={styles.fileUploadSection}>
              {/* Medical License */}
              <View style={styles.fileUploadItem}>
                <Text variant="label" style={styles.label}>
                  Medical License
                </Text>
                <View style={styles.readOnlyInput}>
                  <Text variant="body" style={styles.readOnlyText}>
                    Document uploaded
                  </Text>
                </View>
                {getCertificateUrl('Medical License') && (
                  <TouchableOpacity
                    onPress={() =>
                      handleViewFile(getCertificateUrl('Medical License'))
                    }
                  >
                    <Text variant="bodySmall" style={styles.viewFileLink}>
                      View Current File
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Govt ID */}
              <View style={styles.fileUploadItem}>
                <Text variant="label" style={styles.label}>
                  Govt Id
                </Text>
                <View style={styles.readOnlyInput}>
                  <Text variant="body" style={styles.readOnlyText}>
                    Document uploaded
                  </Text>
                </View>
                {getCertificateUrl('Govt ID') && (
                  <TouchableOpacity
                    onPress={() => handleViewFile(getCertificateUrl('Govt ID'))}
                  >
                    <Text variant="bodySmall" style={styles.viewFileLink}>
                      View Current File
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Education Certificate */}
              <View style={styles.fileUploadItem}>
                <Text variant="label" style={styles.label}>
                  Education Certificate
                </Text>
                <View style={styles.readOnlyInput}>
                  <Text variant="body" style={styles.readOnlyText}>
                    Document uploaded
                  </Text>
                </View>
                {getCertificateUrl('Education Certificate') && (
                  <TouchableOpacity
                    onPress={() =>
                      handleViewFile(getCertificateUrl('Education Certificate'))
                    }
                  >
                    <Text variant="bodySmall" style={styles.viewFileLink}>
                      View Current File
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Update Profile Button */}
      <SafeAreaView edges={['bottom']} style={styles.fixedButtonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Update Profile"
            onPress={handleUpdateProfile}
            variant="primary"
            style={styles.updateButton}
            disabled={!hasChanges}
          />
        </View>
      </SafeAreaView>
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
    paddingBottom: 100, // Extra padding for fixed button
  },
  fixedButtonContainer: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  buttonWrapper: {
    width: '100%',
  },
  bannerContainer: {
    position: 'relative',
    marginBottom: 60,
  },
  banner: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerText: {
    marginLeft: 12,
  },
  bannerTitle: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  bannerSubtitle: {
    color: colors.white,
    fontSize: 12,
    marginTop: 2,
  },
  bannerEditButton: {
    padding: 4,
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -50,
    left: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.grayLight,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  readOnlyField: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  readOnlyInput: {
    backgroundColor: colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  readOnlyText: {
    color: colors.textSecondary,
  },
  languagesSection: {
    marginBottom: 16,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  languageCheckbox: {
    marginRight: 16,
    marginBottom: 8,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    marginTop: 8,
  },
  fileUploadSection: {
    marginTop: 8,
  },
  fileUploadItem: {
    marginBottom: 20,
  },
  viewFileLink: {
    color: colors.primary,
    marginTop: 8,
    textDecorationLine: 'underline',
  },
  updateButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ProfileScreen;
