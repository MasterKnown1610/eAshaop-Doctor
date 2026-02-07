import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-gifted-charts';
import { colors } from '../../theme/colors';
import Text from '../../components/ui/Text';
import Icon from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const EarningsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('monthly');

  const tabs = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
  ];

  // Sample data for the chart
  const monthlyData = [
    { value: 60, label: 'Jan', frontColor: '#4ABFF4' },
    { value: 60, label: 'Feb', frontColor: '#4ABFF4' },
    { value: 60, label: 'Mar', frontColor: '#4ABFF4' },
    {
      value: 60,
      label: 'Apr',
      frontColor: '#4ABFF4',
      topLabelComponent: () => <View style={styles.selectedBarIndicator} />,
    },
    { value: 60, label: 'May', frontColor: '#4ABFF4' },
    { value: 60, label: 'Jun', frontColor: '#4ABFF4' },
    { value: 60, label: 'Jul', frontColor: '#4ABFF4' },
    { value: 60, label: 'Aug', frontColor: '#4ABFF4' },
    { value: 60, label: 'Sep', frontColor: '#4ABFF4' },
    { value: 60, label: 'Oct', frontColor: '#4ABFF4' },
    { value: 60, label: 'Nov', frontColor: '#4ABFF4' },
    { value: 60, label: 'Dec', frontColor: '#4ABFF4' },
  ];

  // Sample transactions
  const transactions = [
    {
      id: '1',
      type: 'Consultation Fee',
      date: 'Jul 24, 2025',
      amount: 1000.0,
      status: 'Completed',
      icon: 'briefcase-outline',
      isPositive: true,
    },
    {
      id: '2',
      type: 'Bank Transfer',
      date: 'Jul 24, 2025',
      amount: 1000.0,
      status: 'Completed',
      icon: 'card-outline',
      isPositive: false,
    },
    {
      id: '3',
      type: 'Withdrawal',
      date: 'Jul 24, 2025',
      amount: 1000.0,
      status: 'Completed',
      icon: 'arrow-up-outline',
      isPositive: false,
    },
  ];

  const getTotalEarnings = () => {
    // Calculate based on active tab
    switch (activeTab) {
      case 'daily':
        return '₹10,000.00';
      case 'weekly':
        return '₹70,000.00';
      case 'monthly':
        return '₹3,00,000.00';
      default:
        return '₹3,00,000.00';
    }
  };

  const getChange = () => {
    switch (activeTab) {
      case 'daily':
        return { amount: '₹1,000', percentage: '10%' };
      case 'weekly':
        return { amount: '₹7,000', percentage: '10%' };
      case 'monthly':
        return { amount: '₹30,000', percentage: '10%' };
      default:
        return { amount: '₹30,000', percentage: '10%' };
    }
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'daily':
        return 'Total Daily Earnings';
      case 'weekly':
        return 'Total Weekly Earnings';
      case 'monthly':
        return 'Total Monthly Earnings';
      default:
        return 'Total Monthly Earnings';
    }
  };

  const change = getChange();

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar backgroundColor={colors.white2} barStyle="dark-content" />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                variant="bodySmall"
                style={[styles.tabText, isActive && styles.activeTabText]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Earnings Summary */}
        <View style={styles.summarySection}>
          <Text variant="h5" style={styles.summaryTitle}>
            {getTitle()}
          </Text>
          <Text variant="h2" style={styles.totalAmount}>
            {getTotalEarnings()}
          </Text>
          <View style={styles.changeContainer}>
            <Icon name="arrow-up" size={14} color={colors.success} />
            <Text variant="bodySmall" style={styles.changeText}>
              {change.amount} ({change.percentage}) since last{' '}
              {activeTab === 'daily'
                ? 'day'
                : activeTab === 'weekly'
                ? 'week'
                : 'month'}
            </Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.chartContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chartScrollContent}>
            <BarChart
              data={monthlyData}
              width={Math.max(SCREEN_WIDTH - 80, monthlyData.length * 24 + 40)}
              height={200}
              barWidth={18}
              spacing={6}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: colors.textSecondary, fontSize: 10 }}
              xAxisLabelTextStyle={{
                color: colors.textSecondary,
                fontSize: 10,
              }}
              noOfSections={5}
              maxValue={100}
              yAxisLabelSuffix="k"
              frontColor={colors.primary}
              isAnimated
              animationDuration={800}
              backgroundColor={colors.grayLight}
              showVerticalLines
              verticalLinesColor={colors.border}
              verticalLinesThickness={1}
              dashGap={4}
              dashWidth={2}
              showYAxisIndices
              yAxisIndicesColor={colors.border}
              yAxisIndicesWidth={1}
            />
          </ScrollView>
        </View>

        {/* Earnings & Payments Section */}
        <View style={styles.transactionsSection}>
          <Text variant="h5" style={styles.sectionTitle}>
            Earnings & Payments
          </Text>

          {transactions.map(transaction => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionLeft}>
                <View style={styles.iconContainer}>
                  <Icon
                    name={transaction.icon}
                    size={20}
                    color={colors.textPrimary}
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <Text variant="body" style={styles.transactionType}>
                    {transaction.type}
                  </Text>
                  <Text variant="bodySmall" style={styles.transactionDate}>
                    {transaction.date}
                  </Text>
                </View>
              </View>
              <View style={styles.transactionRight}>
                <Text
                  variant="body"
                  style={[
                    styles.transactionAmount,
                    transaction.isPositive
                      ? styles.positiveAmount
                      : styles.negativeAmount,
                  ]}
                >
                  {transaction.isPositive ? '+' : '-'}₹
                  {transaction.amount.toFixed(2)}
                </Text>
                <Text variant="bodySmall" style={styles.transactionStatus}>
                  {transaction.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  activeTabText: {
    color: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  summarySection: {
    marginTop: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  totalAmount: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontSize: 28,
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    color: colors.textPrimary,
    fontSize: 13,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  chartScrollContent: {
    paddingRight: 16,
  },
  selectedBarIndicator: {
    width: 24,
    height: 2,
    backgroundColor: colors.primary,
    marginBottom: 2,
    borderRadius: 1,
  },
  transactionsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  transactionDate: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  positiveAmount: {
    color: colors.success,
  },
  negativeAmount: {
    color: colors.error,
  },
  transactionStatus: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default EarningsScreen;
