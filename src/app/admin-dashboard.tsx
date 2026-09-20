import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminBottomNav } from '@/components/admin-bottom-nav';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  lightBlue: '#BDEBFF',
  veryLightBlue: '#EAF8FF',
  green: '#19A64A',
  lightGreen: '#C9F7D7',
  yellow: '#FFF0B3',
  purple: '#D8CCFF',
  white: '#FFFFFF',
  grayText: '#7D8B96',
  inactive: '#7894A7',
};

const summaryItems = [
  {
    title: 'Total Staff',
    value: '48',
    color: '#D9F3FF',
    iconColor: COLORS.primary,
    icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
  },
  {
    title: 'Branches',
    value: '2',
    color: COLORS.yellow,
    iconColor: '#D9A900',
    icon: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  },
  {
    title: 'Active Staff',
    value: '28',
    color: COLORS.lightGreen,
    iconColor: COLORS.green,
    icon: { ios: 'person.fill', android: 'person', web: 'person' },
  },
  {
    title: 'Payments',
    value: '8',
    color: COLORS.purple,
    iconColor: '#7257D6',
    icon: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  },
] as const;

const actionItems = [
  {
    title: 'Create Staff Account',
    subtitle: 'Add a new staff',
    route: '/create-staff',
    icon: { ios: 'person.2.badge.plus.fill', android: 'group', web: 'group' },
  },
  {
    title: 'Payment History',
    subtitle: 'View Verified Transaction',
    route: '/payments',
    icon: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  },
  {
    title: 'Manage Branches',
    subtitle: 'View branches and assigned staff',
    route: '/branches',
    icon: { ios: 'arrow.triangle.branch', android: 'account_tree', web: 'account_tree' },
  },
] as const;

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../assets/images/logo-glow.png')}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 120 },
          ]}>
          <View style={styles.brandRow}>
            <Image source={require('../../assets/images/icon.png')} style={styles.headerLogo} />
            <View>
              <Text style={styles.brandName}>WashWise</Text>
              <Text style={styles.panelText}>Admin Panel</Text>
            </View>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>Hello, Admin!</Text>
            <Text style={styles.greetingSubtitle}>See the progress today.</Text>
          </View>

          <View style={styles.summaryContainer}>
            {summaryItems.map((item) => (
              <View key={item.title} style={[styles.summaryCard, { backgroundColor: item.color }]}>
                <View style={styles.summaryIcon}>
                  <SymbolView name={item.icon} tintColor={item.iconColor} size={26} />
                </View>
                <Text style={styles.summaryTitle}>{item.title}</Text>
                <Text style={styles.summaryValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Quick Action</Text>

          <View style={styles.actionList}>
            {actionItems.map((item) => (
              <Pressable
                key={item.title}
                accessibilityRole="button"
                onPress={() => router.push(item.route as Href)}
                style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}>
                <View style={styles.actionIcon}>
                  <SymbolView name={item.icon} tintColor={COLORS.primary} size={25} />
                </View>
                <View style={styles.actionTextBlock}>
                  <Text style={styles.actionTitle}>{item.title}</Text>
                  <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
                </View>
                <SymbolView
                  name={{ ios: 'arrow.forward', android: 'arrow_forward', web: 'arrow_forward' }}
                  tintColor={COLORS.inactive}
                  size={22}
                />
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <AdminBottomNav activeItem="home" />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.veryLightBlue,
  },
  backgroundImage: {
    opacity: 0.12,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  brandName: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  panelText: {
    color: COLORS.grayText,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  greetingBlock: {
    marginTop: 28,
    marginBottom: 18,
  },
  greeting: {
    color: COLORS.navy,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  greetingSubtitle: {
    color: COLORS.grayText,
    fontSize: 15,
    marginTop: 5,
    letterSpacing: 0,
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D7E8F1',
    padding: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  summaryCard: {
    width: '48%',
    minHeight: 128,
    borderRadius: 22,
    padding: 14,
    justifyContent: 'space-between',
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.64)',
  },
  summaryTitle: {
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  summaryValue: {
    color: COLORS.navy,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 26,
    marginBottom: 14,
    letterSpacing: 0,
  },
  actionList: {
    gap: 12,
  },
  actionCard: {
    minHeight: 78,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D7E8F1',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightBlue,
  },
  actionTextBlock: {
    flex: 1,
  },
  actionTitle: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actionSubtitle: {
    color: COLORS.grayText,
    fontSize: 13,
    marginTop: 3,
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
