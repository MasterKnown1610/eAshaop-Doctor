import React, {useContext} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../ui/Text';
import Context from '../../context/Context';

const CategoryHorizontalScroll = ({
  activeCategoryId = null,
  onCategoryPress,
}) => {
  const {categories: {categories: categoryList, loadingCategories}} = useContext(Context);

  const handleCategoryPress = (category) => {
    if (onCategoryPress) {
      onCategoryPress(category);
    }
  };



  if (loadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (!categoryList || categoryList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {categoryList.map((category) => {
          const isActive = activeCategoryId === category.uuid;
          
          return (
            <TouchableOpacity
              key={category.uuid}
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => handleCategoryPress(category)}
              activeOpacity={0.7}>
              <Text
                variant="bodySmall"
                style={[
                  styles.categoryText,
                  isActive && styles.categoryTextActive,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: colors.white2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingRight: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontWeight: '500',
    fontSize: 14,
    color: colors.textPrimary,
  },
  categoryTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  loadingContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryHorizontalScroll;
