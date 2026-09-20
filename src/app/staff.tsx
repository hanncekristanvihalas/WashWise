import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AdminBottomNav } from '@/components/admin-bottom-nav';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  veryLightBlue: '#EAF8FF',
  activeGreen: '#19A64A',
  activeBackground: '#D5F7E2',
  inactiveRed: '#EF4444',
  inactiveBackground: '#FFE1E1',
  white: '#FFFFFF',
  gray: '#7D8B96',
  mutedBlue: '#7894A7',
  border: '#D7E8F1',
};

const branchOptions = ['All Branches', 'Nabunturan Branch', 'Maco Branch'] as const;
const statusOptions = ['All Status', 'Active', 'Inactive'] as const;

type BranchFilter = (typeof branchOptions)[number];
type StatusFilter = (typeof statusOptions)[number];

type StaffMember = {
  id: string;
  fullName: string;
  email: string;
  branch: string;
  isActive: boolean;
};

type SelectorState =
  | { title: 'Select Branch'; options: readonly BranchFilter[]; value: BranchFilter }
  | { title: 'Select Status'; options: readonly StatusFilter[]; value: StatusFilter }
  | null;

const initialStaff: StaffMember[] = [
  {
    id: '1',
    fullName: 'Maria Santos',
    email: 'maria@washwise.com',
    branch: 'Nabunturan Branch',
    isActive: true,
  },
  {
    id: '2',
    fullName: 'John Dela Cruz',
    email: 'john@washwise.com',
    branch: 'Maco Branch',
    isActive: false,
  },
  {
    id: '3',
    fullName: 'Kevin Ramos',
    email: 'kevin@washwise.com',
    branch: 'Nabunturan Branch',
    isActive: true,
  },
];

