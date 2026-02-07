import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ImageCarousel = ({ images, autoScrollInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prevIndex =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1,
        );
      }, autoScrollInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images, autoScrollInterval]);

  const handleImagePress = () => {
    // Pause auto-scroll when user interacts
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Resume after a delay
    setTimeout(() => {
      if (images && images.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex(prevIndex =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1,
          );
        }, autoScrollInterval);
      }
    }, 5000); // Resume after 5 seconds
  };

  if (!images || images.length === 0) {
    return null;
  }

  // Determine if image is a local require() or a URI string
  const getImageSource = image => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePress} activeOpacity={0.8}>
        <Image
          source={getImageSource(images[currentIndex])}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Dots indicator */}
      {images.length > 1 && (
        <View style={styles.dotsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex ? '#008C9C' : '#E0E0E0',
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default ImageCarousel;
