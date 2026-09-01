import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { queryClient } from '../components/providers/ReactQueryProvider';
import { getProfile } from '../hooks/react-query/profile/profile.funcs';
import { ProfileQueryKeys } from '../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../Layout/SafeAreaWrapper';
import { getItem, STORAGE_KEYS } from '../lib/common/asyncStorage';
import { resetToLogin, resetToMainTabs } from '../lib/common/navigation.utils';
import type { SplashScreenNavigationProp, SplashScreenRouteProp } from '../route';
import { Splashstyles } from '../styled/SplashScreen.styled';
import { theme } from '../styled/theme.styled';
import { useAuthStore } from '../zustand/stores/useAuthStore';

export interface SplashScreenProps {
  navigation?: SplashScreenNavigationProp;
  route?: SplashScreenRouteProp;
  onFinish?: (isAuthenticated: boolean) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation, onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const setUserData = useAuthStore(state => state.setUserData);
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    // 1. Fade in and scale animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Pulse animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    let isAuthenticated = false;

    const authenticateAndLoad = async () => {
      try {
        const token = await getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          const res = await queryClient.fetchQuery({
            queryKey: [ProfileQueryKeys.Profile],
            queryFn: getProfile,
          });

          if (res?.doctor) {
            setUserData(res.doctor);
            isAuthenticated = true;
          } else {
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('[SplashScreen] Profile auto-login error:', error);
        logout();
      }
    };

    const minTimer = new Promise<void>(resolve => setTimeout(() => resolve(), 2200));

    Promise.all([authenticateAndLoad(), minTimer]).then(() => {
      if (onFinish) {
        onFinish(isAuthenticated);
      } else if (navigation) {
        if (isAuthenticated) {
          resetToMainTabs(navigation);
        } else {
          resetToLogin(navigation);
        }
      }
    });
  }, [fadeAnim, scaleAnim, pulseAnim, navigation, onFinish, setUserData, logout]);

  return (
    <SafeAreaWrapper backgroundColor={theme.colors.primaryDark} barStyle="light-content">
      <View style={Splashstyles.container}>
        {/* Background Gradient Circles */}
        <View style={Splashstyles.circleContainer}>
          <View style={[Splashstyles.circle, Splashstyles.circle1]} />
          <View style={[Splashstyles.circle, Splashstyles.circle2]} />
          <View style={[Splashstyles.circle, Splashstyles.circle3]} />
        </View>

        {/* Logo and Title Container */}
        <Animated.View
          style={[
            Splashstyles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Logo/Icon */}
          <View style={Splashstyles.logoContainer}>
            <Image
              source={require('../assets/logo2.png')}
              style={Splashstyles.logo}
              resizeMode="contain"
            />
          </View>

          {/* App Title */}
          <Text style={Splashstyles.tagline}>Your Health, Secured & Protected</Text>
        </Animated.View>

        {/* Animated Loading Indicator */}
        <Animated.View
          style={[
            Splashstyles.loaderContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={Splashstyles.loadingDots}>
            <View style={[Splashstyles.dot, Splashstyles.dot1]} />
            <View style={[Splashstyles.dot, Splashstyles.dot2]} />
            <View style={[Splashstyles.dot, Splashstyles.dot3]} />
          </View>
        </Animated.View>

        {/* Footer */}
        <View style={Splashstyles.footer}>
          <Text style={Splashstyles.footerText}>Powered by PredCare</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;
