import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const PromotionSlider = ({ promotions = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  // Auto-sliding effect
  useEffect(() => {
    if (promotions.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % promotions.length;
      scrollRef.current?.scrollTo({
        x: nextIndex * (width * 0.9 + 10), // Updated for 90% width
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, promotions.length]);

  // Handle manual scroll
  const handleScroll = event => {
    const slideWidth = width * 0.9 + 10;
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promotions.length) {
      setCurrentIndex(newIndex);
    }
  };

  if (!promotions || promotions.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {promotions.map((promo, index) => (
          <TouchableOpacity key={promo.id || index} activeOpacity={0.9}>
            <View style={styles.card}>
              <Image 
                source={typeof promo.image === 'string' ? { uri: promo.image } : promo.image} 
                style={styles.image}
                defaultSource={require('../../assets/login/logo.png')}
                onError={(error) => {
                  console.log('Image load error:', error);
                }}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {promotions.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              {
                width: currentIndex === idx ? 18 : 6,
                height: 6,
                backgroundColor:
                  currentIndex === idx ? colors.primary : colors.grayLight,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: width * 0.05,
  },
  card: {
    width: width * 0.9, // 90% of screen width
    height: (width * 0.9) / 2.4, // Maintains 2.4:1 aspect ratio
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    width: '90%',
    alignSelf: 'center',
  },
  dot: {
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default PromotionSlider;
