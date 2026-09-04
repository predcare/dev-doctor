import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';
import { EMR_Record_Category } from '../../../config/constants';
import { useUploadEmr } from '../../../hooks/react-query/patients/patients.hooks';
import { showInfoToast } from '../../../lib/common/toast.utils';
import { emrUploadSchema, TEMRUploadFormValues } from '../../../lib/schemas/emrUpload.schema';
import { emrUploadModalStyles as styles } from '../../../styled/EMRUploadModal.styled';
import UploadOptionsModal from '../../commons/UploadOptionsModal/UploadOptionsModal';

export interface EMRUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
  patientId?: number | string;
  appointmentId?: number | string;
  doctorId?: number | string;
}

const ChevronDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9l6 6 6-6"
      stroke="#64748B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke="#64748B"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FileIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9l-7-7z"
      stroke="#0F766E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 2v7h7"
      stroke="#0F766E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const EMRUploadModal: React.FC<EMRUploadModalProps> = ({
  visible,
  onClose,
  onUploadSuccess,
  patientId,
  appointmentId,
  doctorId,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const { mutate, isPending } = useUploadEmr();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TEMRUploadFormValues>({
    resolver: yupResolver(emrUploadSchema),
    defaultValues: {
      category: '',
      title: '',
      file: null,
      notes: '',
      shareWithPatient: true,
    },
  });

  const selectedFile = watch('file');
  const selectedCategory = watch('category');

  const handleCamera = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: 'Camera Permission Required',
          message: 'App requires access to your camera to take photos of EMR documents.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        });
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          showInfoToast('Camera permission is required to capture photos', 'Camera Permission');
          return;
        }
      }

      setShowUploadOptions(false);

      setTimeout(
        () => {
          launchCamera(
            {
              mediaType: 'photo',
              quality: 0.8,
              saveToPhotos: false,
              includeBase64: false,
            },
            res => {
              if (res.didCancel) return;
              if (res.errorCode) {
                console.warn('launchCamera errorCode:', res.errorCode, res.errorMessage);
                showInfoToast(
                  res.errorMessage || `Camera Error: ${res.errorCode}`,
                  'Camera Failure'
                );
                return;
              }
              if (res.assets && res.assets[0]) {
                const asset = res.assets[0];
                const fileObj = {
                  uri: asset.uri || '',
                  name: asset.fileName || `emr_${Date.now()}.jpg`,
                  type: asset.type || 'image/jpeg',
                };
                setValue('file', fileObj, { shouldValidate: true });
                showInfoToast('Photo captured successfully', 'Camera');
              }
            }
          );
        },
        Platform.OS === 'android' ? 200 : 50
      );
    } catch (err: any) {
      console.warn('handleCamera error:', err);
      showInfoToast('Could not open camera', 'Camera Error');
    }
  };

  const handleGallery = () => {
    try {
      setShowUploadOptions(false);

      setTimeout(
        () => {
          launchImageLibrary(
            {
              mediaType: 'photo',
              quality: 0.8,
              selectionLimit: 1,
              includeBase64: false,
            },
            res => {
              if (res.didCancel) return;
              if (res.errorCode) {
                console.warn('launchImageLibrary errorCode:', res.errorCode, res.errorMessage);
                showInfoToast(
                  res.errorMessage || `Gallery Error: ${res.errorCode}`,
                  'Gallery Failure'
                );
                return;
              }
              if (res.assets && res.assets[0]) {
                const asset = res.assets[0];
                const fileObj = {
                  uri: asset.uri || '',
                  name: asset.fileName || `emr_${Date.now()}.png`,
                  type: asset.type || 'image/png',
                };
                setValue('file', fileObj, { shouldValidate: true });
                showInfoToast('Image selected from gallery', 'Gallery');
              }
            }
          );
        },
        Platform.OS === 'android' ? 200 : 50
      );
    } catch (err: any) {
      console.warn('handleGallery error:', err);
      showInfoToast('Could not open gallery', 'Gallery Error');
    }
  };

  const handleCloseModal = () => {
    reset();
    setShowCategoryDropdown(false);
    setShowUploadOptions(false);
    onClose();
  };

  const onSubmit = (data: TEMRUploadFormValues) => {
    const formData = new FormData();
    if (data.file) {
      formData.append('file', {
        uri: data.file.uri,
        name: data.file.name,
        type: data.file.type,
      } as any);
    }
    formData.append('title', data.title.trim());
    formData.append('document_type', data.category);
    formData.append('notes', (data.notes || '').trim());
    if (appointmentId) formData.append('appointment_id', String(appointmentId));
    if (patientId) formData.append('patient_id', String(patientId));
    if (doctorId) formData.append('doctor_id', String(doctorId));
    formData.append('uploader_role', 'doctor');
    formData.append('visible_to_patient', data.shareWithPatient ? '1' : '0');

    mutate(formData, {
      onSuccess: () => {
        reset();
        onUploadSuccess?.();
        onClose();
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCloseModal}>
      <TouchableWithoutFeedback onPress={handleCloseModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.sheetContainer}
            >
              <View style={styles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.headerTitle}>Upload EMR</Text>
                  <Text style={styles.headerSubtitle}>Add to patient’s record</Text>
                </View>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={styles.closeButton}
                  activeOpacity={0.7}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>

              <View style={styles.headerDivider} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContainer}
                keyboardShouldPersistTaps="handled"
              >
                {/* Category Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Category <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryDropdown(prev => !prev)}
                    style={[styles.selectBox, errors.category && styles.selectBoxError]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={selectedCategory ? styles.selectValueText : styles.selectPlaceholder}
                    >
                      {selectedCategory || 'Select category...'}
                    </Text>
                    <ChevronDownIcon />
                  </TouchableOpacity>

                  {/* Inline Dropdown Options */}
                  {showCategoryDropdown && (
                    <View style={styles.inlineDropdownList}>
                      <ScrollView nestedScrollEnabled style={{ maxHeight: 180 }}>
                        {EMR_Record_Category.map((cat, index) => {
                          const isSelected = cat === selectedCategory;
                          return (
                            <TouchableOpacity
                              key={cat}
                              onPress={() => {
                                setValue('category', cat, { shouldValidate: true });
                                setShowCategoryDropdown(false);
                              }}
                              style={[
                                styles.inlineDropdownItem,
                                isSelected && styles.inlineDropdownItemActive,
                                index === EMR_Record_Category.length - 1 && {
                                  borderBottomWidth: 0,
                                },
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.inlineDropdownText,
                                  isSelected && styles.inlineDropdownTextActive,
                                ]}
                              >
                                {cat}
                              </Text>
                              {isSelected && (
                                <Text style={{ color: '#0F766E', fontWeight: '700', fontSize: 13 }}>
                                  ✓
                                </Text>
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </ScrollView>
                    </View>
                  )}

                  {errors.category && (
                    <Text style={styles.errorText}>{errors.category.message}</Text>
                  )}
                </View>

                {/* Title Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Title <Text style={styles.asterisk}>*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, errors.title && styles.textInputError]}
                        placeholder="Document title..."
                        placeholderTextColor="#94A3B8"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
                </View>

                {/* File Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    File <Text style={styles.asterisk}>*</Text>
                  </Text>
                  {selectedFile ? (
                    <View style={styles.selectedFileBadge}>
                      <View style={styles.selectedFileLeft}>
                        <FileIcon />
                        <Text style={styles.selectedFileName} numberOfLines={1}>
                          {selectedFile.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setValue('file', null, { shouldValidate: true })}
                        style={styles.removeFileBtn}
                      >
                        <Text style={styles.removeFileTxt}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowUploadOptions(true)}
                      style={[styles.chooseFileBox, errors.file && styles.chooseFileBoxError]}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.chooseFileText}>Choose File</Text>
                    </TouchableOpacity>
                  )}
                  {errors.file && <Text style={styles.errorText}>{errors.file.message}</Text>}
                </View>

                {/* Notes Field */}
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Notes (Optional)</Text>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.textInput, styles.notesInput]}
                        placeholder="Additional notes..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={3}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>
                <Controller
                  control={control}
                  name="shareWithPatient"
                  render={({ field: { onChange, value } }) => (
                    <View style={styles.shareContainer}>
                      <View style={styles.shareTextWrap}>
                        <Text style={styles.shareTitle}>Share with Patient</Text>
                        <Text style={styles.shareSubtitle}>Patient can view this document</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onChange(!value)}
                        style={[
                          styles.toggleSwitch,
                          value ? styles.toggleSwitchOn : styles.toggleSwitchOff,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.toggleSwitchText}>{value ? 'ON' : 'OFF'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <TouchableOpacity
                  onPress={handleSubmit(onSubmit)}
                  style={styles.uploadButton}
                  activeOpacity={0.85}
                  disabled={isPending}
                >
                  <Text style={styles.uploadButtonText}>
                    {isPending ? 'Uploading...' : 'Upload'}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
              <View style={{ zIndex: 999 }}>
                <UploadOptionsModal
                  visible={showUploadOptions}
                  title="Upload EMR Document"
                  subtitle="Choose a source to attach your medical file"
                  onClose={() => setShowUploadOptions(false)}
                  onSelectCamera={handleCamera}
                  onSelectGallery={handleGallery}
                />
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EMRUploadModal;
