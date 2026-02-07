import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import {useAuth} from '../../context/AuthContext';

const {width} = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'Find Trusted Doctors',
    description:
      'Easily connect with verified and experienced doctors you can rely on. From general check-ups to specialized treatments, we ensure you find the right healthcare professional for your needs.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  },
  {
    id: 2,
    title: 'Choose Best Doctors',
    description:
      'Select from a network of top-rated and highly qualified doctors across specialties. Compare profiles, experience, and patient feedback to make confident healthcare choices.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    id: 3,
    title: 'Easy Appointments',
    description:
      'Book your doctor visits in just a few clicks. Choose your preferred time, mode of consultation, and get instant confirmation—making healthcare access simple and hassle-free.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
  },
];

const OnboardingScreen = ({navigation}) => {
  const {completeOnboarding} = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      // Last slide - complete onboarding
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({item}) => (
    <View style={styles.slide}>
      {/* Top curved background */}
      <View style={styles.topBackground}>
        
        <View style={styles.imageContainer}>
          <Image
            source={{uri: item.image}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text variant="h2" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="body" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Skip Button */}
      <View style={styles?.roundCircle}></View>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text variant="body" style={styles.skipText}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
      />

      {/* Bottom Section */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        {/* Next Button */}
        <Button
          title="Next"
          variant="primary"
          onPress={handleNext}
          style={styles.nextButton}
          textStyle={styles.nextButtonText}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative',
    overflow: 'hidden',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '500',
  },
  slide: {
    width: width,
    flex: 1,
  },
  topBackground: {
    height: '50%',
    // backgroundColor: colors.primary,
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  roundCircle:{
    position: 'absolute',
    width: '350',
    height: '350',
    top: 50,
    left:-150,
    
    borderRadius: '100%',
    backgroundColor: colors.primary,
  },
  imageContainer: {
    width: 350,
    height: 350,
    borderRadius: "100%",
    backgroundColor: colors.white,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: colors.white,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
