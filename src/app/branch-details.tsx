import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router, useLocalSearchParams } from 'expo-router';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminBottomNav } from '@/components/admin-bottom-nav';
import { findBranchById, type AssignedStaff } from '@/constants/branches';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  lightBlue: '#BDEBFF',
  veryLightBlue: '#EAF8FF',
  white: '#FFFFFF',
  gray: '#7D8B96',
  mutedBlue: '#7894A7',
  green: '#19A64A',
  lightGreen: '#D5F7E2',
  red: '#EF4444',
  lightRed: '#FFE1E1',
  border: '#D7E8F1',
};

const iconNames = {
  back: { ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' },
  location: { ios: 'location.fill', android: 'location_on', web: 'location_on' },
  branch: { ios: 'building.2.fill', android: 'business', web: 'business' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
} satisfies Record<string, SymbolViewProps['name']>;

export default function BranchDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const branch = findBranchById(id);

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
            { paddingBottom: insets.bottom + 124 },
          ]}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <SymbolView name={iconNames.back} tintColor={COLORS.navy} size={22} />
            </Pressable>
            <Text style={styles.headerTitle}>Branch Details</Text>
            <View style={styles.headerSpacer} />
          </View>

          {branch ? (
            <>
              <View style={styles.heroImage}>
                <View style={styles.heroLogoCircle}>
                  <SymbolView name={iconNames.branch} tintColor={COLORS.primary} size={32} />
                </View>
                <Text style={styles.heroLogoText}>WashWise</Text>
              </View>

              <View style={styles.infoBlock}>
                <Text style={styles.branchName}>{branch.name}</Text>
                <View style={styles.locationRow}>
                  <SymbolView name={iconNames.location} tintColor={COLORS.mutedBlue} size={18} />
                  <Text style={styles.locationText}>{branch.location}</Text>
                </View>
                <View style={styles.openPill}>
                  <View style={styles.openDot} />
                  <Text style={styles.openText}>{branch.status}</Text>
                </View>
              </View>

              <View style={styles.pricingCard}>
                <View style={styles.priceColumn}>
                  <Text style={styles.priceLabel}>Regular Price</Text>
                  <Text style={styles.priceValue}>₱{branch.regularPrice}/kg</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceColumn}>
                  <Text style={styles.priceLabel}>Rush Price</Text>
                  <Text style={styles.priceValue}>₱{branch.rushPrice}/kg</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>
                Assigned Staff ({branch.assignedStaff.length})
              </Text>

              <View style={styles.staffList}>
                {branch.assignedStaff.map((staff) => (
                  <AssignedStaffCard key={staff.id} staff={staff} />
                ))}
              </View>
            </>
          ) : (
            <View style={styles.notFoundCard}>
              <Text style={styles.notFoundTitle}>Branch not found.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.back()}
                style={({ pressed }) => [styles.notFoundBackButton, pressed && styles.pressed]}>
                <Text style={styles.notFoundBackText}>Back</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        <AdminBottomNav />
      </SafeAreaView>
    </ImageBackground>
  );
}

type AssignedStaffCardProps = {
  staff: AssignedStaff;
};

function AssignedStaffCard({ staff }: AssignedStaffCardProps) {
  return (
    <View style={styles.staffCard}>
      <View style={styles.avatar}>
        <SymbolView name={iconNames.person} tintColor={COLORS.primary} size={24} />
      </View>
      <View style={styles.staffInfo}>
        <Text style={styles.staffName}>{staff.fullName}</Text>
        <Text style={styles.staffEmail}>{staff.email}</Text>
      </View>
      <View
        style={[
          styles.staffStatusPill,
          { backgroundColor: staff.isActive ? COLORS.lightGreen : COLORS.lightRed },
        ]}>
        <Text
          style={[
            styles.staffStatusText,
            { color: staff.isActive ? COLORS.green : COLORS.red },
          ]}>
          {staff.isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
    </View>
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
    paddingTop: 14,
  },
  header: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  headerSpacer: {
    width: 44,
  },
  heroImage: {
    minHeight: 174,
    borderRadius: 16,
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    overflow: 'hidden',
  },
  heroLogoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  heroLogoText: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0,
  },
  infoBlock: {
    alignItems: 'center',
    marginTop: 22,
  },
  branchName: {
    color: COLORS.primary,
    fontSize: 23,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 6,
  },
  locationText: {
    flexShrink: 1,
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    letterSpacing: 0,
  },
  openPill: {
    minHeight: 32,
    borderRadius: 999,
    backgroundColor: COLORS.lightGreen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    marginTop: 12,
  },
  openDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  openText: {
    color: COLORS.green,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pricingCard: {
    minHeight: 104,
    borderRadius: 24,
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
    paddingVertical: 18,
  },
  priceColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  priceDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: COLORS.lightBlue,
  },
  priceLabel: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
  },
  priceValue: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 6,
    letterSpacing: 0,
  },
  sectionTitle: {
    color: COLORS.navy,
    fontSize: 21,
    fontWeight: '900',
    marginTop: 26,
    marginBottom: 13,
    letterSpacing: 0,
  },
  staffList: {
    gap: 12,
  },
  staffCard: {
    minHeight: 78,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightBlue,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  staffEmail: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 0,
  },
  staffStatusPill: {
    minHeight: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  staffStatusText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  notFoundCard: {
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    padding: 24,
    marginTop: 26,
  },
  notFoundTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  notFoundBackButton: {
    minHeight: 46,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginTop: 16,
  },
  notFoundBackText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
