import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import logoutOptionsModalStyles from '../../../styled/LogoutOptionsModal.styled';
import { theme } from '../../../styled/theme.styled';

export interface LogoutOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirmLogout: (allDevices: boolean) => Promise<void> | void;
  isLoading?: boolean;
}

const PhoneIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Rect
      x="5"
      y="2"
      width="14"
      height="20"
      rx="3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 18h.01"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DevicesShieldIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12l2 2 4-4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={theme.colors.textMuted}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LogoutOptionsModal: React.FC<LogoutOptionsModalProps> = ({
  visible,
  onClose,
  onConfirmLogout,
  isLoading = false,
}) => {
  const insets = useSafeAreaInsets();
  const [selectedOption, setSelectedOption] = useState<'current' | 'all'>('current');
  const slideAnim = useRef(new Animated.Value(350)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSelectedOption('current');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.back(0.4)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 350,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  const handleDismiss = () => {
    if (isLoading) return;
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 350,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleConfirm = () => {
    onConfirmLogout(selectedOption === 'all');
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      <View style={logoutOptionsModalStyles.modalContainer}>
        <TouchableWithoutFeedback onPress={handleDismiss}>
          <Animated.View style={[logoutOptionsModalStyles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        <Animated.View
          style={[
            logoutOptionsModalStyles.bottomSheet,
            {
              paddingBottom: Math.max(insets.bottom + 16, 24),
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Drag Handle Bar */}
          <View style={logoutOptionsModalStyles.dragHandleContainer}>
            <View style={logoutOptionsModalStyles.dragHandle} />
          </View>

          {/* Header */}
          <View style={logoutOptionsModalStyles.header}>
            <View style={logoutOptionsModalStyles.headerTitleRow}>
              <Text style={logoutOptionsModalStyles.title}>Sign Out</Text>
              <TouchableOpacity
                style={logoutOptionsModalStyles.closeBtn}
                onPress={handleDismiss}
                disabled={isLoading}
                activeOpacity={0.7}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>
            <Text style={logoutOptionsModalStyles.subtitle}>
              Choose how you want to log out of your doctor account.
            </Text>
          </View>

          {/* Option 1: Current Device Only */}
          <View style={logoutOptionsModalStyles.optionsContainer}>
            <TouchableOpacity
              style={[
                logoutOptionsModalStyles.optionCard,
                selectedOption === 'current' && logoutOptionsModalStyles.optionCardSelected,
              ]}
              onPress={() => setSelectedOption('current')}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <View style={logoutOptionsModalStyles.iconBox}>
                <PhoneIcon color={theme.colors.primary} />
              </View>
              <View style={logoutOptionsModalStyles.optionTextContent}>
                <Text style={logoutOptionsModalStyles.optionTitle}>Current Device Only</Text>
                <Text style={logoutOptionsModalStyles.optionSubtitle}>
                  Log out of this session on your current device only.
                </Text>
              </View>
              <View
                style={[
                  logoutOptionsModalStyles.radioCircle,
                  selectedOption === 'current' && logoutOptionsModalStyles.radioCircleSelected,
                ]}
              >
                {selectedOption === 'current' && <View style={logoutOptionsModalStyles.radioInner} />}
              </View>
            </TouchableOpacity>

            {/* Option 2: All Devices */}
            <TouchableOpacity
              style={[
                logoutOptionsModalStyles.optionCard,
                selectedOption === 'all' && logoutOptionsModalStyles.optionCardDanger,
              ]}
              onPress={() => setSelectedOption('all')}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <View style={[logoutOptionsModalStyles.iconBox, logoutOptionsModalStyles.iconBoxDanger]}>
                <DevicesShieldIcon color={theme.colors.danger} />
              </View>
              <View style={logoutOptionsModalStyles.optionTextContent}>
                <Text style={[logoutOptionsModalStyles.optionTitle, logoutOptionsModalStyles.optionTitleDanger]}>
                  All Devices
                </Text>
                <Text style={logoutOptionsModalStyles.optionSubtitle}>
                  Sign out from all active sessions on phones, tablets & web portals.
                </Text>
              </View>
              <View
                style={[
                  logoutOptionsModalStyles.radioCircle,
                  selectedOption === 'all' && logoutOptionsModalStyles.radioCircleDanger,
                ]}
              >
                {selectedOption === 'all' && <View style={logoutOptionsModalStyles.radioInnerDanger} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <TouchableOpacity
            style={logoutOptionsModalStyles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.colors.textInverted} size="small" />
            ) : (
              <Text style={logoutOptionsModalStyles.confirmButtonText}>
                {selectedOption === 'all' ? 'Sign Out of All Devices' : 'Sign Out'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={logoutOptionsModalStyles.cancelButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={logoutOptionsModalStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default LogoutOptionsModal;
