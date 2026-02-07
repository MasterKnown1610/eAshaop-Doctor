import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import Text from './Text';

const DEFAULT_PREFIX = '+91 ';

const PhoneNumberInput = ({
  value,
  onChangeText,
  placeholder = 'Enter your phone number',
  label = 'Phone Number',
  error,
  maxLength = 10,
  prefix = DEFAULT_PREFIX,
  ...props
}) => {
  const hasPrefix = prefix != null && prefix !== '';

  if (!hasPrefix) {
    return (
      <View style={styles.container}>
        {label && (
          <Text variant="label" style={styles.label}>
            {label}
          </Text>
        )}
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          keyboardType="phone-pad"
          maxLength={maxLength}
          {...props}
        />
        {error ? (
          <Text variant="caption" color={colors.error} style={styles.errorText}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      <View style={[styles.inputRow, error && styles.inputError]}>
        <Text variant="body" style={styles.prefix}>
          {prefix}
        </Text>
        <TextInput
          style={styles.inputWithPrefix}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          keyboardType="phone-pad"
          maxLength={maxLength}
          {...props}
        />
      </View>
      {error ? (
        <Text variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.white,
    minHeight: 48,
  },
  prefix: {
    paddingLeft: 12,
    color: colors.textPrimary,
    fontSize: 16,
  },
  inputWithPrefix: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
  },
  errorText: {
    marginTop: 4,
  },
});

export default PhoneNumberInput;
