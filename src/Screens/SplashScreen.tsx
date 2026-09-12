import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, View } from 'react-native';
import { queryClient } from '../components/providers/ReactQueryProvider';
import { getProfile } from '../hooks/react-query/profile/profile.funcs';
import { ProfileQueryKeys } from '../hooks/react-query/query.keys';
import { SafeAreaWrapper } from '../Layout/SafeAreaWrapper';
import { getItem, STORAGE_KEYS } from '../lib/common/asyncStorage';
import { resetAndNavigate, resetToLogin, resetToMainTabs } from '../lib/common/navigation.utils';
import {
  AppRoute,
  type SplashScreenNavigationProp,
  type SplashScreenRouteProp,
} from '../route';
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
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    const pulseLoop = Animated.loop(
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
    );

    pulseLoop.start();

    let isMounted = true;

    const authenticateAndLoad = async () => {
      try {
        const token = await getItem(STORAGE_KEYS.AUTH_TOKEN);

        if (!token) {
          logout();
          return null;
        }

        const res = await queryClient.fetchQuery({
          queryKey: [ProfileQueryKeys.Profile],
          queryFn: getProfile,
        });

        if (res?.doctor) {
          setUserData(res.doctor);
          return res.doctor;
        } else {
          logout();
          return null;
        }
      } catch (error) {
        console.error('[SplashScreen] Profile auto-login error:', error);
        logout();
        return null;
      }
    };

    const startAuthentication = async () => {
      const doctorData = await authenticateAndLoad();

      if (!isMounted) return;

      // Move immediately after authentication/API completes
      if (onFinish) {
        onFinish(Boolean(doctorData));
      } else if (navigation) {
        if (doctorData) {
          if (doctorData.has_accepted_policies) {
            resetToMainTabs(navigation);
          } else {
            resetAndNavigate(navigation, AppRoute.POLICY_ACCEPTANCE);
          }
        } else {
          resetToLogin(navigation);
        }
      }
    };

    startAuthentication();

    return () => {
      isMounted = false;
      pulseLoop.stop();
      fadeAnim.stopAnimation();
      scaleAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, [fadeAnim, scaleAnim, pulseAnim, navigation, onFinish, setUserData, logout]);

  return (
    <SafeAreaWrapper backgroundColor={theme.colors.primaryDark}>
      <View style={Splashstyles.container}>
        <View style={Splashstyles.circleContainer}>
          <View style={[Splashstyles.circle, Splashstyles.circle1]} />
          <View style={[Splashstyles.circle, Splashstyles.circle2]} />
          <View style={[Splashstyles.circle, Splashstyles.circle3]} />
        </View>

        <Animated.View
          style={[
            Splashstyles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={Splashstyles.logoContainer}>
            <Image
              source={require('../assets/logo2.png')}
              style={Splashstyles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={Splashstyles.tagline}>Your Health, Secured & Protected</Text>
        </Animated.View>

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

        <View style={Splashstyles.footer}>
          <Text style={Splashstyles.footerText}>Powered by PRED Care</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;
