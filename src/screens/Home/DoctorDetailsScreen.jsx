import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../theme/colors';
import Text from '../../components/ui/Text';
import Button from '../../components/ui/Button';
import DateSelector from '../../components/common/DateSelector';
import Context from '../../context/Context';
import toast from '../../utils/toast';


const DoctorDetailsScreen = ({route, navigation}) => {
  const {doctor} = route.params;
  const {doctors: {
    doctorDetails,
    loadingDoctorDetails,
    getDoctorDetails,
    resetDoctorDetails,
    getDoctorReviews,
    loadingDoctorReviews,
    doctorReviews,
    postingReview,
    postDoctorReview,
  }, 
  bookings: {
    bookingSlots,
    getBookingsSlots,
    resetBookingsSlots,
    loadingBookingsSlots,
    getUserDepartments,
    userDepartments
  }} = useContext(Context);
  
  const [selectedTab, setSelectedTab] = useState('clinic');
  const [selectedUser, setSelectedUser] = useState('user');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const [reviewText, setReviewText] = useState('');

  // Format date to YYYY-MM-DD format
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return null;
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (doctor?.id) {
      getDoctorDetails(doctor?.id);
      getDoctorReviews(doctor?.id);
    }
    return () => {
      resetDoctorDetails();
    };
  }, [doctor?.id]);

  useEffect(() => {
    if (selectedDate && doctor?.id) {
      getBookingsSlots(doctor?.id, formatDateToYYYYMMDD(selectedDate));
    }
    return () => {
      resetBookingsSlots();
    };
  }, [selectedDate]);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if(userDepartments?.user?._id) {
      setSelectedUser(userDepartments?.user);
    }
  }, [userDepartments]);

  const getUser = async () => {
    const userId = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(userId);
    getUserDepartments(userData?.user?.id);
  }


  
  useEffect(() => {
    if (selectedDate) {
      console.log('Selected Date Updated:', {
        date: formatDateToYYYYMMDD(selectedDate),
        timestamp: selectedDate instanceof Date ? selectedDate.getTime() : null,
        dateObject: selectedDate,
      });
    }
  }, [selectedDate]);

 


  const getSlotsInfo = (date, index) => {
    
    return index === 0 ? 'No slots' : '12 slots';
  };

  const timeSlots = [
    '1:00 PM',
    '1:30 PM',
    '2:00 PM',
    '2:30 PM',
    '3:00 PM',
    '3:30 PM',
    '4:00 PM',
  ];

  console.log('Selected Date:', formatDateToYYYYMMDD(selectedDate),selectedTime, selectedDate);

  const getAvatarUrl = (name, profileImageUrl) => {
    if (profileImageUrl) {
      return profileImageUrl;
    }

    const initials = name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&size=100&background=${colors.primary.replace('#', '')}&color=fff&bold=true`;
  };

  const handlePost = async () => {
    if(reviewText.trim() === '') {
      toast.error("Please enter a review");
      return;
    }
    const userId = await AsyncStorage.getItem('userData');
    let userData = JSON.parse(userId);
    console.log(userData, "this is the user id");
    console.log(userId,reviewText, "this is the user id");
    const response = await postDoctorReview({
      doctorId: doctor?.id,
      comment: reviewText,
      userId: userData?.user?.id
    });
    if(response.status >= 200 && response.status < 300) {
      setReviewText('');
      getDoctorReviews(doctor?.id);
      toast.success("Review posted successfully");
    } else {
      toast.error("Failed to post review");
    }
  }

  const reviews = doctorReviews?.data?.map((review, index) => {
    const userName = review?.user?.full_name || 'User';
    return {
      id: review._id || index,
      name: userName,
      date: '',
      rating: review.rating || 0,
      comment: review?.comment || '',
      avatar: getAvatarUrl(userName, review?.user?.profileImage?.cloudinaryUrl),
    };
  }) || [];
  const d = doctorDetails || doctor;
  const imageUri = d?.backgroundImage || d?.profileImage || d?.image;
  const languages = Array.isArray(d?.languages) ? d.languages : [];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={[styles.star, i <= rating ? styles.starFilled : styles.starEmpty]}>
          ★
        </Text>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const Section = ({title, children}) => (
    <View style={styles.section}>
      <Text variant="h4" style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );


 
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};


const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();


const nextSlotMinutes = Math.ceil(currentMinutes / 30) * 30;
const todayKey = formatDateToYYYYMMDD(now);
const selectedDateKey = formatDateToYYYYMMDD(selectedDate);
const shouldFilterSlots = Boolean(selectedDateKey) && selectedDateKey === todayKey;

const filteredSlots = shouldFilterSlots
  ? bookingSlots?.slots?.filter(slot => toMinutes(slot.start) >= nextSlotMinutes)
  : bookingSlots?.slots;



  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {loadingDoctorDetails ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
        
        {/* Doctor Header */}
        <View style={styles.doctorHeader}>
          <Image
            source={{uri: imageUri}}
            style={styles.doctorImage}
            resizeMode="cover"
          />
          <View style={styles.doctorInfo}>
            <Text variant="h3" style={styles.doctorName}>
              {d?.name || '—'}
            </Text>
            <Text variant="bodySmall" style={styles.specialty}>
              {d?.speciality || d?.specialty ? `Specialist ${d.speciality || d.specialty}` : 'Specialist'}
            </Text>
            <View style={styles.ratingRow}>
              {d?.rating != null ? renderStars(Math.floor(Number(d.rating))) : null}
              <Text variant="bodySmall" style={styles.priceText}>
                {d?.consultationFee != null
                  ? `₹${d.consultationFee}/hr`
                  : typeof d?.price === 'string'
                    ? d.price
                    : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Visit Type Tabs */}
        <View style={styles.tabsContainer}>
          <Button
            title="Clinic Visit"
            variant={selectedTab === 'clinic' ? 'primary' : 'outline'}
            onPress={() => setSelectedTab('clinic')}
            style={styles.tab}
            textStyle={styles.tabButtonText}
          />
          <Button
            title="Video Consult"
            variant={selectedTab === 'video' ? 'primary' : 'outline'}
            onPress={() => setSelectedTab('video')}
            style={styles.tab}
            textStyle={styles.tabButtonText}
          />
        </View>

        {/* About Section */}
        {d?.about ? (
          <Section title="About">
            <Text variant="body" style={styles.sectionText}>
              {d.about}
            </Text>
          </Section>
        ) : null}

        {/* Languages Section */}
        {languages.length > 0 ? (
          <Section title="Languages">
            <Text variant="body" style={styles.sectionText}>
              {languages.join(', ')}
            </Text>
          </Section>
        ) : null}

        {/* Works At Section */}
        {(d?.hospitalName || d?.hospital) ? (
          <Section title="Works At">
            <Text variant="body" style={styles.sectionText}>
              {d.hospitalLocation
                ? `${d.hospitalName || d.hospital}, ${d.hospitalLocation}`
                : d.hospitalName || d.hospital}
            </Text>
          </Section>
        ) : null}

        {/* Areas of Expertise Section */}
        {d?.areaOfInterest ? (
          <Section title="Areas of Expertise">
            <Text variant="body" style={styles.sectionText}>
              {d.areaOfInterest}
            </Text>
          </Section>
        ) : null}

        {/* Certifications Section */}
        {d?.certification ? (
          <Section title="Certifications">
            <Text variant="body" style={styles.sectionText}>
              {d.certification}
            </Text>
          </Section>
        ) : null}

        {/* Education & Training Section */}
        {(d?.education || d?.university) ? (
          <Section title="Education & Training">
            <Text variant="body" style={styles.sectionText}>
              {[d.education, d.university].filter(Boolean).join(', ')}
            </Text>
          </Section>
        ) : null}

        {/* Address Section */}
        {d?.hospitalLocation ? (
          <Section title="Address">
            <Text variant="body" style={styles.sectionText}>
              {d.hospitalLocation}
            </Text>
          </Section>
        ) : null}

        {/* Book Your Slot Section */}
        <View style={styles.bookSlotSection}>
          <View style={styles.bookSlotHeader}>
            <Text variant="h4" style={styles.sectionTitle}>
              Book Your Slot
            </Text>
            <View style={styles.calendarIcon}>
              <Icon name="calendar-month" size={24} color={colors.white} />
            </View>
          </View>

          {/* User Selection */}
          <TouchableOpacity
            style={styles.userOption}
            onPress={() => setSelectedUser(userDepartments?.user)}
            activeOpacity={0.8}>
            <Text variant="body" style={styles.userOptionText}>
              {userDepartments?.user?.full_name}
            </Text>
            <View
              style={[
                styles.radioButton,
                selectedUser?._id === userDepartments?.user?._id && styles.radioButtonActive,
              ]}>
              {selectedUser?._id === userDepartments?.user?._id && <View style={styles.radioButtonInner} />}
            </View>
          </TouchableOpacity>
            {userDepartments?.userDependent?.map((each, index)=>(
              <TouchableOpacity
              key={index}
              style={styles.userOption}
              onPress={() => setSelectedUser(each)}
              activeOpacity={0.8}>
              <View style={styles.dependentRow}>
                <Text variant="body" style={styles.userOptionText}>
                  {each?.full_name}
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedUser?._id === each?._id && styles.radioButtonActive,
                ]}>
                {selectedUser?._id === each?._id && <View style={styles.radioButtonInner} />}
              </View>
            </TouchableOpacity>
            ))}
          

          {/* Date Selection */}
          <DateSelector
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            title="Select Date"
            // showSlotsInfo={true}
            getSlotsInfo={getSlotsInfo}
            minimumDate={new Date()}
          />

          {/* Time Slots */}
          <View style={styles.timeSlotsContainer}>
            {loadingBookingsSlots ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : filteredSlots?.map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  (index + 1) % 4 === 0 && styles.timeSlotLastInRow, 
                  selectedTime === time && styles.timeSlotActive,
                ]}
                onPress={() => setSelectedTime(time)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.timeSlotText,
                    selectedTime === time && styles.timeSlotTextActive,
                  ]}>
                  {time.start}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          <Text variant="h4" style={styles.sectionTitle}>
            Reviews
          </Text>

          {/* Write Review */}
          <View style={styles.writeReviewContainer}>
            <TextInput
              style={styles.reviewInput}
              placeholder="Write review"
              placeholderTextColor={colors.textSecondary}
              value={reviewText}
              onChangeText={setReviewText}
            />
            <Button
              title="POST"
              variant="primary"
              onPress={handlePost}
              style={styles.postButton}
              textStyle={styles.postButtonText}
              loading={postingReview}

            />
          </View>

          {/* Review List */}
          {reviews?.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{uri: review.avatar}}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewInfo}>
                  <Text variant="body" style={styles.reviewerName}>
                    {review.name}
                  </Text>
                </View>
                <Text variant="caption" style={styles.reviewDate}>
                  {review.date}
                </Text>
              </View>
              {renderStars(review.rating)}
              <Text variant="body" style={styles.reviewComment}>
                {review.comment}
              </Text>
            </View>
          ))}
        </View>

        </>
        )}
      </ScrollView>

      {/* Fixed Book Now Button */}
      <View style={styles.bookButtonContainer}>
        <Button
          title="Book Now"
          variant="primary"
          onPress={() => {
            navigation.navigate('ReviewSummary', {
              doctor: doctorDetails || doctor,
              selectedDate: formatDateToYYYYMMDD(selectedDate),
              selectedTime,
              patient:selectedUser,
              selectedTab: selectedTab
            });
          }}
          style={[styles.bookButton, (!selectedDate || !selectedTime || loadingDoctorDetails) && styles.bookButtonDisabled]}
          textStyle={[styles.bookButtonText, (!selectedDate || !selectedTime || loadingDoctorDetails) && styles.bookButtonTextDisabled]}
          disabled={!selectedDate || !selectedTime || loadingDoctorDetails}
        />
      </View>
    </View>
  );
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CONTAINER_PADDING = 16;
const SLOT_GAP = 8;
const SLOTS_PER_ROW = 4;
const SLOT_WIDTH = (SCREEN_WIDTH - (CONTAINER_PADDING * 2) - (SLOT_GAP * (SLOTS_PER_ROW - 1))) / SLOTS_PER_ROW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    
  },
  scrollView: {
    flex: 1,
  },
  bookButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bookButton: {
    width: '100%',
  },
  bookButtonDisabled: {
    backgroundColor: colors.grayLight,
    opacity: 0.7,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookButtonTextDisabled: {
    color: colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  doctorHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grayLight,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  specialty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 20,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#E0E0E0',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10, 
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  bookSlotSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  bookSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    marginBottom: 12,
  },
  userOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dependentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownArrow: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonActive: {
    borderColor: colors.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  timeSlot: {
    width: SLOT_WIDTH,
    marginRight: SLOT_GAP,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotLastInRow: {
    marginRight: 0,
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
  },
  timeSlotText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '500',
  },
  timeSlotTextActive: {
    color: colors.white,
  },
  reviewsSection: {
    paddingHorizontal: 16,
  },
  writeReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 14,
    color: colors.textPrimary,
  },
  postButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    // borderRadius: 25,
    marginLeft: 12,
  },
  postButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewCard: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
  },
  reviewInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewComment: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginTop: 8,
  },
});

export default DoctorDetailsScreen;
