import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';

const ICON_MAP = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
  warn: 'warning',
  default: 'information-circle',
};

const SLIDE_DISTANCE = 120;
const ANIMATION_DURATION = 350;

/**
 * Custom toast container used in ToastProvider config.
 * Edit these styles to change the toast design app-wide.
 * Animates in from the top.
 */
export default function CustomToast({
  text1,
  text2,
  type = 'default',
  hide,
  onPress,
  backgroundColor,
  textColor = colors.white,
  iconColor = colors.white,
  iconSize = 22,
  showCloseIcon = true,
  width = '90%',
  minHeight = 56,
  style,
}) {
  const iconName = ICON_MAP[type] || ICON_MAP.default;
  const translateY = useRef(new Animated.Value(-SLIDE_DISTANCE)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  return (
    <Animated.View
      style={[
        styles.animatedWrap,
        {
          transform: [{translateY}],
          opacity,
        },
      ]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={[
          styles.container,
          {backgroundColor: backgroundColor || colors.primary, minHeight},
          typeof width === 'string' ? {width: width} : {width},
          style,
        ]}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Ionicons name={iconName} size={iconSize} color={iconColor} />
          </View>
          <View style={styles.textWrap}>
            <Text style={[styles.text1, {color: textColor}]} numberOfLines={2}>
              {text1}
            </Text>
            {text2 ? (
              <Text style={[styles.text2, {color: textColor}]} numberOfLines={1}>
                {text2}
              </Text>
            ) : null}
          </View>
          {showCloseIcon && (
            <TouchableOpacity
              onPress={hide}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
              style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrap: {
    width: '100%',
    alignItems: 'center',
  },
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
    marginRight: 8,
  },
  text1: {
    fontSize: 15,
    fontWeight: '600',
  },
  text2: {
    fontSize: 13,
    opacity: 0.9,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
});
