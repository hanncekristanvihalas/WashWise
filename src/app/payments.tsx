import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ImageBackground,
  Modal,
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
  verifiedGreen: '#19A64A',
  verifiedBackground: '#D5F7E2',
  white: '#FFFFFF',
  gray: '#7D8B96',
  mutedBlue: '#7894A7',
  border: '#D7E8F1',
};

const branchOptions = ['All Branches', 'Nabunturan Branch', 'Maco Branch'] as const;
const staffOptions = ['All Staff', 'Maria Santos', 'John Dela Cruz', 'Kevin Ramos'] as const;

type BranchFilter = (typeof branchOptions)[number];
type StaffFilter = (typeof staffOptions)[number];

type PaymentTransaction = {
  id: string;
  orderId: string;
  customerName: string;
  customerId: string;
  staffId: string;
  staffName: string;
  staffEmail: string;
  branchId: string;
  branchName: string;
  amount: number;
  status: 'Verified';
  dateTime: string;
};

type SelectorState =
  | { title: 'Select Branch'; options: readonly BranchFilter[]; value: BranchFilter }
  | { title: 'Select Staff'; options: readonly StaffFilter[]; value: StaffFilter }
  | null;

const iconNames = {
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  down: { ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' },
  receipt: { ios: 'doc.text.fill', android: 'receipt', web: 'receipt' },
} satisfies Record<string, SymbolViewProps['name']>;

// Temporary local data. Firestore payment retrieval will replace this array later.
const temporaryPayments: PaymentTransaction[] = [
  {
    id: 'payment-1',
    orderId: 'ORD-0048',
    customerName: 'Ana Reyes',
    customerId: 'customer-1',
    staffId: 'staff-maria',
    staffName: 'Maria Santos',
    staffEmail: 'maria@washwise.com',
    branchId: 'nabunturan',
    branchName: 'Nabunturan Branch',
    amount: 350,
    status: 'Verified',
    dateTime: 'Sep 17, 2026 - 3:40 PM',
  },
  {
    id: 'payment-2',
    orderId: 'ORD-0041',
    customerName: 'Carlo Lim',
    customerId: 'customer-2',
    staffId: 'staff-john',
    staffName: 'John Dela Cruz',
    staffEmail: 'john@washwise.com',
    branchId: 'maco',
    branchName: 'Maco Branch',
    amount: 280,
    status: 'Verified',
    dateTime: 'Sep 16, 2026 - 5:10 PM',
  },
  {
    id: 'payment-3',
    orderId: 'ORD-0039',
    customerName: 'Bea Cruz',
    customerId: 'customer-3',
    staffId: 'staff-maria',
    staffName: 'Maria Santos',
    staffEmail: 'maria@washwise.com',
    branchId: 'nabunturan',
    branchName: 'Nabunturan Branch',
    amount: 420,
    status: 'Verified',
    dateTime: 'Sep 16, 2026 - 1:25 PM',
  },
];

function formatPeso(amount: number) {
  return `₱${amount.toFixed(2)}`;
}

export default function PaymentsScreen() {
  const insets = useSafeAreaInsets();
  const [branchFilter, setBranchFilter] = useState<BranchFilter>('All Branches');
  const [staffFilter, setStaffFilter] = useState<StaffFilter>('All Staff');
  const [selector, setSelector] = useState<SelectorState>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);

  const filteredPayments = useMemo(() => {
    return temporaryPayments.filter((payment) => {
      const matchesBranch = branchFilter === 'All Branches' || payment.branchName === branchFilter;
      const matchesStaff = staffFilter === 'All Staff' || payment.staffName === staffFilter;

      return matchesBranch && matchesStaff;
    });
  }, [branchFilter, staffFilter]);

  function handleSelectorOption(option: BranchFilter | StaffFilter) {
    if (!selector) {
      return;
    }

    if (selector.title === 'Select Branch') {
      setBranchFilter(option as BranchFilter);
    } else {
      setStaffFilter(option as StaffFilter);
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
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 124 },
          ]}>
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <SymbolView name={iconNames.back} tintColor={COLORS.navy} size={24} />
            </Pressable>
            <Text style={styles.title}>Payment History</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.filterRow}>
            <FilterButton
              label={branchFilter}
              onPress={() =>
                setSelector({ title: 'Select Branch', options: branchOptions, value: branchFilter })
              }
            />
            <FilterButton
              label={staffFilter}
              onPress={() =>
                setSelector({ title: 'Select Staff', options: staffOptions, value: staffFilter })
              }
            />
          </View>

          <View style={styles.cardList}>
            {filteredPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onPress={() => setSelectedPayment(payment)}
              />
            ))}

            {filteredPayments.length === 0 ? (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <SymbolView name={iconNames.receipt} tintColor={COLORS.primary} size={26} />
                </View>
                <Text style={styles.emptyText}>No payment transactions found.</Text>
              </View>
            ) : null}
          </View>
        </ScrollView>

        <AdminBottomNav activeItem="payments" />
      </SafeAreaView>

      <SelectorModal
        selector={selector}
        onClose={() => setSelector(null)}
        onSelect={handleSelectorOption}
      />
      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
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

