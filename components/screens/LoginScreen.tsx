import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LogIn, Github, Mail, ArrowRight } from 'lucide-react-native';
import { SmartHealLogo } from '@/components/ui/SmartHealLogo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth';
import { useResponsive } from '@/hooks/useResponsive';

export default function LoginScreen() {
  const { signInWithGoogle, signInWithGithub, signInDemo, loading } = useAuth();
  const { isMobile, isDesktop } = useResponsive();
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoadingProvider('google');
    try {
      await signInWithGoogle();
    } catch {
      // handled in auth context
    }
    setLoadingProvider(null);
  };

  const handleGithubLogin = async () => {
    setLoadingProvider('github');
    try {
      await signInWithGithub();
    } catch {
      // handled in auth context
    }
    setLoadingProvider(null);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.mainLayout, isDesktop && styles.mainLayoutDesktop]}>
          {/* Branding Side */}
          {!isMobile && (
            <View style={styles.brandingSide}>
              <View style={styles.brandingContent}>
                <View style={styles.logoContainer}>
                  <SmartHealLogo size={48} />
                  <Text style={styles.logoText}>SmartHeal</Text>
                </View>
                <Text style={styles.brandingTitle}>
                  Your Complete{'\n'}Healthcare Dashboard
                </Text>
                <Text style={styles.brandingSubtitle}>
                  Manage clients, sessions, devices and communications
                  all in one place. Built for modern healthcare practices.
                </Text>
                <View style={styles.features}>
                  {[
                    'Real-time device monitoring',
                    'Client & session management',
                    'Secure communications',
                    'Analytics & insights',
                  ].map((feature, i) => (
                    <View key={i} style={styles.featureItem}>
                      <ArrowRight size={14} color="rgba(255,255,255,0.7)" />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Login Side */}
          <View style={[styles.loginSide, isMobile && styles.loginSideMobile]}>
            <View style={styles.loginCard}>
              {/* Mobile Logo */}
              {isMobile && (
                <View style={styles.mobileLogoArea}>
                  <SmartHealLogo size={40} />
                  <Text style={styles.mobileLogoText}>SmartHeal</Text>
                </View>
              )}

              <Text style={styles.welcomeTitle}>Welcome back</Text>
              <Text style={styles.welcomeSubtitle}>
                Sign in to your account to continue
              </Text>

              <View style={styles.oauthButtons}>
                <TouchableOpacity
                  style={styles.oauthButton}
                  onPress={handleGoogleLogin}
                  disabled={loading || !!loadingProvider}
                >
                  <View style={styles.googleIcon}>
                    <Text style={styles.googleG}>G</Text>
                  </View>
                  <Text style={styles.oauthButtonText}>
                    {loadingProvider === 'google'
                      ? 'Connecting...'
                      : 'Continue with Google'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.oauthButton, styles.githubButton]}
                  onPress={handleGithubLogin}
                  disabled={loading || !!loadingProvider}
                >
                  <Github size={20} color="#ffffff" />
                  <Text style={[styles.oauthButtonText, styles.githubText]}>
                    {loadingProvider === 'github'
                      ? 'Connecting...'
                      : 'Continue with GitHub'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.oauthButton, styles.demoButton]}
                onPress={signInDemo}
              >
                <LogIn size={20} color="#ffffff" />
                <Text style={[styles.oauthButtonText, styles.demoText]}>
                  Demo Login (No credentials)
                </Text>
              </TouchableOpacity>

              <Text style={styles.termsText}>
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
  },
  keyboardView: {
    flex: 1,
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  mainLayoutDesktop: {
    flexDirection: 'row',
  },
  // Branding Panel
  brandingSide: {
    flex: 1,
    backgroundColor: '#030213',
    justifyContent: 'center',
    padding: 60,
  },
  brandingContent: {
    maxWidth: 480,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  brandingTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 44,
    marginBottom: 16,
  },
  brandingSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
  },
  // Login Panel
  loginSide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginSideMobile: {
    padding: 24,
  },
  loginCard: {
    width: '100%',
    maxWidth: 400,
  },
  mobileLogoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 40,
  },

  mobileLogoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#030213',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#030213',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 32,
  },
  oauthButtons: {
    gap: 12,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  githubButton: {
    backgroundColor: '#24292e',
    borderColor: '#24292e',
  },
  googleIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#4285f4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleG: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  oauthButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#030213',
  },
  githubText: {
    color: '#ffffff',
  },
  demoButton: {
    backgroundColor: '#d4183d',
    borderColor: '#d4183d',
  },
  demoText: {
    color: '#ffffff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  emailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    opacity: 0.6,
  },
  emailLinkText: {
    fontSize: 14,
    color: '#64748b',
  },
  termsText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 18,
  },
});
