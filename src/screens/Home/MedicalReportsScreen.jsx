import React from 'react';
import {View, StyleSheet, StatusBar, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import MedicalReportIcon from '../../assets/dashboard/medicalReport.png';

const MedicalReportsScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={styles.content}>
        {/* Medical Report Icon */}
        <View style={styles.iconContainer}>
          <Image
            source={MedicalReportIcon}
            style={styles.icon}
            resizeMode="contain"
          />
        </View>

        {/* Coming Soon Text */}
        <Text variant="h2" style={styles.comingSoonText}>
          Coming Soon....
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    opacity: 0.8,
  },
  icon: {
    width: 80,
    height: 80,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default MedicalReportsScreen;
