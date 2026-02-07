/**
 * Reviews and Records Screen
 * Displays overall rating, rating distribution, and individual patient reviews.
 */
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';

/**
 * Render star rating (filled/empty/partial)
 */
const renderStars = (rating, size = 18) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const decimal = rating % 1;
  const partialPercentage = decimal * 100;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      // Full star
      stars.push(
        <Text
          key={i}
          style={[styles.star, styles.starFilled, { fontSize: size }]}
        >
          ★
        </Text>,
      );
    } else if (i === fullStars + 1 && decimal > 0) {
      // Partial star
      stars.push(
        <View
          key={i}
          style={[styles.starWrapper, { width: size, height: size }]}
        >
          <Text style={[styles.star, styles.starEmpty, { fontSize: size }]}>
            ★
          </Text>
          <View
            style={[styles.starPartialMask, { width: `${partialPercentage}%` }]}
          >
            <Text style={[styles.star, styles.starFilled, { fontSize: size }]}>
              ★
            </Text>
          </View>
        </View>,
      );
    } else {
      // Empty star
      stars.push(
        <Text
          key={i}
          style={[styles.star, styles.starEmpty, { fontSize: size }]}
        >
          ★
        </Text>,
      );
    }
  }
  return <View style={styles.starsContainer}>{stars}</View>;
};

/**
 * Rating distribution bar component
 */
const RatingBar = ({ starCount, percentage, count }) => {
  return (
    <View style={styles.ratingBarRow}>
      <View style={styles.ratingBarLabel}>
        <Text variant="body" style={styles.starLabel}>
          {starCount} ★
        </Text>
      </View>
      <View style={styles.ratingBarContainer}>
        <View style={[styles.ratingBar, { width: `${percentage}%` }]} />
      </View>
      <Text variant="caption" style={styles.ratingBarCount}>
        {count}
      </Text>
    </View>
  );
};

const ReviewsAndRecordsScreen = ({ navigation }) => {
  // Dummy data
  const [overallRating] = useState(4.6);
  const [totalReviews] = useState(128);
  const [ratingDistribution] = useState({
    5: 85,
    4: 25,
    3: 10,
    2: 5,
    1: 3,
  });

  // Dummy reviews data
  const [reviewsList] = useState([
    {
      id: '1',
      name: 'Ravi',
      avatar: null,
      rating: 5,
      date: 'Sep 29, 2025',
      comment:
        'Dr. Smith is an outstanding physician! She listened attentively to all my concerns and provided clear, comprehensive explanations. Her compassionate approach made me feel at ease, and the treatment plan she recommended has already shown great results. Highly recommend her!',
    },
    {
      id: '2',
      name: 'Priya',
      avatar: null,
      rating: 5,
      date: 'Sep 28, 2025',
      comment:
        'Excellent doctor! Very professional and caring. The consultation was thorough and the advice was very helpful.',
    },
    {
      id: '3',
      name: 'Amit',
      avatar: null,
      rating: 4,
      date: 'Sep 27, 2025',
      comment:
        'Good experience overall. Doctor was knowledgeable and patient. Would recommend.',
    },
    {
      id: '4',
      name: 'Sneha',
      avatar: null,
      rating: 5,
      date: 'Sep 26, 2025',
      comment:
        'Amazing doctor! Very understanding and provides excellent care. The follow-up was also very good.',
    },
    {
      id: '5',
      name: 'Raj',
      avatar: null,
      rating: 4,
      date: 'Sep 25, 2025',
      comment:
        'Professional and friendly. The consultation was detailed and helpful.',
    },
  ]);

  // Calculate percentages for rating bars
  const getPercentage = count => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Overall Rating Section */}
          <View style={styles.overallRatingSection}>
            <Text variant="body" style={styles.overallRatingLabel}>
              Overall Rating
            </Text>
            <View style={styles.ratingRow}>
              <Text variant="h2" style={styles.ratingNumber}>
                {overallRating}
              </Text>
              <View style={styles.ratingStarsContainer}>
                {renderStars(overallRating, 20)}
                <Text variant="bodySmall" style={styles.reviewCount}>
                  ({totalReviews} Reviews)
                </Text>
              </View>
            </View>
          </View>

          {/* Rating Distribution */}
          <View style={styles.distributionSection}>
            <RatingBar
              starCount={5}
              percentage={getPercentage(ratingDistribution[5])}
              count={ratingDistribution[5]}
            />
            <RatingBar
              starCount={4}
              percentage={getPercentage(ratingDistribution[4])}
              count={ratingDistribution[4]}
            />
            <RatingBar
              starCount={3}
              percentage={getPercentage(ratingDistribution[3])}
              count={ratingDistribution[3]}
            />
            <RatingBar
              starCount={2}
              percentage={getPercentage(ratingDistribution[2])}
              count={ratingDistribution[2]}
            />
            <RatingBar
              starCount={1}
              percentage={getPercentage(ratingDistribution[1])}
              count={ratingDistribution[1]}
            />
          </View>

          {/* Individual Reviews */}
          <View style={styles.reviewsSection}>
            {reviewsList.map(review => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerInfo}>
                    {review.avatar ? (
                      <Image
                        source={{ uri: review.avatar }}
                        style={styles.reviewAvatar}
                      />
                    ) : (
                      <View style={styles.reviewAvatarPlaceholder}>
                        <Text variant="h6" style={styles.avatarInitial}>
                          {review.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text variant="body" style={styles.reviewerName}>
                      {review.name}
                    </Text>
                  </View>
                  <View style={styles.reviewRatingDate}>
                    {renderStars(review.rating, 16)}
                    <Text variant="caption" style={styles.reviewDate}>
                      {review.date}
                    </Text>
                  </View>
                </View>
                <Text variant="body" style={styles.reviewComment}>
                  {review.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  content: {
    padding: 20,
  },
  overallRatingSection: {
    marginBottom: 24,
  },
  overallRatingLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingNumber: {
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 36,
    marginRight: 12,
  },
  ratingStarsContainer: {
    flex: 1,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 18,
    marginRight: 2,
  },
  starFilled: {
    color: '#FFD700',
  },
  starEmpty: {
    color: '#E5E7EB',
  },
  starWrapper: {
    position: 'relative',
    marginRight: 2,
  },
  starPartialMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
    height: '100%',
  },
  reviewCount: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  distributionSection: {
    marginBottom: 32,
    paddingVertical: 16,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingBarLabel: {
    width: 40,
  },
  starLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  ratingBarCount: {
    width: 30,
    textAlign: 'right',
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewsSection: {
    marginTop: 8,
  },
  reviewCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  reviewAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarInitial: {
    color: colors.primary,
    fontWeight: '600',
  },
  reviewerName: {
    fontWeight: '600',
    color: colors.textPrimary,
    fontSize: 16,
  },
  reviewRatingDate: {
    alignItems: 'flex-end',
  },
  reviewDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  reviewComment: {
    color: colors.textPrimary,
    lineHeight: 20,
    fontSize: 14,
  },
});

export default ReviewsAndRecordsScreen;
