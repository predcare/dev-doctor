import React, { useCallback, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { formatDate } from '../../../../lib/common/common.utils';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { BasicInfoStyles } from '../../../../styled/AddPatientStyles.styled';
import { theme } from '../../../../styled/theme.styled';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import DatePickerModal from '../../../commons/DatePickerModal/DatePickerModal';
import CalendarIcon from '../../../ui/icons/CalendarIcon';
import BloodGroupModal from '../Modals/BloodGroupModal';
import UserPickerModal, { MockUserItem } from '../Modals/UserPickerModal';

export interface BasicInfoFormProps {
  control: Control<TAddPatientSchemaType>;
  setValue: UseFormSetValue<TAddPatientSchemaType>;
  watch: UseFormWatch<TAddPatientSchemaType>;
  errors: FieldErrors<TAddPatientSchemaType>;
  doctorName: string;
  selectedUser?: MockUserItem | null;
  setSelectedUser?: (u: MockUserItem | null) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = React.memo(
  ({ control, setValue, watch, errors, doctorName, selectedUser, setSelectedUser }) => {
    const [showBGModal, setShowBGModal] = useState(false);
    const [showUserPicker, setShowUserPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const { userData } = useAuthStore(state => state);
    const selectionMode = watch('selectionMode');
    const profileImage = watch('profile_image');
    const dateOfBirth = watch('date_of_birth') || new Date(2000, 0, 1);
    const bloodGroup = watch('blood_group');
    const genderValue = watch('gender');
    const statusValue = watch('status');

    const handlePickImage = async () => {
      try {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 0.7,
          maxWidth: 400,
          maxHeight: 400,
        });
        if (!result.didCancel && result.assets && result.assets[0]?.uri) {
          setValue('profile_image', result.assets[0].uri);
        }
      } catch (e) {
        console.error('Image pick error:', e);
      }
    };

    const handlePickUser = useCallback(
      (u: MockUserItem) => {
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

    return (
      <>
        <View style={BasicInfoStyles.group}>
          <Text style={BasicInfoStyles.lbl}>PROFILE IMAGE</Text>
          <View style={BasicInfoStyles.imgWrap}>
            <View style={BasicInfoStyles.imgCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={BasicInfoStyles.imgPreview} />
              ) : (
                <View style={BasicInfoStyles.imgPlaceholder}>
                  <Text style={BasicInfoStyles.imgPlaceholderTxt}>👤</Text>
                </View>
              )}
              <TouchableOpacity
                style={BasicInfoStyles.imgCameraBtn}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFF', fontSize: 12 }}>📷</Text>
              </TouchableOpacity>
            </View>
            <Text style={BasicInfoStyles.imgHint}>Tap camera to upload</Text>
          </View>
        </View>

        {/* Assigned Doctor */}
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

        {/* Registration Mode Selector */}
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

        {/* Existing User Picker Field */}
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

        {/* Create New Patient Fields */}
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

            {/* Date of Birth Picker Field */}
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

            {/* Gender */}
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>
                GENDER <Text style={BasicInfoStyles.req}>*</Text>
              </Text>
              <View style={BasicInfoStyles.pillRow}>
                {['Male', 'Female', 'Other'].map(g => {
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

            {/* Status */}
            <View style={BasicInfoStyles.group}>
              <Text style={BasicInfoStyles.lbl}>STATUS</Text>
              <View style={BasicInfoStyles.pillRow}>
                {(['active', 'inactive'] as const).map(st => {
                  const active = statusValue === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[BasicInfoStyles.pill, active && BasicInfoStyles.pillOn]}
                      onPress={() => setValue('status', st, { shouldValidate: true })}
                      activeOpacity={0.8}
                    >
                      <Text style={[BasicInfoStyles.pillTxt, active && BasicInfoStyles.pillTxtOn]}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        <DatePickerModal
          visible={showDatePicker}
          value={dateOfBirth}
          onChange={d => setValue('date_of_birth', d, { shouldValidate: true })}
          onClose={() => setShowDatePicker(false)}
        />
        <BloodGroupModal
          visible={showBGModal}
          selectedGroup={bloodGroup || ''}
          onSelect={bg => setValue('blood_group', bg, { shouldValidate: true })}
          onClose={() => setShowBGModal(false)}
        />
        <UserPickerModal
          visible={showUserPicker}
          onClose={() => setShowUserPicker(false)}
          onPick={handlePickUser}
        />
      </>
    );
  }
);

export default BasicInfoForm;
