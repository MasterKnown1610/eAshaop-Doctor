import React, {useState, useContext} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import SearchBar from '../../components/common/SearchBar';
import Context from '../../context/Context';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CATEGORY_CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2;

const CategoriesScreen = ({navigation, route}) => {
  const [searchText, setSearchText] = useState('');
  const {categories: {categories: categoryList, loadingCategories}} = useContext(Context);

  const categories = categoryList?.map((category) => ({
    id: category.uuid,
    title: category.name,
    subtitle: `${category.doctorCount} doctors`,
    icon: category.icon,
  })) || [];

  const getIconSize = () => {
    return 24;
  };

  const handleSearch = (text) => {
    setSearchText(typeof text === 'string' ? text : '');
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('Doctors', {
      selectedCategory: {
        uuid: category.id,
        name: category.title,
      },
    });
  };

  // Filter categories by title (local search)
  const filteredCategories = React.useMemo(() => {
    const query = typeof searchText === 'string' ? searchText.trim() : '';
    if (!query) {
      return categories;
    }
    const searchLower = query.toLowerCase();
    return categories.filter((category) =>
      category.title.toLowerCase().includes(searchLower)
    );
  }, [categories, searchText]);

  const CategoryCard = ({category}) => {
    const IconComponent = category.icon;

    return (
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(category)}
        activeOpacity={0.7}>
        <View style={styles.categoryIconContainer}>
          {IconComponent && (
            <IconComponent color={colors.primary} size={getIconSize()} />
          )}
        </View>
        <View style={styles.categoryContent}>
          <Text
            variant="bodySmall"
            style={styles.categoryTitle}
            numberOfLines={1}
            ellipsizeMode="tail">
            {category.title}
          </Text>
          <Text
            variant="caption"
            color={colors.textSecondary}
            style={styles.categorySubtitle}>
            {category.subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

      {/* Search Header */}
      <View style={styles.searchHeader}>
        <SearchBar
          placeholder="Search categories"
          value={searchText}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
        />
      </View>

      {/* Categories Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loadingCategories ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : filteredCategories && filteredCategories.length > 0 ? (
          <View style={styles.categoriesGrid}>
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium" color={colors.textSecondary}>
              No categories found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchHeader: {
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: CATEGORY_CARD_WIDTH,
    flexDirection: 'row',
    backgroundColor: colors.grayLight,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
  },
  categoryTitle: {
    marginBottom: 6,
    fontWeight: '500',
    fontSize: 14,
    color: colors.textPrimary,
    width: '100%',
  },
  categorySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  loadingContainer: {
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

export default CategoriesScreen;
