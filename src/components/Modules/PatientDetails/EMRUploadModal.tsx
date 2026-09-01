import React, { useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { showInfoToast } from '../../../lib/common/toast.utils';
import { theme } from '../../../styled/theme.styled';

export interface EMRUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess?: (doc: { title: string; type: string; fileName?: string }) => void;
}

export const EMRUploadModal: React.FC<EMRUploadModalProps> = ({
  visible,
  onClose,
  onUploadSuccess,
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState('Lab Report');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const categories = ['Lab Report', 'Prescription', 'Scan / X-Ray', 'Discharge Summary', 'Other'];

  const handleCamera = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets && res.assets[0]) {
        const file = res.assets[0];
        setSelectedFileName(file.fileName || 'photo_capture.jpg');
        showInfoToast('Photo captured successfully', 'Camera');
      }
    });
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, res => {
      if (res.assets && res.assets[0]) {
        const file = res.assets[0];
        setSelectedFileName(file.fileName || 'selected_document.png');
        showInfoToast('Image selected from gallery', 'Gallery');
      }
    });
  };

  const handleSave = () => {
    if (!docTitle.trim()) return;
    onUploadSuccess?.({
      title: docTitle.trim(),
      type: docType,
      fileName: selectedFileName || 'document.pdf',
    });
    setDocTitle('');
    setSelectedFileName(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.55)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            maxHeight: '88%',
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: theme.colors.textPrimary,
                fontFamily: 'Inter_700Bold',
              }}
            >
              Upload EMR Document
            </Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={{ fontSize: 20, color: theme.colors.textMuted, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Title Input */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: theme.colors.textSecondary,
              marginBottom: 6,
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            Document Title
          </Text>
          <TextInput
            style={{
              backgroundColor: theme.colors.surfaceSecondary,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 14,
              color: theme.colors.textPrimary,
              borderWidth: 1,
              borderColor: theme.colors.surfaceBorder,
              marginBottom: 14,
              fontFamily: 'Inter_400Regular',
            }}
            placeholder="e.g. Blood Test Report"
            placeholderTextColor={theme.colors.textMuted}
            value={docTitle}
            onChangeText={setDocTitle}
          />

          {/* Category Chips */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: theme.colors.textSecondary,
              marginBottom: 8,
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            Document Category
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {categories.map(cat => {
              const active = cat === docType;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setDocType(cat)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: active ? theme.colors.primarySoft : theme.colors.surfaceSecondary,
                    borderWidth: 1,
                    borderColor: active ? theme.colors.mintBdr : theme.colors.surfaceBorder,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: active ? '700' : '500',
                      color: active ? theme.colors.primary : theme.colors.textSecondary,
                      fontFamily: active ? 'Inter_700Bold' : 'Inter_500Medium',
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* File Picker Section */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: theme.colors.textSecondary,
              marginBottom: 8,
              fontFamily: 'Inter_600SemiBold',
            }}
          >
            Select Attachment
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <TouchableOpacity
              onPress={handleCamera}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: theme.colors.primarySoft,
                borderWidth: 1,
                borderColor: theme.colors.mintBdr,
                gap: 6,
              }}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
                  stroke={theme.colors.primary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx="12" cy="13" r="4" stroke={theme.colors.primary} strokeWidth="2" />
              </Svg>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: theme.colors.primary,
                  fontFamily: 'Inter_700Bold',
                }}
              >
                Camera
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGallery}
              activeOpacity={0.8}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: '#EEF2FF',
                borderWidth: 1,
                borderColor: '#C7D2FE',
                gap: 6,
              }}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="3" width="18" height="18" rx="3" stroke="#6366F1" strokeWidth="2" />
                <Circle cx="8.5" cy="8.5" r="1.5" fill="#6366F1" />
                <Path d="M21 15l-5-5L5 21" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: '#6366F1',
                  fontFamily: 'Inter_700Bold',
                }}
              >
                Gallery
              </Text>
            </TouchableOpacity>
          </View>

          {/* Selected File Badge Preview */}
          {selectedFileName && (
            <View
              style={{
                backgroundColor: theme.colors.primarySoft,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: theme.colors.primary,
                  fontWeight: '600',
                  fontFamily: 'Inter_600SemiBold',
                }}
                numberOfLines={1}
              >
                📎 {selectedFileName}
              </Text>
              <TouchableOpacity onPress={() => setSelectedFileName(null)}>
                <Text style={{ fontSize: 12, color: theme.colors.danger, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Upload CTA Button */}
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.85}
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: theme.colors.textInverted,
                fontFamily: 'Inter_700Bold',
              }}
            >
              Upload Document
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EMRUploadModal;
