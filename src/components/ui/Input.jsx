import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import Text from './Text';

const Input = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  style,
  containerStyle,
  ...props
}) => (
  <View style={[styles.container, containerStyle]}>
    {label && (
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
    )}
    <TextInput
      style={[styles.input, error && styles.inputError, style]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.gray}
      {...props}
    />
    {error ? (
      <Text variant="caption" color={colors.error} style={styles.errorText}>
        {error}
      </Text>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
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
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: 4,
  },
});

export default Input;
