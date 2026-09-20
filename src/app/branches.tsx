import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
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
import { branches, type Branch } from '@/constants/branches';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  lightBlue: '#BDEBFF',
  veryLightBlue: '#EAF8FF',
  white: '#FFFFFF',
  gray: '#7D8B96',
  mutedBlue: '#7894A7',
  border: '#D7E8F1',
};

const iconNames = {
  back: { ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' },
  location: { ios: 'location.fill', android: 'location_on', web: 'location_on' },
  branch: { ios: 'building.2.fill', android: 'business', web: 'business' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
} satisfies Record<string, SymbolViewProps['name']>;

export default function BranchesScreen() {
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
            { paddingBottom: insets.bottom + 124 },
          ]}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <SymbolView name={iconNames.back} tintColor={COLORS.navy} size={22} />
            </Pressable>
            <View style={styles.headerTextBlock}>
              <Text style={styles.title}>Manage Branches</Text>
              <Text style={styles.subtitle}>
                View all branches and select a branch{'\n'}to manage or assign staff.
              </Text>
            </View>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.branchList}>
            {branches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </View>
        </ScrollView>

        <AdminBottomNav />
      </SafeAreaView>
    </ImageBackground>
  );
}

type BranchCardProps = {
  branch: Branch;
};

function BranchCard({ branch }: BranchCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/branch-details',
          params: { id: branch.id },
        })
      }
      style={({ pressed }) => [styles.branchCard, pressed && styles.pressed]}>
      <View style={styles.branchLogo}>
        <Text style={styles.branchLogoText}>WashWise</Text>
      </View>

      <View style={styles.branchInfo}>
        <Text style={styles.branchName}>{branch.name}</Text>
        <View style={styles.locationRow}>
          <SymbolView name={iconNames.location} tintColor={COLORS.mutedBlue} size={17} />
          <Text style={styles.locationText}>{branch.location}</Text>
        </View>
        <View style={styles.typePill}>
          <SymbolView name={iconNames.branch} tintColor={COLORS.primary} size={15} />
          <Text style={styles.typeText}>{branch.type}</Text>
        </View>
      </View>

      <SymbolView name={iconNames.chevron} tintColor={COLORS.primary} size={24} />
    </Pressable>
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
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
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
  headerTextBlock: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    color: COLORS.navy,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    textAlign: 'center',
    letterSpacing: 0,
  },
  branchList: {
    gap: 14,
    marginTop: 24,
  },
  branchCard: {
    minHeight: 112,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  branchLogo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    paddingHorizontal: 6,
  },
  branchLogoText: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  branchInfo: {
    flex: 1,
  },
  branchName: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },
  locationText: {
    flex: 1,
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
  typePill: {
    alignSelf: 'flex-start',
    minHeight: 30,
    borderRadius: 999,
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  typeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
