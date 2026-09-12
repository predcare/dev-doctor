import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import {
  IInformedConsent,
  IPrivacy,
  ITerms,
} from '../../../typescripts/interfaces/policies.interfaces';

export type PolicyItemType = ITerms | IPrivacy | IInformedConsent;
export type PolicyType = 'terms' | 'privacy' | 'consent';

export interface PolicyViewerModalProps {
  visible: boolean;
  policy: PolicyItemType | null;
  onClose: () => void;
}

const CloseIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DocumentIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={theme.colors.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke={theme.colors.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PolicyViewerModal: React.FC<PolicyViewerModalProps> = ({
  visible,
  policy,
  onClose,
}) => {
  const { height } = useWindowDimensions();
  const modalHeight = Math.min(height - 80, 540);
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          bounciness: 4,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible || !policy) return null;

  const renderFormattedContent = (rawContent: string) => {
    if (!rawContent) return null;
    const lines = rawContent.split(/\r?\n/);

    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        return <View key={index} style={styles.spacer} />;
      }

      const isHeading = /^\d+\.\s+/.test(trimmed);
      const isBullet = trimmed.startsWith('-');

      if (isHeading) {
        return (
          <Text key={index} style={styles.headingText}>
            {trimmed}
          </Text>
        );
      }

      if (isBullet) {
        return (
          <View key={index} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>•</Text>
            <Text style={styles.bulletText}>{trimmed.replace(/^-\s*/, '')}</Text>
          </View>
        );
      }

      return (
        <Text key={index} style={styles.paragraphText}>
          {trimmed}
        </Text>
      );
    });
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <Pressable style={styles.backdropOverlay} onPress={onClose} />
        <SafeAreaView style={styles.safeContainer} pointerEvents="box-none">
          <Animated.View
            style={[
              styles.modalCard,
              {
                height: modalHeight,
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerTitleRow}>
                <View style={styles.iconCircle}>
                  <DocumentIcon />
                </View>
                <View style={styles.headerTextGroup}>
                  <Text style={styles.modalTitle} numberOfLines={3}>
                    {policy.title}
                  </Text>
                  <Text style={styles.versionBadge}>Version {policy.version}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>

            {/* Scrollable Content Body */}
            <ScrollView
              style={styles.bodyScroll}
              contentContainerStyle={styles.bodyScrollContent}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              bounces={true}
              keyboardShouldPersistTaps="handled"
            >
              {renderFormattedContent(policy.content)}
            </ScrollView>
          </Animated.View>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdropOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  safeContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
    overflow: 'hidden',
    flexDirection: 'column',
  },

  // Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTextGroup: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  versionBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Body Content
  bodyScroll: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  bodyScrollContent: {
    paddingBottom: 24,
  },
  spacer: {
    height: 10,
  },
  headingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    marginBottom: 4,
  },
  paragraphText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 21,
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginLeft: 8,
    marginBottom: 4,
  },
  bulletDot: {
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 8,
    lineHeight: 21,
  },
  bulletText: {
    flex: 1,
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 21,
  },
});

export default PolicyViewerModal;
