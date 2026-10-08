import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import UploadOptionsModal from '../../../../components/commons/UploadOptionsModal/UploadOptionsModal';
import { ChevronDownIcon, CloseIcon, FileIcon } from '../../../../components/ui/icons';
import { EMR_Record_Category } from '../../../../config/constants';
import useDevicePermissions from '../../../../hooks/commons/useDevicePermissions';
import { useUploadEmr } from '../../../../hooks/react-query/patients/patients.hooks';
import { showInfoToast } from '../../../../lib/commons/toast.utils';
import { emrUploadSchema, TEMRUploadFormValues } from '../../../../lib/schemas/emrUpload.schema';
import emrUploadModalStyles from '../../../../styled/EMRUploadModal.styled';
import { useMeetingStore } from '../../../../zustand/stores/useMeetingStore';

export interface EMRUploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
  patientId?: number | string;
  appointmentId?: number | string;
  doctorId?: number | string;
}

export const EMRUploadModal: React.FC<EMRUploadModalProps> = ({
  visible,
  onClose,
  onUploadSuccess,
  patientId,
  doctorId,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const { mutate, isPending } = useUploadEmr();
  const { appointmentId } = useMeetingStore(state => state);
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
  const { requestCameraPermission } = useDevicePermissions();

  const handleCamera = async () => {
    try {
      const granted = await requestCameraPermission({
        title: 'Camera Permission Required',
        message: 'App requires access to your camera to take photos of EMR documents.',
        showAlertOnDenied: false,
      });

      if (!granted) {
        showInfoToast('Camera permission is required to capture photos', 'Camera Permission');
        return;
      }

      setShowUploadOptions(false);
      useMeetingStore.getState().setIsCameraPausedForCapture(true);

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
              useMeetingStore.getState().setIsCameraPausedForCapture(false);
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
      useMeetingStore.getState().setIsCameraPausedForCapture(false);
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
    formData.append('description', (data.notes || '').trim());
    if (patientId) formData.append('patient_id', String(patientId));
    if (doctorId) formData.append('doctor_id', String(doctorId));
    if (appointmentId) formData.append('appointment_id', String(appointmentId));
    formData.append('visible_to_patient', data.shareWithPatient ? 'true' : 'false');
    formData.append('created_from', 'app');
    mutate(formData, {
      onSuccess: res => {
        if (res?.success) {
          reset();
          onUploadSuccess?.();
          onClose();
        }
      },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCloseModal}>
      <TouchableWithoutFeedback
        onPress={() => {
          if (showCategoryDropdown) {
            setShowCategoryDropdown(false);
          } else {
            handleCloseModal();
          }
        }}
      >
        <View style={emrUploadModalStyles.modalOverlay}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (showCategoryDropdown) {
                setShowCategoryDropdown(false);
              }
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={emrUploadModalStyles.sheetContainer}
            >
              <View style={emrUploadModalStyles.headerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={emrUploadModalStyles.headerTitle}>Upload EMR</Text>
                  <Text style={emrUploadModalStyles.headerSubtitle}>Add to patient’s record</Text>
                </View>
                <TouchableOpacity
                  onPress={handleCloseModal}
                  style={emrUploadModalStyles.closeButton}
                  activeOpacity={0.7}
                >
                  <CloseIcon size={16} color="#64748B" strokeWidth={2.2} />
                </TouchableOpacity>
              </View>

              <View style={emrUploadModalStyles.headerDivider} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={emrUploadModalStyles.formContainer}
                keyboardShouldPersistTaps="handled"
                onTouchStart={() => {
                  if (showCategoryDropdown) {
                    setShowCategoryDropdown(false);
                  }
                }}
              >
                {/* Category Field */}
                <View style={emrUploadModalStyles.fieldGroup}>
                  <Text style={emrUploadModalStyles.fieldLabel}>
                    Category <Text style={emrUploadModalStyles.asterisk}>*</Text>
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowCategoryDropdown(prev => !prev)}
                    style={[emrUploadModalStyles.selectBox, errors.category && emrUploadModalStyles.selectBoxError]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={selectedCategory ? emrUploadModalStyles.selectValueText : emrUploadModalStyles.selectPlaceholder}
                    >
                      {selectedCategory || 'Select category...'}
                    </Text>
                    <ChevronDownIcon size={16} color="#64748B" strokeWidth={2} />
                  </TouchableOpacity>

                  {/* Inline Dropdown Options */}
                  {showCategoryDropdown && (
                    <View style={emrUploadModalStyles.inlineDropdownList} onTouchStart={e => e.stopPropagation()}>
                      <ScrollView
                        nestedScrollEnabled
                        persistentScrollbar={true}
                        showsVerticalScrollIndicator={true}
                        style={{ maxHeight: 180 }}
                      >
                        {EMR_Record_Category.map((cat, index) => {
                          const isSelected = cat === selectedCategory;
                          return (
                            <TouchableOpacity
                              key={cat}
                              onPress={() => {
                                setValue('category', cat, { shouldValidate: true });
                                setShowCategoryDropdown(false);
                                setValue('title', cat);
                              }}
                              style={[
                                emrUploadModalStyles.inlineDropdownItem,
                                isSelected && emrUploadModalStyles.inlineDropdownItemActive,
                                index === EMR_Record_Category.length - 1 && {
                                  borderBottomWidth: 0,
                                },
                              ]}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  emrUploadModalStyles.inlineDropdownText,
                                  isSelected && emrUploadModalStyles.inlineDropdownTextActive,
                                ]}
                              >
                                {cat}
                              </Text>
                              {isSelected && (
                                <Text style={{ color: '#0F766E', fontWeight: '600', fontSize: 12 }}>
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
                    <Text style={emrUploadModalStyles.errorText}>{errors.category.message}</Text>
                  )}
                </View>

                {/* Title Field */}
                <View style={emrUploadModalStyles.fieldGroup}>
                  <Text style={emrUploadModalStyles.fieldLabel}>
                    Title <Text style={emrUploadModalStyles.asterisk}>*</Text>
                  </Text>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[emrUploadModalStyles.textInput, errors.title && emrUploadModalStyles.textInputError]}
                        placeholder="Document title..."
                        placeholderTextColor="#94A3B8"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  {errors.title && <Text style={emrUploadModalStyles.errorText}>{errors.title.message}</Text>}
                </View>

                {/* File Field */}
                <View style={emrUploadModalStyles.fieldGroup}>
                  <Text style={emrUploadModalStyles.fieldLabel}>
                    File <Text style={emrUploadModalStyles.asterisk}>*</Text>
                  </Text>
                  {selectedFile ? (
                    <View style={emrUploadModalStyles.selectedFileBadge}>
                      <View style={emrUploadModalStyles.selectedFileLeft}>
                        <FileIcon />
                        <Text style={emrUploadModalStyles.selectedFileName} numberOfLines={1}>
                          {selectedFile.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => setValue('file', null, { shouldValidate: true })}
                        style={emrUploadModalStyles.removeFileBtn}
                      >
                        <Text style={emrUploadModalStyles.removeFileTxt}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => setShowUploadOptions(true)}
                      style={[emrUploadModalStyles.chooseFileBox, errors.file && emrUploadModalStyles.chooseFileBoxError]}
                      activeOpacity={0.8}
                    >
                      <Text style={emrUploadModalStyles.chooseFileText}>Choose File</Text>
                    </TouchableOpacity>
                  )}
                  {errors.file && <Text style={emrUploadModalStyles.errorText}>{errors.file.message}</Text>}
                </View>

                {/* Notes Field */}
                <View style={emrUploadModalStyles.fieldGroup}>
                  <Text style={emrUploadModalStyles.fieldLabel}>Notes (Optional)</Text>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[emrUploadModalStyles.textInput, emrUploadModalStyles.notesInput]}
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
                    <View style={emrUploadModalStyles.shareContainer}>
                      <View style={emrUploadModalStyles.shareTextWrap}>
                        <Text style={emrUploadModalStyles.shareTitle}>Share with Patient</Text>
                        <Text style={emrUploadModalStyles.shareSubtitle}>Patient can view this document</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => onChange(!value)}
                        style={[
                          emrUploadModalStyles.toggleSwitch,
                          value ? emrUploadModalStyles.toggleSwitchOn : emrUploadModalStyles.toggleSwitchOff,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Text style={emrUploadModalStyles.toggleSwitchText}>{value ? 'ON' : 'OFF'}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <TouchableOpacity
                  onPress={() => handleSubmit(onSubmit)()}
                  style={emrUploadModalStyles.uploadButton}
                  activeOpacity={0.85}
                  disabled={isPending}
                >
                  <Text style={emrUploadModalStyles.uploadButtonText}>
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
