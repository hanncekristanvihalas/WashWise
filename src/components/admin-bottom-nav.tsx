import { SymbolView } from 'expo-symbols';
import type { SymbolViewProps } from 'expo-symbols';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  white: '#FFFFFF',
  grayText: '#7D8B96',
  inactive: '#7894A7',
};

type AdminRoute = '/admin-dashboard' | '/staff' | '/payments';

type AdminBottomNavProps = {
  activeItem?: 'home' | 'staff' | 'payments';
};

type NavItem = {
  key: AdminBottomNavProps['activeItem'];
  title: string;
  route: AdminRoute;
  icon: SymbolViewProps['name'];
};

const navItems: NavItem[] = [
  {
    key: 'home',
    title: 'Home',
    route: '/admin-dashboard',
    icon: { ios: 'house.fill', android: 'home', web: 'home' },
  },
  {
    key: 'staff',
    title: 'Staff',
    route: '/staff',
    icon: { ios: 'person.2.fill', android: 'group', web: 'group' },
  },
  {
    key: 'payments',
    title: 'Payments',
    route: '/payments',
    icon: { ios: 'creditcard.fill', android: 'credit_card', web: 'credit_card' },
  },
];

const logoutIcon: SymbolViewProps['name'] = {
  ios: 'rectangle.portrait.and.arrow.right',
  android: 'logout',
  web: 'logout',
};

export function AdminBottomNav({ activeItem }: AdminBottomNavProps) {
  const insets = useSafeAreaInsets();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  function handleLogout() {
    setIsLogoutVisible(false);
    router.replace('/' as Href);
  }

  return (
    <>
      <View style={[styles.bottomNav, { bottom: insets.bottom + 12 }]}>
        {navItems.map((item) => {
          const isActive = item.key === activeItem;

          return (
            <Pressable
              key={item.title}
              accessibilityRole="button"
              onPress={() => {
                if (!isActive) {
                  router.push(item.route as Href);
                }
              }}
              style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
              <SymbolView
                name={item.icon}
                tintColor={isActive ? COLORS.primary : COLORS.inactive}
                size={24}
              />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{item.title}</Text>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          onPress={() => setIsLogoutVisible(true)}
          style={({ pressed }) => [styles.navItem, pressed && styles.pressed]}>
          <SymbolView name={logoutIcon} tintColor={COLORS.inactive} size={24} />
          <Text style={styles.navText}>Log Out</Text>
        </Pressable>
      </View>

      <Modal visible={isLogoutVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.logoutIconCircle}>
              <SymbolView name={logoutIcon} tintColor="#D44141" size={34} />
            </View>
            <Text style={styles.modalTitle}>Log Out?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your admin account?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                accessibilityRole="button"
                onPress={() => setIsLogoutVisible(false)}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={handleLogout}
                style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
                <Text style={styles.logoutText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 18,
    right: 18,
    minHeight: 76,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D7E8F1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: COLORS.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navText: {
    color: COLORS.inactive,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0,
  },
  navTextActive: {
    color: COLORS.primary,
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
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    padding: 24,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE8E8',
    marginBottom: 14,
  },
  modalTitle: {
    color: COLORS.navy,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0,
  },
  modalMessage: {
    color: COLORS.grayText,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
    letterSpacing: 0,
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F7FA',
  },
  logoutButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D44141',
  },
  cancelText: {
    color: COLORS.navy,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
