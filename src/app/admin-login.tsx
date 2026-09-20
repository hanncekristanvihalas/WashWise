import { SymbolView } from 'expo-symbols';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  navy: '#064A7B',
  primary: '#087CE3',
  lightBlue: '#BDEBFF',
  veryLightBlue: '#EAF8FF',
  white: '#FFFFFF',
  grayText: '#7D8B96',
};

export default function AdminLoginScreen() {
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Details', 'Please enter both email and password.');
      return;
    }

    router.replace('/admin-dashboard' as Href);
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
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.back()}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'arrow.backward', android: 'arrow_back', web: 'arrow_back' }}
                tintColor={COLORS.navy}
                size={24}
              />
            </Pressable>
            <Text style={styles.headerTitle}>Admin Login</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            <Image
              source={require('../../assets/images/icon.png')}
              resizeMode="contain"
              style={[styles.logo, { width: Math.min(width * 0.32, 128) }]}
            />
            <Text style={styles.title}>Welcome Back, Admin!</Text>
            <Text style={styles.subtitle}>Log in to access the WashWise Management System</Text>

            <View style={styles.loginCard}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter admin email"
                placeholderTextColor={COLORS.grayText}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor={COLORS.grayText}
                  secureTextEntry={!isPasswordVisible}
                  style={styles.passwordInput}
                />
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setIsPasswordVisible((current) => !current)}
                  style={({ pressed }) => [styles.eyeButton, pressed && styles.pressed]}>
                  <SymbolView
                    name={{
                      ios: isPasswordVisible ? 'eye.slash' : 'eye',
                      android: isPasswordVisible ? 'visibility_off' : 'visibility',
                      web: isPasswordVisible ? 'visibility_off' : 'visibility',
                    }}
                    tintColor={COLORS.grayText}
                    size={22}
                  />
                </Pressable>
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={handleLogin}
                style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}>
                <Text style={styles.loginText}>Log in</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    opacity: 0.15,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D7E8F1',
  },
  headerTitle: {
    color: COLORS.navy,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0,
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  logo: {
    height: 118,
    borderRadius: 30,
    marginBottom: 14,
  },
  title: {
    color: COLORS.navy,
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0,
  },
  subtitle: {
    color: COLORS.grayText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 24,
    maxWidth: 310,
    letterSpacing: 0,
  },
  loginCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 30,
    padding: 22,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#D7E8F1',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 4,
  },
  label: {
    color: COLORS.navy,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0,
  },
  input: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#F6FCFF',
    borderWidth: 1,
    borderColor: '#D9EEF8',
    paddingHorizontal: 16,
    color: COLORS.navy,
    fontSize: 15,
    marginBottom: 16,
  },
  passwordRow: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: '#F6FCFF',
    borderWidth: 1,
    borderColor: '#D9EEF8',
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  passwordInput: {
    flex: 1,
    color: COLORS.navy,
    fontSize: 15,
    paddingVertical: 0,
  },
  eyeButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButton: {
    minHeight: 58,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  loginButtonPressed: {
    opacity: 0.86,
  },
  loginText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
});
