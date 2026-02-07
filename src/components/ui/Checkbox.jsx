import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../theme/colors';
import Text from './Text';

const Checkbox = ({
  checked = false,
  onPress,
  label,
  labelStyle,
  style,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[styles.checkbox, style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...props}>
      <View
        style={[
          styles.checkboxBox,
          checked && styles.checkboxBoxChecked,
        ]}>
        {checked && (
          <Text style={styles.checkmark} color={colors.white} includeFontPadding={false}>
            ✓
          </Text>
        )}
      </View>
      {label && (
        typeof label === 'string' ? (
          <Text variant="bodySmall" style={labelStyle}>
            {label}
          </Text>
        ) : (
          <View style={labelStyle}>
            {label}
          </View>
        )
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 12,
    width: '100%',
  },
});

export default Checkbox;
