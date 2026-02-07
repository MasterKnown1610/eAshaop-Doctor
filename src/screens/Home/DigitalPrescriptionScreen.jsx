import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import Checkbox from '../../components/ui/Checkbox';
import Button from '../../components/ui/Button';
import Icon from 'react-native-vector-icons/Ionicons';

const DigitalPrescriptionScreen = ({navigation, route}) => {
  // Get patient data from route params or use default
  const patient = route?.params?.patient || {
    name: 'Amelia Smith',
    age: '24',
    gender: 'Male',
    image: null,
  };

  const [medicationName, setMedicationName] = useState('');
  const [dosageInstruction, setDosageInstruction] = useState('');
  const [dosage, setDosage] = useState('');
  const [selectedMealTimes, setSelectedMealTimes] = useState([]);
  const [medications, setMedications] = useState([]);

  const mealTimeOptions = [
    {id: 'before-breakfast', label: 'Before Breakfast'},
    {id: 'before-lunch', label: 'Before Lunch'},
    {id: 'before-dinner', label: 'Before Dinner'},
    {id: 'after-breakfast', label: 'After Breakfast'},
    {id: 'after-lunch', label: 'After Lunch'},
    {id: 'after-dinner', label: 'After Dinner'},
  ];

  const handleMealTimeToggle = mealTimeId => {
    setSelectedMealTimes(prev =>
      prev.includes(mealTimeId)
        ? prev.filter(id => id !== mealTimeId)
        : [...prev, mealTimeId],
    );
  };

  const handleAddMedication = () => {
    if (medicationName.trim()) {
      const newMedication = {
        id: Date.now().toString(),
        name: medicationName,
        dosage: dosage,
        instruction: dosageInstruction,
        mealTimes: selectedMealTimes,
      };
      setMedications(prev => [...prev, newMedication]);
      setMedicationName('');
      setDosage('');
      setDosageInstruction('');
      setSelectedMealTimes([]);
    }
  };

  const handleSendPrescription = () => {
    // Handle send prescription logic
    console.log('Sending prescription:', {
      patient,
      medications,
    });
    // Navigate back or show success message
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Patient Information */}
        <View style={styles.patientSection}>
          {patient.image ? (
            <Image
              source={{uri: patient.image}}
              style={styles.patientImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.patientImagePlaceholder}>
              <Icon name="person" size={40} color={colors.textSecondary} />
            </View>
          )}
          <View style={styles.patientInfo}>
            <Text variant="h5" style={styles.patientName}>
              {patient.name}
            </Text>
            <Text variant="bodySmall" style={styles.patientDetails}>
              {patient.age} years.
            </Text>
            <Text variant="bodySmall" style={styles.patientDetails}>
              {patient.gender}
            </Text>
          </View>
        </View>

        {/* Digital Prescription Section */}
        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Digital Prescription
          </Text>

          {/* Medication Input with Add Button */}
          <View style={styles.medicationInputRow}>
            <TextInput
              style={styles.medicationInput}
              placeholder="Medication Name & dose(eg.)"
              placeholderTextColor={colors.gray}
              value={medicationName}
              onChangeText={setMedicationName}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMedication}
              activeOpacity={0.7}>
              <Text variant="body" style={styles.addButtonText}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dosage Instruction Textarea */}
          <TextInput
            style={styles.dosageInstructionInput}
            placeholder="Dosage Instruction"
            placeholderTextColor={colors.gray}
            value={dosageInstruction}
            onChangeText={setDosageInstruction}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Dosage Section */}
        <View style={styles.section}>
          <Text variant="h5" style={styles.sectionTitle}>
            Dosage
          </Text>

          {/* Dosage Input */}
          <TextInput
            style={styles.dosageInput}
            placeholder="Enter dosage"
            placeholderTextColor={colors.gray}
            value={dosage}
            onChangeText={setDosage}
          />

          {/* Meal-Time Checkboxes */}
          <View style={styles.mealTimesContainer}>
            <View style={styles.mealTimeRow}>
              {mealTimeOptions.slice(0, 3).map(option => (
                <Checkbox
                  key={option.id}
                  checked={selectedMealTimes.includes(option.id)}
                  onPress={() => handleMealTimeToggle(option.id)}
                  label={option.label}
                  style={styles.mealTimeCheckbox}
                />
              ))}
            </View>
            <View style={styles.mealTimeRow}>
              {mealTimeOptions.slice(3, 6).map(option => (
                <Checkbox
                  key={option.id}
                  checked={selectedMealTimes.includes(option.id)}
                  onPress={() => handleMealTimeToggle(option.id)}
                  label={option.label}
                  style={styles.mealTimeCheckbox}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Added Medications List */}
        {medications.length > 0 && (
          <View style={styles.section}>
            <Text variant="h5" style={styles.sectionTitle}>
              Added Medications
            </Text>
            {medications.map(med => (
              <View key={med.id} style={styles.medicationCard}>
                <Text variant="body" style={styles.medicationCardName}>
                  {med.name}
                </Text>
                {med.dosage && (
                  <Text variant="bodySmall" style={styles.medicationCardDosage}>
                    Dosage: {med.dosage}
                  </Text>
                )}
                {med.instruction && (
                  <Text
                    variant="bodySmall"
                    style={styles.medicationCardInstruction}>
                    {med.instruction}
                  </Text>
                )}
                {med.mealTimes.length > 0 && (
                  <Text variant="bodySmall" style={styles.medicationCardMealTimes}>
                    Meal Times: {med.mealTimes.map(id => {
                      const option = mealTimeOptions.find(o => o.id === id);
                      return option?.label;
                    }).filter(Boolean).join(', ')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Send Prescription Button */}
        <Button
          title="Send Prescription"
          variant="primary"
          onPress={handleSendPrescription}
          style={styles.sendButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 32,
  },
  patientSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patientImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.grayLight,
    marginRight: 16,
  },
  patientImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  patientDetails: {
    color: colors.textSecondary,
    marginBottom: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  medicationInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  medicationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 48,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  dosageInstructionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dosageInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    minHeight: 48,
    marginBottom: 16,
  },
  mealTimesContainer: {
    gap: 12,
  },
  mealTimeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  mealTimeCheckbox: {
    flex: 1,
    minWidth: '30%',
  },
  medicationCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  medicationCardName: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  medicationCardDosage: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  medicationCardInstruction: {
    color: colors.textSecondary,
    marginBottom: 4,
  },
  medicationCardMealTimes: {
    color: colors.textSecondary,
  },
  sendButton: {
    marginTop: 8,
    paddingVertical: 16,
  },
});

export default DigitalPrescriptionScreen;
