import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../../theme/colors';

const SearchBar = ({
  placeholder = 'Search',
  value,
  onChangeText,
  onSearch,
  style,
}) => {
  const [searchValue, setSearchValue] = useState(value || '');

  // Update local state when value prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setSearchValue(value);
    }
  }, [value]);

  const handleChangeText = (text) => {
    setSearchValue(text);
    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleClear = () => {
    setSearchValue('');
    if (onChangeText) {
      onChangeText('');
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchContainer}>
        <Icon
          name="search-outline"
          size={20}
          color={colors.gray}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          value={searchValue}
          onChangeText={handleChangeText}
          onSubmitEditing={onSearch}
          returnKeyType="search"
        />
        {searchValue.length > 0 && (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon name="close-circle" size={14} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 24,
    paddingVertical: 8,
    
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
    
  },
  clearButton: {
    // padding: 4,
    marginLeft: 8,
  },
});

export default SearchBar;
