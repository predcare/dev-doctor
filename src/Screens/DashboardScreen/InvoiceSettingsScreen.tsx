import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ActivityIndicator,
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
  InvoiceSettingsSchema,
  TInvoiceSettingsSchemaType,
} from '../../lib/schemas/invoiceSettings.schema';
import type {
  ProfileScreenNavigationProp,
  ProfileScreenRouteProp,
} from '../../route';
import { invoiceSettingsStyles as S } from '../../styled/InvoiceSettingsScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface InvoiceSettingsScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const InvoiceSettingsScreen: React.FC<InvoiceSettingsScreenProps> = ({
  navigation,
  route,
}) => {
  const user = route?.params ? (route.params as any)?.user : undefined;

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showGstPicker, setShowGstPicker] = useState(false);
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

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
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
    message?: string,
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

  // Default Mock Values
  const defaultInvoiceValues: TInvoiceSettingsSchemaType = {
    clinic_name: user?.clinic_name || 'St. Jude Medical Center',
    clinic_address: user?.clinic_address || '123 Healthcare Blvd, Suite 400',
    clinic_phone: user?.clinic_phone || '+1 (555) 234-5678',
    clinic_email: user?.clinic_email || 'dr.jenkins@stjude.org',
    reg_no: user?.reg_no || 'MED-US-2024-9842',
    clinic_gstin: '29ABCDE1234F1Z5',
    header_note: 'Multi-Specialty Healthcare Center',
    invoice_prefix: 'INV',
    gst_type: 'none',
    footer_note:
      'Thank you for choosing St. Jude Medical Center. Please keep this invoice for records.',
    terms_conditions:
      'Payment due upon receipt. Refunds processed within 7 business days.',
    sig_mode: 'upload',
    typed_name: 'Dr. Sarah Jenkins',
  };

  const { control, handleSubmit, watch, setValue } =
    useForm<TInvoiceSettingsSchemaType>({
      resolver: yupResolver(InvoiceSettingsSchema),
      defaultValues: defaultInvoiceValues,
    });

  // Watched form values for live PDF preview
  const clinicName = watch('clinic_name') || '';
  const clinicAddress = watch('clinic_address') || '';
  const clinicPhone = watch('clinic_phone') || '';
  const clinicEmail = watch('clinic_email') || '';
  const regNo = watch('reg_no') || '';
  const clinicGstin = watch('clinic_gstin') || '';
  const headerNote = watch('header_note') || '';
  const invoicePrefix = watch('invoice_prefix') || 'INV';
  const gstType = watch('gst_type') || 'none';
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
            'Invoice settings updated. All future invoices will use these details automatically.',
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
          response.errorMessage ||
            `Failed to access camera (${response.errorCode})`,
        );
        return;
      }
      const asset = response.assets?.[0];
      if (asset?.uri) {
        setSignatureUrl(asset.uri);
        showAlert(
          'success',
          'Uploaded ✅',
          'Authorised signature loaded successfully.',
        );
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
        <Text style={S.headerTitle}>Invoice Settings</Text>
        <TouchableOpacity
          style={[S.saveTopBtn, saved && S.saveTopBtnSaved]}
          onPress={() => handleSave(true)}
          disabled={isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={theme.colors.surface} />
          ) : (
            <Text style={S.saveTopBtnTxt}>{saved ? '✓ Saved' : 'Save'}</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={S.scroll}
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Section 1: Invoice Header */}
        <SectionHeader color={theme.colors.primary} title="Invoice Header" />

        {/* Live PDF Header Preview */}
        <View style={S.pdfPreviewCard}>
          <Text style={S.previewLabel}>
            Preview — How it will appear on the PDF
          </Text>
          <View style={S.pdfHeaderPreview}>
            <View style={S.previewLogoBox}>
              <Text style={S.previewLogoTxt}>{'PRED\nCARE'}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={S.previewClinicName} numberOfLines={1}>
                {clinicName || 'Clinic Name'}
              </Text>
              <Text style={S.previewSubline}>
                {headerNote
                  ? headerNote.toUpperCase()
                  : 'MULTI-SPECIALTY HEALTHCARE CENTER'}
              </Text>
              {clinicAddress || clinicPhone || clinicEmail ? (
                <Text style={S.previewContact} numberOfLines={1}>
                  {[clinicAddress, clinicPhone, clinicEmail]
                    .filter(Boolean)
                    .join('  |  ')}
                </Text>
              ) : null}
            </View>
            <View style={{ alignItems: 'flex-end', minWidth: 80 }}>
              {regNo ? (
                <>
                  <Text style={S.previewRightLabel}>REG. NO.</Text>
                  <Text style={S.previewRightVal} numberOfLines={1}>
                    {regNo}
                  </Text>
                </>
              ) : null}
              {clinicGstin ? (
                <>
                  <Text style={[S.previewRightLabel, { marginTop: 4 }]}>
                    GSTIN
                  </Text>
                  <Text style={S.previewRightVal}>{clinicGstin}</Text>
                </>
              ) : null}
            </View>
          </View>

          {/* Invoice Prefix Banner Strip */}
          <View style={S.pdfStripPreview}>
            <Text style={S.pdfStripText}>INVOICE</Text>
            <Text
              style={[
                S.pdfStripText,
                { fontSize: 9, opacity: 0.75, marginLeft: 12 },
              ]}
            >
              {invoicePrefix}-2024-001
            </Text>
          </View>
        </View>

        {/* Read-Only Clinic Name & Address */}
        <View style={S.fieldCard}>
          <Text style={S.fieldLabel}>Clinic / Hospital Name</Text>
          <View style={S.readonlyField}>
            <Text style={S.readonlyText}>{clinicName || '—'}</Text>
          </View>
        </View>

        <View style={S.fieldCard}>
          <Text style={S.fieldLabel}>Address</Text>
          <View style={S.readonlyField}>
            <Text style={S.readonlyText}>{clinicAddress || '—'}</Text>
          </View>
        </View>

        {/* Read-Only Phone & Email */}
        <View style={S.twoCol}>
          <View style={[S.fieldCard, { flex: 1, marginRight: 6 }]}>
            <Text style={S.fieldLabel}>Phone</Text>
            <View style={S.readonlyField}>
              <Text style={S.readonlyText}>{clinicPhone || '—'}</Text>
            </View>
          </View>
          <View style={[S.fieldCard, { flex: 1, marginLeft: 6 }]}>
            <Text style={S.fieldLabel}>Email</Text>
            <View style={S.readonlyField}>
              <Text style={S.readonlyText} numberOfLines={1}>
                {clinicEmail || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Reg. No & Editable GSTIN */}
        <View style={S.twoCol}>
          <View style={[S.fieldCard, { flex: 1, marginRight: 6 }]}>
            <Text style={S.fieldLabel}>Reg. No.</Text>
            <View style={S.readonlyField}>
              <Text style={S.readonlyText}>{regNo || '—'}</Text>
            </View>
          </View>
          <View style={[S.fieldCard, { flex: 1, marginLeft: 6 }]}>
            <Text style={S.fieldLabel}>GSTIN</Text>
            <Controller
              control={control}
              name="clinic_gstin"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.input}
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="29XXXXX1234Z5"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="characters"
                />
              )}
            />
          </View>
        </View>

        {/* Header Note & Invoice Prefix */}
        <View style={S.twoCol}>
          <View style={[S.fieldCard, { flex: 2, marginRight: 6 }]}>
            <Text style={S.fieldLabel}>
              Header Note <Text style={S.opt}>(optional)</Text>
            </Text>
            <Controller
              control={control}
              name="header_note"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.input}
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="e.g. Multi-Specialty Healthcare Center"
                  placeholderTextColor={theme.colors.textMuted}
                />
              )}
            />
          </View>
          <View style={[S.fieldCard, { flex: 1, marginLeft: 6 }]}>
            <Text style={S.fieldLabel}>Invoice Prefix</Text>
            <Controller
              control={control}
              name="invoice_prefix"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={S.input}
                  value={value || ''}
                  onChangeText={onChange}
                  placeholder="INV"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="characters"
                />
              )}
            />
          </View>
        </View>

        {/* GST Type Dropdown Selector */}
        <View style={S.fieldCard}>
          <Text style={S.fieldLabel}>Default GST Type</Text>
          <Text style={S.fieldHint}>
            Set once — auto-applied every time you create an invoice.
          </Text>
          <TouchableOpacity
            style={S.gstSelector}
            onPress={() => setShowGstPicker(v => !v)}
            activeOpacity={0.8}
          >
            <Text style={S.gstSelectorTxt}>
              {gstType === 'none'
                ? 'None / Not Applicable'
                : gstType === 'intra'
                ? 'Intra-State (CGST + SGST)'
                : 'Inter-State (IGST)'}
            </Text>
            <Text style={{ fontSize: 12, color: theme.colors.textMuted }}>
              ▾
            </Text>
          </TouchableOpacity>
          {showGstPicker && (
            <View style={S.gstPickerBox}>
              {(
                [
                  { key: 'none', label: 'None / Not Applicable' },
                  { key: 'intra', label: 'Intra-State (CGST + SGST)' },
                  { key: 'inter', label: 'Inter-State (IGST)' },
                ] as const
              ).map(opt => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    S.gstPickerOpt,
                    gstType === opt.key && S.gstPickerOptActive,
                  ]}
                  onPress={() => {
                    setValue('gst_type', opt.key);
                    setShowGstPicker(false);
                  }}
                >
                  <Text
                    style={[
                      S.gstPickerOptTxt,
                      gstType === opt.key && {
                        color: theme.colors.primary,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Section 2: Invoice Footer & Signature */}
        <SectionHeader color="#6366F1" title="Invoice Footer & Signature" />

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
              'This will remove the signature from all future invoices.',
              () => {
                setSignatureUrl(null);
                showAlert('info', 'Removed', 'Signature removed successfully.');
              },
            )
          }
        />

        {/* Editable Footer Note */}
        <View style={S.fieldCard}>
          <Text style={S.fieldLabel}>Footer Note</Text>
          <Controller
            control={control}
            name="footer_note"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[S.input, { minHeight: 60 }]}
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g. Thank you for choosing St. Jude Medical Center."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            )}
          />
        </View>

        {/* Editable Terms & Conditions */}
        <View style={S.fieldCard}>
          <Text style={S.fieldLabel}>Terms & Conditions (Optional)</Text>
          <Controller
            control={control}
            name="terms_conditions"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[S.input, { minHeight: 60 }]}
                value={value || ''}
                onChangeText={onChange}
                placeholder="e.g. Payment due upon receipt. No refunds after 7 days."
                placeholderTextColor={theme.colors.textMuted}
                multiline
                textAlignVertical="top"
              />
            )}
          />
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
        title="Upload Authorised Signature"
        subtitle="Choose a source to add your authorised signature"
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

export default InvoiceSettingsScreen;
