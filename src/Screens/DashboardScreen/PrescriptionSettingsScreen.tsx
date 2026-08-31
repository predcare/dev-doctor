import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import CommonConfirmModal from '../../components/commons/CommonConfirmModal/CommonConfirmModal';
import PopupAlert from '../../components/commons/PopupAlert/PopupAlert';
import SectionHeader from '../../components/commons/SectionHeader/SectionHeader';
import SignatureControl from '../../components/commons/SignatureControl/SignatureControl';
import UploadOptionsModal from '../../components/commons/UploadOptionsModal/UploadOptionsModal';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import {
  PrescriptionSettingsSchema,
  TPrescriptionSettingsSchemaType,
} from '../../lib/schemas/prescriptionSettings.schema';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { prescriptionSettingsStyles as S } from '../../styled/PrescriptionSettingsScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface PrescriptionSettingsScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const PrescriptionSettingsScreen: React.FC<PrescriptionSettingsScreenProps> = ({
  navigation,
  route,
}) => {
  const user = route?.params ? (route.params as any)?.user : undefined;

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  // CommonConfirmModal state
  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    title?: string;
    message?: string;
    onConfirm?: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
  });

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({
      visible: true,
      title,
      message,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, visible: false }));
        onConfirm();
      },
    });
  };

  // Popup Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

  // Initial Mock Clinic Data
  const defaultClinicValues: TPrescriptionSettingsSchemaType = {
    clinic_name: user?.clinic_name || 'St. Jude Medical Center',
    clinic_address: user?.clinic_address || '123 Healthcare Blvd, Suite 400',
    clinic_phone: user?.clinic_phone || '+1 (555) 234-5678',
    clinic_email: user?.clinic_email || 'dr.jenkins@stjude.org',
    reg_no: user?.reg_no || 'MED-US-2024-9842',
    header_text: 'Mon - Sat: 09:00 AM - 05:00 PM  |  Emergency: +1 (800) 555-0199',
    footer_text: 'Thank you for visiting. Please take all prescribed medications as directed.',
    sig_mode: 'upload',
    typed_name: 'Dr. Sarah Jenkins',
  };

  const { control, handleSubmit, watch, setValue } = useForm<TPrescriptionSettingsSchemaType>({
    resolver: yupResolver(PrescriptionSettingsSchema),
    defaultValues: defaultClinicValues,
  });

  // Live watched form fields for real-time PDF header & footer preview
  const clinicName = watch('clinic_name') || '';
  const clinicAddress = watch('clinic_address') || '';
  const clinicPhone = watch('clinic_phone') || '';
  const clinicEmail = watch('clinic_email') || '';
  const regNo = watch('reg_no') || '';
  const footerText = watch('footer_text') || '';
  const sigMode = (watch('sig_mode') as 'upload' | 'generated') || 'upload';
  const typedName = watch('typed_name') || '';

  const handleSave = (goBackAfter = false) => {
    handleSubmit(_formData => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);

        if (goBackAfter && navigation && navigation.canGoBack()) {
          navigation.goBack();
        } else {
          showAlert(
            'success',
            'Saved ✅',
            'Prescription settings updated. All future prescriptions will use these details.'
          );
        }
      }, 600);
    })();
  };

  const pickImage = (source: 'gallery' | 'camera') => {
    const opts = {
      mediaType: 'photo' as const,
      quality: 0.85,
      maxWidth: 800,
      maxHeight: 200,
      selectionLimit: 1,
      saveToPhotos: false,
    };

    const cb = (response: any) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        showAlert(
          'error',
          'Camera Error',
          response.errorMessage || `Failed to access camera (${response.errorCode})`
        );
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setSignatureUrl(asset.uri);
        showAlert('success', 'Uploaded ✅', 'Signature loaded successfully.');
      }
    };

    if (source === 'gallery') {
      launchImageLibrary(opts as ImageLibraryOptions, cb);
    } else {
      setTimeout(() => {
        launchCamera(opts as CameraOptions, cb);
      }, 200);
    }
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={S.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation && navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          style={S.backBtn}
          activeOpacity={0.7}
        >
          <Text style={S.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={S.headerTitle}>Prescription Settings</Text>
        <TouchableOpacity
          style={[S.saveTopBtn, saved && S.saveTopBtnSaved]}
          onPress={() => handleSave(true)}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Text style={S.saveTopBtnText}>{saved ? '✓ Saved' : 'Save'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={S.scroll}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1: Prescription Header */}
        <SectionHeader color={theme.colors.primary} title="Prescription Header" />

        {/* Live Preview Banner */}
        <View style={S.previewCard}>
          <View style={S.previewBanner}>
            <View style={S.previewLogoBox}>
              <Text style={S.previewLogoTxt}>{'PRED\nCARE'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={S.previewClinicName} numberOfLines={1}>
                {clinicName || 'Clinic Name'}
              </Text>
              <Text style={S.previewSubline}>MULTI-SPECIALTY HEALTHCARE CENTER</Text>
              {clinicAddress || clinicPhone || clinicEmail ? (
                <Text style={S.previewContact} numberOfLines={1}>
                  {[clinicAddress, clinicPhone, clinicEmail].filter(Boolean).join('  |  ')}
                </Text>
              ) : null}
            </View>
            {regNo ? (
              <View style={S.previewRight}>
                <Text style={S.previewRightLabel}>Reg. No.</Text>
                <Text style={S.previewRightVal} numberOfLines={1}>
                  {regNo}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Read-Only Clinic Info Fields */}
        <View style={S.card}>
          <Text style={S.fieldLabel}>Clinic / Hospital Name</Text>
          <View style={S.readonlyField}>
            <Text style={S.readonlyText}>{clinicName || '—'}</Text>
          </View>
        </View>

        <View style={S.card}>
          <Text style={S.fieldLabel}>Address</Text>
          <View style={S.readonlyField}>
            <Text style={S.readonlyText}>{clinicAddress || '—'}</Text>
          </View>
        </View>

        <View style={S.twoCol}>
          <View style={[S.card, { flex: 1, marginRight: 6 }]}>
            <Text style={S.fieldLabel}>Phone</Text>
            <View style={S.readonlyField}>
              <Text style={S.readonlyText}>{clinicPhone || '—'}</Text>
            </View>
          </View>
          <View style={[S.card, { flex: 1, marginLeft: 6 }]}>
            <Text style={S.fieldLabel}>Email</Text>
            <View style={S.readonlyField}>
              <Text style={S.readonlyText} numberOfLines={1}>
                {clinicEmail || '—'}
              </Text>
            </View>
          </View>
        </View>

        <View style={S.card}>
          <Text style={S.fieldLabel}>Reg. No.</Text>
          <View style={S.readonlyField}>
            <Text style={S.readonlyText}>{regNo || '—'}</Text>
          </View>
        </View>

        {/* Editable Additional Header Note */}
        <View style={S.card}>
          <Text style={S.fieldLabel}>
            Additional Header Note <Text style={S.optional}>(optional)</Text>
          </Text>
          <Controller
            control={control}
            name="header_text"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[S.input, { minHeight: 50 }]}
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g. Mon-Sat 9am-6pm  |  Emergency: 1800-XXX-XXXX"
                placeholderTextColor={theme.colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* Section 2: Prescription Footer & Signature */}
        <SectionHeader color="#6366F1" title="Prescription Footer & Signature" />

        {/* Editable Footer Message */}
        <View style={S.card}>
          <Text style={S.fieldLabel}>Footer Message</Text>
          <Controller
            control={control}
            name="footer_text"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[S.input, { minHeight: 70 }]}
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g. Thank you for visiting. Please take medications as directed."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* Reusable Signature Control */}
        <SignatureControl
          sigMode={sigMode}
          onModeChange={mode => setValue('sig_mode', mode)}
          signatureUrl={signatureUrl}
          typedName={typedName}
          onTypedNameChange={val => setValue('typed_name', val)}
          onUploadPress={() => setUploadModalVisible(true)}
          onRemovePress={() =>
            showConfirm(
              'Remove Signature',
              'This will remove the signature from all future prescriptions.',
              () => {
                setSignatureUrl(null);
                showAlert('info', 'Removed', 'Signature removed successfully.');
              }
            )
          }
        />

        {/* Footer Preview Box */}
        <View style={S.card}>
          <Text style={S.fieldLabel}>Footer Preview</Text>
          <View style={S.footerPreview}>
            <View style={{ flex: 1 }}>
              {footerText ? (
                <Text style={S.footerPreviewText} numberOfLines={3}>
                  {footerText}
                </Text>
              ) : (
                <Text style={{ fontSize: 10, color: theme.colors.textMuted, fontStyle: 'italic' }}>
                  Footer text will appear here
                </Text>
              )}
              <Text style={S.footerNote}>
                Note: This prescription is valid for 30 days from date of issue.
              </Text>
            </View>
            {signatureUrl && sigMode === 'upload' ? (
              <View style={S.footerSigBox}>
                <Image source={{ uri: signatureUrl }} style={S.footerSigImg} resizeMode="contain" />
              </View>
            ) : null}
          </View>
        </View>

        {/* Bottom Save Buttons */}
        <TouchableOpacity
          style={[S.saveBtn, isSaving && { opacity: 0.6 }]}
          onPress={() => handleSave(true)}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          {isSaving ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <Text style={S.saveBtnTxt}>💾 Save & Go Back</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[S.secondaryBtn, isSaving && { opacity: 0.6 }]}
          onPress={() => handleSave(false)}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          {isSaving ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Text style={S.secondaryBtnTxt}>✅ Save Settings</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Upload Source Options Modal */}
      <UploadOptionsModal
        visible={uploadModalVisible}
        type="signature"
        title="Upload Doctor Signature"
        subtitle="Choose a source to add your signature"
        onSelectCamera={() => pickImage('camera')}
        onSelectGallery={() => pickImage('gallery')}
        onClose={() => setUploadModalVisible(false)}
      />

      {/* Confirmation Modal */}
      <CommonConfirmModal
        visible={confirmModal.visible}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => confirmModal.onConfirm?.()}
        onCancel={() => setConfirmModal(prev => ({ ...prev, visible: false }))}
      />

      {/* Popup Alert Modal */}
      <PopupAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onPress={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        closeOnBackdrop={true}
      />
    </SafeAreaWrapper>
  );
};

export default PrescriptionSettingsScreen;
