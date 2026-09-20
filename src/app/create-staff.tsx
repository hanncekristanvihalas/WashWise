import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
  lightBlue: '#BDEBFF',
  white: '#FFFFFF',
  gray: '#7D8B96',
  mutedBlue: '#7894A7',
  border: '#D7E8F1',
};

const branchOptions = ['WashWise - Nabunturan Branch', 'WashWise - Maco Branch'] as const;

type BranchOption = (typeof branchOptions)[number];

const iconNames = {
  back: { ios: 'chevron.left', android: 'arrow_back_ios_new', web: 'arrow_back_ios_new' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  branch: { ios: 'building.2', android: 'business', web: 'business' },
  info: { ios: 'info.circle.fill', android: 'info', web: 'info' },
  down: { ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'keyboard_arrow_down' },
} satisfies Record<string, SymbolViewProps['name']>;

export default function CreateStaffScreen() {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<BranchOption | ''>('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isBranchModalVisible, setIsBranchModalVisible] = useState(false);

  function handleCreateAccount() {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      Alert.alert('Missing Full Name', "Please enter the staff member's full name.");
      return;
    }

    if (!trimmedEmail) {
      Alert.alert('Missing Email', 'Please enter an email address.');
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!temporaryPassword) {
      Alert.alert('Missing Password', 'Please enter a temporary password.');
      return;
    }

    if (!confirmPassword) {
      Alert.alert('Missing Confirmation', 'Please re-enter the temporary password.');
      return;
    }

    if (temporaryPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    if (!selectedBranch) {
      Alert.alert('Missing Branch', 'Please select a branch.');
      return;
    }

    // Firebase/backend account creation will be connected here later.
    // Temporary passwords must only be sent to the protected backend workflow.
    Alert.alert('Account Created', 'Staff account created successfully.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  }

  return (
    <ImageBackground
      source={require('../../assets/images/logo-glow.png')}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
              <Text style={styles.headerTitle}>Create Staff Account</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.brandBlock}>
              <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
              <Text style={styles.brandName}>WashWise</Text>
              <Text style={styles.brandCopy}>
                Create a new staff account to give them{'\n'}access to the WashWise system.
              </Text>
            </View>

            <View style={styles.formCard}>
              <FormField
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter staff full name"
                autoCapitalize="words"
              />
              <FormField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="you@washwise.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <PasswordField
                label="Temporary Password"
                value={temporaryPassword}
                onChangeText={setTemporaryPassword}
                placeholder="Enter temporary password"
                isVisible={isPasswordVisible}
                onToggleVisibility={() => setIsPasswordVisible((current) => !current)}
              />
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Re-enter temporary password"
                isVisible={isConfirmPasswordVisible}
                onToggleVisibility={() => setIsConfirmPasswordVisible((current) => !current)}
              />

              <View style={styles.fieldBlock}>
                <Text style={styles.label}>Assign Branch</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsBranchModalVisible(true)}
                  style={({ pressed }) => [styles.branchSelector, pressed && styles.pressed]}>
                  <View style={styles.branchSelectorLeft}>
                    <SymbolView name={iconNames.branch} tintColor={COLORS.mutedBlue} size={21} />
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.branchSelectorText,
                        !selectedBranch && styles.branchSelectorPlaceholder,
                      ]}>
                      {selectedBranch || 'Select a branch'}
                    </Text>
                  </View>
                  <SymbolView name={iconNames.down} tintColor={COLORS.mutedBlue} size={20} />
                </Pressable>
              </View>

              <View style={styles.infoBox}>
                <SymbolView name={iconNames.info} tintColor={COLORS.primary} size={22} />
                <Text style={styles.infoText}>
                  Staff accounts can only be created{'\n'}by an administrator.
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleCreateAccount}
                style={({ pressed }) => [styles.createButton, pressed && styles.pressed]}>
                <Text style={styles.createButtonText}>Create Account</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <AdminBottomNav activeItem="staff" />
      </SafeAreaView>

      <BranchModal
        visible={isBranchModalVisible}
        selectedBranch={selectedBranch}
        onClose={() => setIsBranchModalVisible(false)}
        onSelect={(branch) => {
          setSelectedBranch(branch);
          setIsBranchModalVisible(false);
        }}
      />
    </ImageBackground>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FormFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.gray}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={styles.textInput}
      />
    </View>
  );
}

type PasswordFieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
};

function PasswordField({
  label,
  value,
  onChangeText,
  placeholder,
  isVisible,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordBox}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          style={styles.passwordInput}
        />
        <Pressable
          accessibilityRole="button"
          onPress={onToggleVisibility}
          style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
          <SymbolView
            name={isVisible ? iconNames.eyeOff : iconNames.eye}
            tintColor={COLORS.mutedBlue}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}

type BranchModalProps = {
  visible: boolean;
  selectedBranch: BranchOption | '';
  onClose: () => void;
  onSelect: (branch: BranchOption) => void;
};

function BranchModal({ visible, selectedBranch, onClose, onSelect }: BranchModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Select Branch</Text>
          {branchOptions.map((branch) => {
            const isSelected = branch === selectedBranch;

            return (
              <Pressable
                key={branch}
                accessibilityRole="button"
                onPress={() => onSelect(branch)}
                style={({ pressed }) => [
                  styles.branchOption,
                  isSelected && styles.branchOptionActive,
                  pressed && styles.pressed,
                ]}>
                <Text style={[styles.branchOptionText, isSelected && styles.branchOptionTextActive]}>
                  {branch}
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
  keyboardView: {
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
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  headerSpacer: {
    width: 44,
  },
  brandBlock: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 22,
  },
  brandName: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '900',
    marginTop: 10,
    letterSpacing: 0,
  },
  brandCopy: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0,
  },
  formCard: {
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  fieldBlock: {
    marginBottom: 15,
  },
  label: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 8,
    letterSpacing: 0,
  },
  textInput: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F9FDFF',
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 15,
    letterSpacing: 0,
  },
  passwordBox: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F9FDFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0,
    paddingVertical: 12,
  },
  eyeButton: {
    width: 48,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchSelector: {
    minHeight: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F9FDFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 15,
  },
  branchSelectorLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  branchSelectorText: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  branchSelectorPlaceholder: {
    color: COLORS.gray,
  },
  infoBox: {
    borderRadius: 18,
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    marginBottom: 18,
  },
  infoText: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 20,
    letterSpacing: 0,
  },
  createButton: {
    minHeight: 56,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(6, 74, 123, 0.28)',
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  modalTitle: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: 0,
  },
  branchOption: {
    minHeight: 50,
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
    backgroundColor: '#F1F8FC',
  },
  branchOptionActive: {
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  branchOptionText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0,
  },
  branchOptionTextActive: {
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
  pressed: {
    opacity: 0.72,
  },
});