const iconNames = {
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  add: { ios: 'plus', android: 'add', web: 'add' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  power: { ios: 'power', android: 'power_settings_new', web: 'power_settings_new' },
  down: { ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' },
  person: { ios: 'person.fill', android: 'person', web: 'person' },
} satisfies Record<string, SymbolViewProps['name']>;

export default function StaffScreen() {
  const insets = useSafeAreaInsets();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff);
  const [searchText, setSearchText] = useState('');
  const [branchFilter, setBranchFilter] = useState<BranchFilter>('All Branches');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All Status');
  const [selector, setSelector] = useState<SelectorState>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const filteredStaff = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return staffMembers.filter((member) => {
      const matchesSearch =
        query.length === 0 ||
        member.fullName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);
      const matchesBranch = branchFilter === 'All Branches' || member.branch === branchFilter;
      const memberStatus = member.isActive ? 'Active' : 'Inactive';
      const matchesStatus = statusFilter === 'All Status' || memberStatus === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [branchFilter, searchText, staffMembers, statusFilter]);

  function confirmStatusChange(member: StaffMember) {
    const nextStatus = member.isActive ? 'Inactive' : 'Active';
    const action = member.isActive ? 'Deactivate' : 'Activate';

    Alert.alert(
      `${action} Staff`,
      `Are you sure you want to ${action.toLowerCase()} ${member.fullName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: member.isActive ? 'destructive' : 'default',
          onPress: () => {
            setStaffMembers((currentStaff) =>
              currentStaff.map((item) =>
                item.id === member.id ? { ...item, isActive: nextStatus === 'Active' } : item,
              ),
            );
          },
        },
      ],
    );
  }

  function handleSelectorOption(option: BranchFilter | StatusFilter) {
    if (!selector) {
      return;
    }

    if (selector.title === 'Select Branch') {
      setBranchFilter(option as BranchFilter);
    } else {
      setStatusFilter(option as StatusFilter);
    }

    setSelector(null);
  }

  return (
    <ImageBackground
      source={require('../../assets/images/logo-glow.png')}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 124 },
          ]}>
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Staff Management</Text>
            <Text style={styles.subtitle}>View staff accounts and assigned branches</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/create-staff' as Href)}
            style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
            <SymbolView name={iconNames.add} tintColor={COLORS.white} size={24} />
            <Text style={styles.createButtonText}>Create Staff</Text>
          </Pressable>

          <View style={styles.searchBox}>
            <SymbolView name={iconNames.search} tintColor={COLORS.mutedBlue} size={22} />
            <TextInput
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search staff..."
              placeholderTextColor={COLORS.gray}
              autoCapitalize="none"
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterRow}>
            <FilterButton
              label={branchFilter}
              onPress={() =>
                setSelector({ title: 'Select Branch', options: branchOptions, value: branchFilter })
              }
            />
            <FilterButton
              label={statusFilter}
              onPress={() =>
                setSelector({ title: 'Select Status', options: statusOptions, value: statusFilter })
              }
            />
          </View>

          <View style={styles.cardList}>
            {filteredStaff.map((member) => (
              <StaffCard
                key={member.id}
                member={member}
                onView={() => setSelectedStaff(member)}
                onToggleStatus={() => confirmStatusChange(member)}
              />
            ))}

            {filteredStaff.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>No staff found</Text>
                <Text style={styles.emptyText}>Try changing your search or filters.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <AdminBottomNav activeItem="staff" />
      </SafeAreaView>

      <SelectorModal
        selector={selector}
        onClose={() => setSelector(null)}
        onSelect={handleSelectorOption}
      />
      <StaffDetailsModal staff={selectedStaff} onClose={() => setSelectedStaff(null)} />
    </ImageBackground>
  );
}

type FilterButtonProps = {
  label: string;
  onPress: () => void;
};

function FilterButton({ label, onPress }: FilterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
      <Text numberOfLines={1} style={styles.filterText}>
        {label}
      </Text>
      <SymbolView name={iconNames.down} tintColor={COLORS.mutedBlue} size={20} />
    </Pressable>
  );
}

type StaffCardProps = {
  member: StaffMember;
  onView: () => void;
  onToggleStatus: () => void;
};

function StaffCard({ member, onView, onToggleStatus }: StaffCardProps) {
  const isActive = member.isActive;

  return (
    <View style={styles.staffCard}>
      <View style={styles.staffTopRow}>
        <View style={styles.avatar}>
          <SymbolView name={iconNames.person} tintColor={COLORS.primary} size={25} />
        </View>

        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{member.fullName}</Text>
          <Text style={styles.staffEmail}>{member.email}</Text>
          <Text style={styles.staffBranch}>{member.branch}</Text>
        </View>

        <View
          style={[
            styles.statusPill,
            { backgroundColor: isActive ? COLORS.activeBackground : COLORS.inactiveBackground },
          ]}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isActive ? COLORS.activeGreen : COLORS.inactiveRed },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isActive ? COLORS.activeGreen : COLORS.inactiveRed },
            ]}>
            {isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          accessibilityRole="button"
          onPress={onView}
          style={({ pressed }) => [styles.viewButton, pressed && styles.pressed]}>
          <SymbolView name={iconNames.eye} tintColor={COLORS.primary} size={19} />
          <Text style={styles.viewButtonText}>View</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onToggleStatus}
          style={({ pressed }) => [
            styles.statusActionButton,
            { borderColor: isActive ? COLORS.inactiveRed : COLORS.activeGreen },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={iconNames.power}
            tintColor={isActive ? COLORS.inactiveRed : COLORS.activeGreen}
            size={19}
          />
          <Text
            style={[
              styles.statusActionText,
              { color: isActive ? COLORS.inactiveRed : COLORS.activeGreen },
            ]}>
            {isActive ? 'Deactivate' : 'Activate'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

type SelectorModalProps = {
  selector: SelectorState;
  onClose: () => void;
  onSelect: (option: BranchFilter | StatusFilter) => void;
};

function SelectorModal({ selector, onClose, onSelect }: SelectorModalProps) {
  return (
    <Modal visible={Boolean(selector)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.selectorCard}>
          <Text style={styles.modalTitle}>{selector?.title}</Text>
          {selector?.options.map((option) => {
            const isSelected = option === selector.value;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                onPress={() => onSelect(option)}
                style={({ pressed }) => [
                  styles.selectorOption,
                  isSelected && styles.selectorOptionActive,
                  pressed && styles.pressed,
                ]}>
                <Text
                  style={[
                    styles.selectorOptionText,
                    isSelected && styles.selectorOptionTextActive,
                  ]}>
                  {option}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type StaffDetailsModalProps = {
  staff: StaffMember | null;
  onClose: () => void;
};

function StaffDetailsModal({ staff, onClose }: StaffDetailsModalProps) {
  return (
    <Modal visible={Boolean(staff)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailsCard}>
          <Text style={styles.modalTitle}>Staff Details</Text>

          <Text style={styles.detailName}>{staff?.fullName}</Text>
          <Text style={styles.detailEmail}>{staff?.email}</Text>

          <Text style={styles.detailLabel}>Assigned Branch</Text>
          <Text style={styles.detailValue}>{staff?.branch}</Text>

          <Text style={styles.detailLabel}>Account Status</Text>
          <Text
            style={[
              styles.detailStatus,
              { color: staff?.isActive ? COLORS.activeGreen : COLORS.inactiveRed },
            ]}>
            {staff?.isActive ? 'Active' : 'Inactive'}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, styles.detailsCloseButton, pressed && styles.pressed]}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    paddingTop: 20,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: COLORS.navy,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0,
  },
  createButton: {
    minHeight: 56,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  searchBox: {
    minHeight: 54,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  searchInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    paddingVertical: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14,
  },
  filterButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 14,
  },
  filterText: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  cardList: {
    gap: 14,
    marginTop: 18,
  },
  staffCard: {
    borderRadius: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  staffTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
    paddingRight: 4,
  },
  staffName: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0,
  },
  staffEmail: {
    color: COLORS.gray,
    fontSize: 13,
    marginTop: 3,
    letterSpacing: 0,
  },
  staffBranch: {
    color: COLORS.mutedBlue,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 5,
    letterSpacing: 0,
  },
  statusPill: {
    minHeight: 30,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  viewButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  viewButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  statusActionButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  statusActionText: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0,
  },
  emptyCard: {
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(6, 74, 123, 0.28)',
  },
  selectorCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  detailsCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    padding: 24,
  },
  modalTitle: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
    marginBottom: 14,
  },
  selectorOption: {
    minHeight: 48,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#F1F8FC',
  },
  selectorOptionActive: {
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  selectorOptionText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  selectorOptionTextActive: {
    color: COLORS.primary,
  },
  closeButton: {
    minHeight: 48,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailName: {
    color: COLORS.navy,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  detailEmail: {
    color: COLORS.gray,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 0,
  },
  detailLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '900',
    marginTop: 10,
    letterSpacing: 0,
  },
  detailValue: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0,
  },
  detailStatus: {
    fontSize: 15,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 0,
  },
  detailsCloseButton: {
    marginTop: 22,
  },
  pressed: {
    opacity: 0.72,
  },
});
