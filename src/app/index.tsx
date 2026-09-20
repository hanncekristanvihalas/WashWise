import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  lightBlue: '#BDEBFF',
  veryLightBlue: '#EAF8FF',
  white: '#FFFFFF',
  grayText: '#7D8B96',
};

export default function AdminWelcomeScreen() {
  const { height, width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const cardHeight = Math.max(height * 0.38, 300) + insets.bottom;

  return (
    <ImageBackground
      source={require('../../assets/images/logo-glow.png')}
      resizeMode="cover"
      style={styles.background}
      imageStyle={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoArea}>
          <Image
            source={require('../../assets/images/icon.png')}
            resizeMode="contain"
            style={[styles.logo, { width: Math.min(width * 0.48, 180) }]}
          />
          <Text style={styles.brandName}>WashWise</Text>
          <Text style={styles.portalText}>Admin Portal</Text>
        </View>
      </SafeAreaView>

      <View
        style={[
          styles.welcomeCard,
          {
            minHeight: cardHeight,
            paddingBottom: insets.bottom + 18,
          },
        ]}>
        <View style={styles.handle} />

        <View style={styles.cardContent}>
          <View style={styles.iconCircle}>
            <SymbolView
              name={{
                ios: 'person.badge.shield.checkmark.fill',
                android: 'shield_person',
                web: 'shield_person',
              }}
              fallback={<Text style={styles.iconFallback}>A</Text>}
              tintColor={COLORS.primary}
              size={46}
            />
          </View>

          <Text style={styles.welcomeTitle}>Welcome Admin!</Text>
          <Text style={styles.subtitle}>Access the WashWise Management System</Text>

          <View style={styles.buttonAccent}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/admin-login' as Href)}
              style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}>
              <Text style={styles.loginText}>Log in</Text>
              <Text style={styles.arrowText}>-&gt;</Text>
            </Pressable>
          </View>
        </View>

        <View pointerEvents="none" style={styles.waveArea}>
          <View style={[styles.wave, styles.waveBack]} />
          <View style={[styles.wave, styles.waveMiddle]} />
          <View style={[styles.wave, styles.waveFront]} />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: COLORS.veryLightBlue,
  },
  backgroundImage: {
    opacity: 0.18,
  },
  safeArea: {
    flex: 1,
  },
  logoArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: '12%',
  },
  logo: {
    height: 150,
    marginBottom: 8,
    borderRadius: 38,
  },
  brandName: {
    color: COLORS.primary,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 0,
  },
  portalText: {
    color: COLORS.navy,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 4,
  },
  welcomeCard: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    borderWidth: 1,
    borderColor: '#D7E8F1',
    backgroundColor: COLORS.white,
  },
  handle: {
    width: 64,
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.lightBlue,
    alignSelf: 'center',
    marginTop: 14,
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingBottom: 38,
    zIndex: 1,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    backgroundColor: COLORS.veryLightBlue,
    borderWidth: 1,
    borderColor: '#D7F0FB',
  },
  iconFallback: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  welcomeTitle: {
    color: COLORS.navy,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0,
  },
  subtitle: {
    color: COLORS.grayText,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    letterSpacing: 0,
  },
  buttonAccent: {
    width: '100%',
    maxWidth: 330,
    borderRadius: 999,
    backgroundColor: COLORS.lightBlue,
    paddingBottom: 7,
  },
  loginButton: {
    minHeight: 58,
    borderRadius: 999,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
  },
  loginButtonPressed: {
    opacity: 0.86,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
  },
  arrowText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0,
  },
  waveArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -34,
    height: 86,
  },
  wave: {
    position: 'absolute',
    borderRadius: 999,
  },
  waveBack: {
    width: '78%',
    height: 70,
    left: '-10%',
    bottom: 8,
    backgroundColor: '#D8F4FF',
  },
  waveMiddle: {
    width: '88%',
    height: 82,
    right: '-18%',
    bottom: 4,
    backgroundColor: '#C9EFFF',
  },
  waveFront: {
    width: '72%',
    height: 58,
    left: '24%',
    bottom: -4,
    backgroundColor: '#BDEBFF',
    opacity: 0.82,
  },
});
