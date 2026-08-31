import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { theme } from '../../../styled/theme.styled';
import { MedicalDocument } from './MedicalDocumentCard';

export interface DocumentActionsModalProps {
  visible: boolean;
  document: MedicalDocument | null;
  onOpenDocument: (doc: MedicalDocument) => void;
  onSaveToDevice: (doc: MedicalDocument) => void;
  onClose: () => void;
}

const OpenBadgeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke={theme.colors.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={theme.colors.primary} strokeWidth="2" />
  </Svg>
);

const DownloadBadgeIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
      stroke="#6366F1"
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

export const DocumentActionsModal: React.FC<DocumentActionsModalProps> = ({
  visible,
  document,
  onOpenDocument,
  onSaveToDevice,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          easing: Easing.out(Easing.back(0.5)),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!visible || !document) return null;

  const ext = (document.document_path || '').split('.').pop()?.toLowerCase() || '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const openTitle = isImage ? 'Open Image' : 'Open File';
  const openSubtitle = isImage
    ? 'Preview high-resolution image'
    : 'View medical document file';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.sheetCard,
                {
                  paddingBottom: Math.max(28, insets.bottom + 16),
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Drag Handle Bar */}
              <View style={styles.handle} />

              {/* Header */}
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle} numberOfLines={1}>
                    {document.title}
                  </Text>
                  <Text style={styles.sheetSubtitle}>
                    {document.document_type || 'Medical Document'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {/* Open Option */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      onOpenDocument(document);
                    }, 100);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: theme.colors.primarySoft }]}>
                    <OpenBadgeIcon />
                  </View>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>{openTitle}</Text>
                    <Text style={styles.optionDesc}>{openSubtitle}</Text>
                  </View>
                  <Text style={styles.arrowIcon}>›</Text>
                </TouchableOpacity>

                {/* Download Option */}
                <TouchableOpacity
                  style={styles.optionCard}
                  onPress={() => {
                    onClose();
                    setTimeout(() => {
                      onSaveToDevice(document);
                    }, 100);
                  }}
                  activeOpacity={0.8}
                >
                  <View style={[styles.iconCircle, { backgroundColor: '#EEF2FF' }]}>
                    <DownloadBadgeIcon />
                  </View>
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>Save to Device</Text>
                    <Text style={styles.optionDesc}>
                      Download file directly to your device storage
                    </Text>
                  </View>
                  <Text style={styles.arrowIcon}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.8}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DocumentActionsModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 38,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: theme.colors.surfaceBorder,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    letterSpacing: -0.2,
    fontFamily: 'Inter_700Bold',
  },
  sheetSubtitle: {
    fontSize: 13,
    color: theme.colors.textSlate,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 16,
    padding: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 2,
    fontFamily: 'Inter_700Bold',
  },
  optionDesc: {
    fontSize: 12,
    color: theme.colors.textSlate,
    lineHeight: 16,
    fontFamily: 'Inter_400Regular',
  },
  arrowIcon: {
    fontSize: 22,
    color: '#CBD5E1',
    fontWeight: '400',
    marginLeft: 8,
  },
  cancelBtn: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: '#475569',
    fontFamily: 'Inter_600SemiBold',
  },
});
