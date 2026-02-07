import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { colors } from '../../theme/colors';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import EmailInput from '../../components/ui/EmailInput';
import PhoneNumberInput from '../../components/ui/PhoneNumberInput';
import Dropdown from '../../components/ui/Dropdown';
import Checkbox from '../../components/ui/Checkbox';
import Text from '../../components/ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';
import Context from '../../context/Context';
import toast from '../../utils/toast';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENDER_OPTIONS = [
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
  { label: 'Other', value: 'Other' },
];

const SPECIALITY_OPTIONS = [
  { label: 'General Physician', value: 'UqkGTNQTOD' },
  { label: 'Cardiologist', value: 'bD1KuA_6pr' },
  { label: 'Orthopedic', value: 'oybWOH7Ok8' },
  { label: 'Neurologist', value: 'r1ArfRKaU_' },
  { label: 'Ophthalmology', value: 'whHEP4Ba-m' },
  { label: 'ENT Specialist', value: '4A31RiqS_M' },
  { label: 'Dentist', value: 'u3bp-C0G4f' },
  { label: 'Psychiatrist', value: 'Psych_01' },
  { label: 'Pediatrician', value: 'Ped_01' },
  { label: 'Dermatologist', value: 'DrmtLgst_01' },
  { label: 'Physiotherapist', value: 'PhyThr_01' },
  { label: 'Urologist', value: 'Urolgst_01' },
  { label: 'Gynaecologist', value: 'Gynclgst_01' },
];

const CONSULTANT_MODE_OPTIONS = [
  { label: 'Video Consultation', value: 'Video Consultation' },
  { label: 'Clinic Visit', value: 'Clinic Visit' },
  { label: 'Both', value: 'Both' },
];

const LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'hindi', label: 'Hindi' },
  { id: 'telugu', label: 'Telugu' },
  { id: 'tamil', label: 'Tamil' },
  { id: 'kannada', label: 'Kannada' },
];

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {
    login: { verifyEmailAndPhone },
  } = useContext(Context);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('');
  const [hospitalClinicName, setHospitalClinicName] = useState('');
  const [qualification, setQualification] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [areasOfExpertise, setAreasOfExpertise] = useState('');
  const [speciality, setSpeciality] = useState(null);
  const [gender, setGender] = useState(null);
  const [consultantMode, setConsultantMode] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [hospitalClinicAddress, setHospitalClinicAddress] = useState('');
  const [university, setUniversity] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Error states
  const [errors, setErrors] = useState({});

  const handleLanguageToggle = languageId => {
    setSelectedLanguages(prev =>
      prev.includes(languageId)
        ? prev.filter(id => id !== languageId)
        : [...prev, languageId],
    );
  };

  const handleImageUpload = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: false,
      includeBase64: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorCode || response.errorMessage) {
        toast.error(response.errorMessage || 'Failed to capture photo');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setProfileImage(asset.uri);
      }
    });
  };

  const openGallery = () => {
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
        toast.error(response.errorMessage || 'Failed to select image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        setProfileImage(asset.uri);
      }
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!firstName?.trim()) {
      newErrors.firstName = 'First Name is required';
    }
    if (!age?.trim()) {
      newErrors.age = 'Age is required';
    }
    if (!hospitalClinicName?.trim()) {
      newErrors.hospitalClinicName = 'Hospital/Clinic Name is required';
    }
    if (!qualification?.trim()) {
      newErrors.qualification = 'Qualification is required';
    }
    if (!yearsOfExperience?.trim()) {
      newErrors.yearsOfExperience = 'Years of Experience is required';
    }
    if (!areasOfExpertise?.trim()) {
      newErrors.areasOfExpertise = 'Areas of Expertise is required';
    }
    if (!speciality) {
      newErrors.speciality = 'Speciality is required';
    }
    if (!gender) {
      newErrors.gender = 'Gender is required';
    }
    if (!consultantMode) {
      newErrors.consultantMode = 'Consultant Mode is required';
    }
    if (!phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (phoneNumber.length !== 10) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }
    if (!email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!hospitalClinicAddress?.trim()) {
      newErrors.hospitalClinicAddress = 'Hospital/Clinic Address is required';
    }
    if (!university?.trim()) {
      newErrors.university = 'University is required';
    }
    if (!consultationFee?.trim()) {
      newErrors.consultationFee = 'Consultation Fee is required';
    }
    if (selectedLanguages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }
    if (!description?.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    const specialityname = SPECIALITY_OPTIONS.find(
      option => option.value === speciality,
    )?.label;

    const payload = {
      first_name: firstName.trim(),
      age: age.trim(),
      hospital_clinic_name: hospitalClinicName.trim(),
      qualification: qualification.trim(),
      years_of_experience: yearsOfExperience.trim(),
      areas_of_expertise: areasOfExpertise.trim(),
      speciality: specialityname,
      categoryUuid: speciality,
      gender,
      consultant_mode: consultantMode,
      phone_number: phoneNumber.trim(),
      email: email.trim(),
      hospital_clinic_address: hospitalClinicAddress.trim(),
      university: university.trim(),
      consultation_fee: consultationFee.trim(),
      languages: selectedLanguages,
      description: description.trim(),
      profile_image: profileImage,
    };

    // Navigate to Step 2
    setLoading(true);
    const response = await verifyEmailAndPhone({
      email: email.trim(),
      phone: phoneNumber.trim(),
    });

    setLoading(false);
    navigation.navigate('SignUpStep2', {
      signUpData: payload,
    });
  };

  const handleCancel = () => {
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
              <View style={[styles.stepCircle, styles.stepCircleActive]}>
                <Text variant="bodySmall" style={styles.stepNumberActive}>
                  1
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.stepLabelActive}>
                Step 1
              </Text>
            </View>
            <View style={styles.stepperLine} />
            <View style={styles.stepper}>
              <View style={[styles.stepCircle, styles.stepCircleInactive]}>
                <Text variant="bodySmall" style={styles.stepNumberInactive}>
                  2
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.stepLabelInactive}>
                Step 2
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text variant="h4" style={styles.title}>
            Personal & Professional Details
          </Text>

          {/* Profile Picture Upload */}
          <View style={styles.uploadContainer}>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handleImageUpload}
              activeOpacity={0.7}
            >
              {profileImage ? (
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.uploadedImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={e => {
                      e.stopPropagation();
                      setProfileImage(null);
                    }}
                    activeOpacity={0.7}
                  >
                    <Icon name="close-circle" size={24} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadIconContainer}>
                  <Icon
                    name="camera-outline"
                    size={32}
                    color={colors.primary}
                  />
                </View>
              )}
            </TouchableOpacity>
            <Text variant="bodySmall" style={styles.uploadText}>
              {profileImage ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </View>

          {/* Form Fields - Single Column Layout */}
          <View style={styles.formContainer}>
            <Input
              label="First Name*"
              value={firstName}
              onChangeText={text => {
                setFirstName(text);
                clearError('firstName');
              }}
              placeholder="Enter first name"
              error={errors.firstName}
            />

            <Input
              label="Age*"
              value={age}
              onChangeText={text => {
                setAge(text);
                clearError('age');
              }}
              placeholder="Enter age"
              error={errors.age}
              keyboardType="numeric"
            />

            <Input
              label="Hospital/Clinic Name*"
              value={hospitalClinicName}
              onChangeText={text => {
                setHospitalClinicName(text);
                clearError('hospitalClinicName');
              }}
              placeholder="Enter hospital/clinic name"
              error={errors.hospitalClinicName}
            />

            <Input
              label="Qualification*"
              value={qualification}
              onChangeText={text => {
                setQualification(text);
                clearError('qualification');
              }}
              placeholder="Enter qualification"
              error={errors.qualification}
            />

            <Input
              label="Years of Experience*"
              value={yearsOfExperience}
              onChangeText={text => {
                setYearsOfExperience(text);
                clearError('yearsOfExperience');
              }}
              placeholder="Enter years"
              error={errors.yearsOfExperience}
              keyboardType="numeric"
            />

            <Input
              label="Areas of Expertise*"
              value={areasOfExpertise}
              onChangeText={text => {
                setAreasOfExpertise(text);
                clearError('areasOfExpertise');
              }}
              placeholder="Enter areas"
              error={errors.areasOfExpertise}
            />

            <Dropdown
              label="Speciality*"
              options={SPECIALITY_OPTIONS}
              selectedValue={speciality}
              onSelect={value => {
                setSpeciality(value);
                clearError('speciality');
              }}
              placeholder="Select Speciality"
              error={errors.speciality}
            />

            <Dropdown
              label="Gender*"
              options={GENDER_OPTIONS}
              selectedValue={gender}
              onSelect={value => {
                setGender(value);
                clearError('gender');
              }}
              placeholder="Select"
              error={errors.gender}
            />

            <Dropdown
              label="Consultant Mode*"
              options={CONSULTANT_MODE_OPTIONS}
              selectedValue={consultantMode}
              onSelect={value => {
                setConsultantMode(value);
                clearError('consultantMode');
              }}
              placeholder="Select"
              error={errors.consultantMode}
            />

            <PhoneNumberInput
              label="Phone Number*"
              value={phoneNumber}
              onChangeText={text => {
                setPhoneNumber(text);
                clearError('phoneNumber');
              }}
              placeholder="Enter 10-digit number"
              error={errors.phoneNumber}
            />

            <EmailInput
              label="Email*"
              value={email}
              onChangeText={text => {
                setEmail(text);
                clearError('email');
              }}
              placeholder="Enter email"
              error={errors.email}
            />

            <Input
              label="Hospital/Clinic Address*"
              value={hospitalClinicAddress}
              onChangeText={text => {
                setHospitalClinicAddress(text);
                clearError('hospitalClinicAddress');
              }}
              placeholder="Enter address"
              error={errors.hospitalClinicAddress}
            />

            <Input
              label="University*"
              value={university}
              onChangeText={text => {
                setUniversity(text);
                clearError('university');
              }}
              placeholder="Enter university"
              error={errors.university}
            />

            <Input
              label="Consultation Fee*"
              value={consultationFee}
              onChangeText={text => {
                setConsultationFee(text);
                clearError('consultationFee');
              }}
              placeholder="Enter fee"
              error={errors.consultationFee}
              keyboardType="numeric"
            />
          </View>

          {/* Languages Spoken */}
          <View style={styles.languagesSection}>
            <Text variant="label" style={styles.languagesLabel}>
              Languages Spoken*
            </Text>
            <View style={styles.languagesContainer}>
              {LANGUAGES.map(language => (
                <Checkbox
                  key={language.id}
                  checked={selectedLanguages.includes(language.id)}
                  onPress={() => handleLanguageToggle(language.id)}
                  label={language.label}
                  style={styles.languageCheckbox}
                />
              ))}
            </View>
            {errors.languages && (
              <Text
                variant="caption"
                color={colors.error}
                style={styles.errorText}
              >
                {errors.languages}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text variant="label" style={styles.descriptionLabel}>
              Description*
            </Text>
            <TextInput
              style={[
                styles.descriptionInput,
                errors.description && styles.inputError,
              ]}
              value={description}
              onChangeText={text => {
                setDescription(text);
                clearError('description');
              }}
              placeholder="Enter description"
              placeholderTextColor={colors.gray}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {errors.description && (
              <Text
                variant="caption"
                color={colors.error}
                style={styles.errorText}
              >
                {errors.description}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={handleCancel}
              style={styles.cancelButton}
            />
            <Button
              title="Next"
              variant="primary"
              onPress={handleNext}
              style={styles.nextButton}
              loading={loading}
              disabled={loading}
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
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  uploadContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
  },
  uploadIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  removeImageButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 2,
  },
  uploadText: {
    color: colors.textSecondary,
  },
  formContainer: {
    marginBottom: 16,
  },
  languagesSection: {
    marginBottom: 16,
  },
  languagesLabel: {
    marginBottom: 12,
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  languageCheckbox: {
    marginRight: 8,
    marginBottom: 8,
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionLabel: {
    marginBottom: 8,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    minWidth: 100,
  },
  nextButton: {
    minWidth: 100,
  },
});

export default SignUpScreen;
