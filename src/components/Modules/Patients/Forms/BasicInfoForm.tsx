import React, { useCallback, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import {
  Image,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { GenderOptions } from '../../../../config/constants';
import { formatDate } from '../../../../lib/common/common.utils';
import { showInfoToast } from '../../../../lib/common/toast.utils';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { BasicInfoStyles } from '../../../../styled/AddPatientStyles.styled';
import { theme } from '../../../../styled/theme.styled';
import { IAllPatientsDoc } from '../../../../typescripts/interfaces/patients.interfaces';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import PredDatePickerModal from '../../../commons/PredDatePickerModal/PredDatePickerModal';
import UploadOptionsModal from '../../../commons/UploadOptionsModal/UploadOptionsModal';
import CalendarIcon from '../../../ui/icons/CalendarIcon';
import BloodGroupModal from '../Modals/BloodGroupModal';
import UserPickerModal from '../Modals/UserPickerModal';

export interface BasicInfoFormProps {
  control: Control<TAddPatientSchemaType>;
  setValue: UseFormSetValue<TAddPatientSchemaType>;
  watch: UseFormWatch<TAddPatientSchemaType>;
  errors: FieldErrors<TAddPatientSchemaType>;
  selectedUser?: IAllPatientsDoc | null;
  setSelectedUser?: (u: IAllPatientsDoc | null) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = React.memo(
  ({ control, setValue, watch, errors, selectedUser, setSelectedUser }) => {
    const [showBGModal, setShowBGModal] = useState(false);
    const [showUserPicker, setShowUserPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false);
    const { userData } = useAuthStore(state => state);
    const selectionMode = watch('selectionMode');
    const profileImage = watch('profile_image');
    const dateOfBirth = watch('date_of_birth') || new Date(2000, 0, 1);
    const bloodGroup = watch('blood_group');
    const genderValue = watch('gender');

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
                    name: asset.fileName || `profile_${Date.now()}.png`,
                    type: asset.type || 'image/png',
                  };
                  setValue('profile_image', fileObj, { shouldValidate: true });
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

    const handleCamera = async () => {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Camera Permission Required',
            message: 'App requires access to your camera to take profile photos.',
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
                    name: asset.fileName || `profile_${Date.now()}.jpg`,
                    type: asset.type || 'image/jpeg',
                  };
                  setValue('profile_image', fileObj, { shouldValidate: true });
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

    const handlePickUser = useCallback(
      (u: IAllPatientsDoc) => {
        if (setSelectedUser) {
          setSelectedUser(u);
        }
        setValue('selected_user_id', Number(u.id), { shouldValidate: true });
        setValue('name', u.name || '', { shouldValidate: true });
        setValue('email', u.email || '', { shouldValidate: true });
        setValue('phone', u.phone_number || '', { shouldValidate: true });
        if (u.gender) {
          setValue('gender', u.gender.toLowerCase(), { shouldValidate: true });
        }
        if (u.date_of_birth) {
          setValue('date_of_birth', new Date(u.date_of_birth));
        }
      },
      [setSelectedUser, setValue]
    );

    const handleSelectionMode = useCallback(
      (mode: 'create_new' | 'existing_user') => {
        setValue('selectionMode', mode, { shouldValidate: true });
        if (setSelectedUser) setSelectedUser(null);
        setValue('selected_user_id', null);
        if (mode === 'create_new') {
          setValue('name', '');
          setValue('email', '');
          setValue('phone', '');
          setValue('gender', '');
          setValue('date_of_birth', new Date(2000, 0, 1));
        }
      },
      [setSelectedUser, setValue]
    );

    const imageUri =
      typeof profileImage === 'object' && profileImage
        ? (profileImage as any)?.uri
        : typeof profileImage === 'string'
        ? profileImage
        : undefined;

    return (
      <>
        <View style={BasicInfoStyles.group}>
          <Text style={BasicInfoStyles.lbl}>PROFILE IMAGE</Text>
          <View style={BasicInfoStyles.imgWrap}>
            <View style={BasicInfoStyles.imgCircle}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={BasicInfoStyles.imgPreview} />
              ) : (
                <View style={BasicInfoStyles.imgPlaceholder}>
                  <Text style={BasicInfoStyles.imgPlaceholderTxt}>👤</Text>
                </View>
              )}
              <TouchableOpacity
                style={BasicInfoStyles.imgCameraBtn}
                onPress={() => setShowUploadOptions(true)}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFF', fontSize: 12 }}>📷</Text>
              </TouchableOpacity>
            </View>
            <Text style={BasicInfoStyles.imgHint}>Tap camera to upload</Text>
          </View>
        </View>
        <View style={BasicInfoStyles.group}>
          <Text style={BasicInfoStyles.lbl}>ASSIGNED DOCTOR</Text>
          <View style={BasicInfoStyles.lockedRow}>
            <Text style={BasicInfoStyles.lockedTxt} numberOfLines={1}>
              Dr. {userData?.name}
            </Text>
            <Text style={{ fontSize: 14 }}>🔒</Text>
          </View>
          <Text style={BasicInfoStyles.lockedHint}>
            Doctor is automatically assigned to your account
          </Text>
        </View>
        <View style={BasicInfoStyles.group}>
          <Text style={BasicInfoStyles.lbl}>REGISTRATION MODE</Text>
          <View style={BasicInfoStyles.pillRow}>
            {(['create_new', 'existing_user'] as const).map(mode => {
              const active = selectionMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[BasicInfoStyles.pill, active && BasicInfoStyles.pillOn]}
                  onPress={() => handleSelectionMode(mode)}
                  activeOpacity={0.8}
                >
                  <Text style={[BasicInfoStyles.pillTxt, active && BasicInfoStyles.pillTxtOn]}>
                    {mode === 'create_new' ? 'Create New Patient' : 'Select Existing User'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {selectionMode === 'existing_user' && (
          <View style={BasicInfoStyles.group}>
            <Text style={BasicInfoStyles.lbl}>
              SELECT USER <Text style={BasicInfoStyles.req}>*</Text>
            </Text>
            <TouchableOpacity
              style={[BasicInfoStyles.inpRow, !!errors.selected_user_id && BasicInfoStyles.inpErr]}
              onPress={() => setShowUserPicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={selectedUser?.name ? BasicInfoStyles.inpTxt : BasicInfoStyles.inpPh}
                numberOfLines={1}
              >
                {selectedUser?.name || 'Tap to select a user…'}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
            {errors.selected_user_id?.message && (
              <Text style={BasicInfoStyles.errTxt}>{String(errors.selected_user_id.message)}</Text>
            )}
          </View>
        )}
        {selectionMode === 'create_new' && (
          <>
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>
                FULL NAME <Text style={BasicInfoStyles.req}>*</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[BasicInfoStyles.inp, !!errors.name && BasicInfoStyles.inpErr]}
                    placeholder="e.g. Eleanor Vance"
                    placeholderTextColor={theme.colors.textMuted}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.name?.message && (
                <Text style={BasicInfoStyles.errTxt}>{String(errors.name.message)}</Text>
              )}
            </View>
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>DATE OF BIRTH</Text>
              <TouchableOpacity
                style={BasicInfoStyles.inpRow}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={BasicInfoStyles.inpTxt}>{formatDate(dateOfBirth)}</Text>
                <CalendarIcon size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>
                GENDER <Text style={BasicInfoStyles.req}>*</Text>
              </Text>
              <View style={BasicInfoStyles.pillRow}>
                {GenderOptions.map(g => {
                  const gLower = g.toLowerCase();
                  const active = genderValue === gLower;
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[BasicInfoStyles.pill, active && BasicInfoStyles.pillOn]}
                      onPress={() => setValue('gender', gLower, { shouldValidate: true })}
                      activeOpacity={0.8}
                    >
                      <Text style={[BasicInfoStyles.pillTxt, active && BasicInfoStyles.pillTxtOn]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.gender?.message && (
                <Text style={BasicInfoStyles.errTxt}>{String(errors.gender.message)}</Text>
              )}
            </View>

            {/* Blood Group Modal Field */}
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>BLOOD GROUP</Text>
              <TouchableOpacity
                style={BasicInfoStyles.inpRow}
                onPress={() => setShowBGModal(true)}
                activeOpacity={0.7}
              >
                <Text style={bloodGroup ? BasicInfoStyles.inpTxt : BasicInfoStyles.inpPh}>
                  {bloodGroup || 'Select Blood Group'}
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {showDatePicker && (
          <PredDatePickerModal
            visible={showDatePicker}
            value={dateOfBirth}
            title="Select Date of Birth"
            maxYear={new Date().getFullYear()}
            onConfirm={d => {
              setShowDatePicker(false);
              setValue('date_of_birth', d, { shouldValidate: true });
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        )}
        {showBGModal && (
          <BloodGroupModal
            visible={showBGModal}
            selectedGroup={bloodGroup || ''}
            onSelect={bg => setValue('blood_group', bg, { shouldValidate: true })}
            onClose={() => setShowBGModal(false)}
          />
        )}
        {showUserPicker && (
          <UserPickerModal
            visible={showUserPicker}
            onClose={() => setShowUserPicker(false)}
            onPick={handlePickUser}
          />
        )}
        {showUploadOptions && (
          <UploadOptionsModal
            visible={showUploadOptions}
            type="profile"
            title="Upload Patient Photo"
            subtitle="Choose a source to add patient profile picture"
            onSelectCamera={handleCamera}
            onSelectGallery={handleGallery}
            onClose={() => setShowUploadOptions(false)}
          />
        )}
      </>
    );
  }
);

export default BasicInfoForm;
