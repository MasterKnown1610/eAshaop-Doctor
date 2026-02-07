import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import SearchBar from '../../components/common/SearchBar';
import DoctorCard from '../../components/common/DoctorCard';
import CategoryHorizontalScroll from '../../components/common/CategoryHorizontalScroll';
import Context from '../../context/Context';

const DoctorsScreen = ({navigation, route}) => {
  const [searchText, setSearchText] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(
    route?.params?.selectedCategory?.uuid || null
  );
  const {
    categories: {categories: categoryList, loadingCategories},
    doctors: {doctors: doctorList, loadingDoctors, getDoctorsByCategoryId},
  } = useContext(Context);

 
  useEffect(() => {
    if (!loadingCategories && categoryList && categoryList.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoryList[0].uuid);
    }
  }, [categoryList, loadingCategories, activeCategoryId]);

  useEffect(() => {
    if (!loadingDoctors && activeCategoryId) {
      console.log(activeCategoryId, "this is the active category id");
      getDoctorsByCategoryId(activeCategoryId);
    }
  }, [activeCategoryId]);

  
  // const doctors = [
  //   {
  //     id: 1,
  //     name: 'Dr. Tranquilli',
  //     specialty: 'cardiologist',
  //     experience: '6 Years experience',
  //     hospital: 'Yashoda Hospital',
  //     rating: 4.0,
  //     price: '₹1000/hr',
  //     image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  //     available: true,
  //   },
  //   {
  //     id: 2,
  //     name: 'Dr. Tranquilli',
  //     specialty: 'cardiologist',
  //     experience: '6 Years experience',
  //     hospital: 'Yashoda Hospital',
  //     rating: 4.0,
  //     price: '₹1000/hr',
  //     image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  //     available: true,
  //   },
  //   {
  //     id: 3,
  //     name: 'Dr. Tranquilli',
  //     specialty: 'cardiologist',
  //     experience: '6 Years experience',
  //     hospital: 'Yashoda Hospital',
  //     rating: 4.0,
  //     price: '₹1000/hr',
  //     image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  //     available: true,
  //   },
  //   {
  //     id: 4,
  //     name: 'Dr. Tranquilli',
  //     specialty: 'cardiologist',
  //     experience: '6 Years experience',
  //     hospital: 'Yashoda Hospital',
  //     rating: 4.0,
  //     price: '₹1000/hr',
  //     image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  //     available: true,
  //   },
  //   {
  //     id: 5,
  //     name: 'Dr. Tranquilli',
  //     specialty: 'cardiologist',
  //     experience: '6 Years experience',
  //     hospital: 'Yashoda Hospital',
  //     rating: 4.0,
  //     price: '₹1000/hr',
  //     image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
  //     available: true,
  //   },
  // ];
console.log(doctorList, "this is the doctor list");

  const doctors = doctorList?.map((doctor) => ({
    id: doctor._id || '',
    name: doctor.name,
    specialty: doctor.speciality,
    experience: doctor.experience,
    hospital: doctor.hospitalName,
    rating: doctor.rating,
    price: `₹${doctor.consultationFee}/hr`,
    image: doctor?.backgroundImage,
  })) ?? [];

  const handleSearch = (text) => {
    setSearchText(typeof text === 'string' ? text : '');
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  // Filter doctors by name (local search)
  const filteredDoctors = React.useMemo(() => {
    const query = typeof searchText === 'string' ? searchText.trim() : '';
    if (!query) {
      return doctors;
    }
    const searchLower = query.toLowerCase();
    return doctors.filter((doctor) =>
      (doctor.name || '').toLowerCase().includes(searchLower)
    );
  }, [doctors, searchText]);

  const handleBookNow = (doctor) => {
    navigation.navigate('DoctorDetails', {doctor});
  };

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoctorDetails', {doctor});
  };

  const handleCategoryPress = (category) => {
    setActiveCategoryId(category.uuid);
    console.log('Category selected:', category);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />

   
      <View style={styles.searchHeader}>
        <SearchBar
          placeholder="Search doctors by name"
          value={searchText}
          onChangeText={handleSearch}
          onClear={handleClearSearch}
        />
      </View>

     
      <CategoryHorizontalScroll
        activeCategoryId={activeCategoryId}
        onCategoryPress={handleCategoryPress}
      />


      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loadingDoctors ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : filteredDoctors?.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBookNow={handleBookNow}
              onPress={handleDoctorPress}
            />
          ))
        ) : (
          <Text variant="bodyMedium" color={colors.textSecondary}>
            No doctors found
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  searchHeader: {
    paddingHorizontal: 16,
   
    backgroundColor: colors.white2,
   
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
});

export default DoctorsScreen;