type PaymentCardProps = {
  payment: PaymentTransaction;
  onPress: () => void;
};

function PaymentCard({ payment, onPress }: PaymentCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.paymentCard, pressed && styles.pressed]}>
      <View style={styles.paymentTopRow}>
        <View style={styles.receiptIcon}>
          <SymbolView name={iconNames.receipt} tintColor={COLORS.primary} size={25} />
        </View>

        <Text style={styles.orderId}>{payment.orderId}</Text>

        <View style={styles.amountBlock}>
          <Text style={styles.amount}>{formatPeso(payment.amount)}</Text>
          <View style={styles.verifiedPill}>
            <Text style={styles.verifiedText}>{payment.status}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoList}>
        <InfoRow label="Customer" value={payment.customerName} />
        <InfoRow label="Handled by" value={payment.staffEmail} />
        <InfoRow label="Branch" value={payment.branchName} />
        <InfoRow label="Date & Time" value={payment.dateTime} />
      </View>
    </Pressable>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

type SelectorModalProps = {
  selector: SelectorState;
  onClose: () => void;
  onSelect: (option: BranchFilter | StaffFilter) => void;
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

type PaymentDetailsModalProps = {
  payment: PaymentTransaction | null;
  onClose: () => void;
};

function PaymentDetailsModal({ payment, onClose }: PaymentDetailsModalProps) {
  return (
    <Modal visible={Boolean(payment)} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.detailsCard}>
          <Text style={styles.modalTitle}>Payment Details</Text>

          <DetailRow label="Order" value={payment?.orderId ?? ''} />
          <DetailRow label="Customer" value={payment?.customerName ?? ''} />

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Handled By</Text>
            <Text style={styles.detailValue}>{payment?.staffName}</Text>
            <Text style={styles.detailSubValue}>{payment?.staffEmail}</Text>
          </View>

          <DetailRow label="Branch" value={payment?.branchName ?? ''} />
          <DetailRow label="Amount" value={payment ? formatPeso(payment.amount) : ''} />

          <View style={styles.detailBlock}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.detailVerifiedPill}>
              <Text style={styles.verifiedText}>{payment?.status}</Text>
            </View>
          </View>

          <DetailRow label="Date & Time" value={payment?.dateTime ?? ''} />

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

function DetailRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.detailBlock}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
    paddingTop: 18,
  },
  header: {
    minHeight: 48,
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
  title: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
  paymentCard: {
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
  paymentTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  receiptIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightBlue,
  },
  orderId: {
    flex: 1,
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
    paddingTop: 4,
  },
  amountBlock: {
    alignItems: 'flex-end',
    gap: 7,
  },
  amount: {
    color: COLORS.navy,
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0,
  },
  verifiedPill: {
    minHeight: 27,
    borderRadius: 999,
    justifyContent: 'center',
    backgroundColor: COLORS.verifiedBackground,
    paddingHorizontal: 10,
  },
  verifiedText: {
    color: COLORS.verifiedGreen,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  infoList: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoLabel: {
    width: 86,
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  infoValue: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'right',
    letterSpacing: 0,
  },
  emptyCard: {
    minHeight: 170,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.veryLightBlue,
    marginBottom: 12,
  },
  emptyText: {
    color: COLORS.navy,
    fontSize: 16,
    fontWeight: '900',
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
  detailBlock: {
    marginTop: 10,
  },
  detailLabel: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
  },
  detailValue: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: 0,
  },
  detailSubValue: {
    color: COLORS.gray,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 3,
    letterSpacing: 0,
  },
  detailVerifiedPill: {
    alignSelf: 'flex-start',
    minHeight: 28,
    borderRadius: 999,
    justifyContent: 'center',
    backgroundColor: COLORS.verifiedBackground,
    paddingHorizontal: 12,
    marginTop: 6,
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
  detailsCloseButton: {
    marginTop: 22,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
