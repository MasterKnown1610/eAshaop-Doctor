import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Dropdown as RNDropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';
import Text from './Text';

const Dropdown = ({
  options = [],
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  label,
  error,
  style,
  clearable = true,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  // Transform options to match react-native-element-dropdown format
  const data = options.map(option => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <View style={[styles.container, style]}>
      {label && <Text variant="label" style={styles.label}>{label}</Text>}
      <RNDropdown
        style={[
          styles.dropdown,
          error && styles.inputError,
          isFocus && styles.dropdownFocus,
        ]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={selectedValue}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onSelect(item.value);
          setIsFocus(false);
        }}
        renderLeftIcon={() => null}
        renderRightIcon={() => {
          if (clearable && selectedValue != null) {
            return (
              <TouchableOpacity
                onPress={() => {
                  onSelect(null);
                  setIsFocus(false);
                }}
                style={styles.iconButton}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="close-circle" size={20} color={colors.gray} />
              </TouchableOpacity>
            );
          }
          // Show down arrow when no value is selected
          return (
            <View style={styles.iconButton}>
              <Icon name="chevron-down" size={20} color={colors.gray} />
            </View>
          );
        }}
      />
      {error && (
        <Text variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </Text>
      )}
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
  dropdown: {
    height: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
  },
  dropdownFocus: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.error,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.gray,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 8,
  },
  iconButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  errorText: {
    marginTop: 4,
  },
});

export default Dropdown;
