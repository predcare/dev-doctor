import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import theme from '../../../styled/theme.styled';
import { DefaultEmptyIcon } from '../../ui/icons';

export interface CommonEmptyCardProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CommonEmptyCard({
  title = 'No Data Found',
  message = 'There are no items to display right now.',
  icon,
  actionText,
  onAction,
  containerStyle,
}: CommonEmptyCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
    ]).start();

    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );

    floatLoop.start();
    pulseLoop.start();

    return () => {
      floatLoop.stop();
      pulseLoop.stop();
    };
  }, [fadeAnim, scaleAnim, floatAnim, pulseAnim]);

  return (
    <Animated.View
      style={[
        styles.container,
        containerStyle,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Animated.View
        style={[
          styles.iconRingOuter,
          {
            transform: [{ translateY: floatAnim }, { scale: pulseAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>{icon ? icon : <DefaultEmptyIcon />}</View>
      </Animated.View>

      <Text style={styles.titleText}>{title}</Text>

      {message ? <Text style={styles.messageText}>{message}</Text> : null}

      {onAction && actionText ? (
        <TouchableOpacity style={styles.actionButton} onPress={onAction} activeOpacity={0.82}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconRingOuter: {
    padding: 6,
    borderRadius: 44,
    backgroundColor: theme.colors.navBorder,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: theme.colors.mintBg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  messageText: {
    fontSize: 13.5,
    color: theme.colors.textSlate,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
    maxWidth: 290,
  },
  actionButton: {
    marginTop: 18,
    backgroundColor: theme.colors.primary,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 3,
  },
  actionText: {
    color: theme.colors.surface,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
