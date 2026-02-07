/**
 * Text Component
 * Reusable text component with theme-based styling
 */

import React from 'react';
import {Text as RNText, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';

const Text = ({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[variant]];

    if (color) {
      baseStyle.push({color});
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  return (
    <RNText
      style={getTextStyle()}
      numberOfLines={numberOfLines}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
  },
  // Heading variants
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  // Body variants
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 28,
  },
  // Label variants
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  // Caption variants
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  captionSmall: {
    fontSize: 10,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 16,
  },
  // Color variants
  primary: {
    color: colors.primary,
  },
  secondary: {
    color: colors.secondary,
  },
  success: {
    color: colors.success,
  },
  error: {
    color: colors.error,
  },
  warning: {
    color: colors.warning,
  },
  gray: {
    color: colors.gray,
  },
  white: {
    color: colors.white,
  },
});

export default Text;
