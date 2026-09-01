import React, { useCallback, useState } from 'react';
import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { formatDate } from '../../../../lib/common/common.utils';
import { TAddPatientSchemaType } from '../../../../lib/schemas/addPatient.schema';
import { theme } from '../../../../styled/theme.styled';
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
        {/* Profile Image */}
        <View style={s.group}>
          <Text style={s.lbl}>PROFILE IMAGE</Text>
          <View style={s.imgWrap}>
            <View style={s.imgCircle}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={s.imgPreview} />
              ) : (
                <View style={s.imgPlaceholder}>
                  <Text style={s.imgPlaceholderTxt}>👤</Text>
                </View>
              )}
              <TouchableOpacity
                style={s.imgCameraBtn}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                <Text style={{ color: '#FFF', fontSize: 12 }}>📷</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.imgHint}>Tap camera to upload</Text>
          </View>
        </View>

        {/* Assigned Doctor */}
        <View style={s.group}>
          <Text style={s.lbl}>ASSIGNED DOCTOR</Text>
          <View style={s.lockedRow}>
            <Text style={s.lockedTxt} numberOfLines={1}>
              {doctorName || 'Dr. Sarah Jenkins'}
            </Text>
            <Text style={{ fontSize: 14 }}>🔒</Text>
          </View>
          <Text style={s.lockedHint}>Doctor is automatically assigned to your account</Text>
        </View>

        {/* Registration Mode Selector */}
        <View style={s.group}>
          <Text style={s.lbl}>REGISTRATION MODE</Text>
          <View style={s.pillRow}>
            {(['create_new', 'existing_user'] as const).map(mode => {
              const active = selectionMode === mode;
              return (
                <TouchableOpacity
                  key={mode}
                  style={[s.pill, active && s.pillOn]}
                  onPress={() => handleSelectionMode(mode)}
                  activeOpacity={0.8}
                >
                  <Text style={[s.pillTxt, active && s.pillTxtOn]}>
                    {mode === 'create_new' ? 'Create New Patient' : 'Select Existing User'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Existing User Picker Field */}
        {selectionMode === 'existing_user' && (
          <View style={s.group}>
            <Text style={s.lbl}>
              SELECT USER <Text style={s.req}>*</Text>
            </Text>
            <TouchableOpacity
              style={[s.inpRow, !!errors.selected_user_id && s.inpErr]}
              onPress={() => setShowUserPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={selectedUser?.name ? s.inpTxt : s.inpPh} numberOfLines={1}>
                {selectedUser?.name || 'Tap to select a user…'}
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
            </TouchableOpacity>
            {errors.selected_user_id?.message && (
              <Text style={s.errTxt}>{String(errors.selected_user_id.message)}</Text>
            )}
          </View>
        )}

        {/* Create New Patient Fields */}
        {selectionMode === 'create_new' && (
          <>
            <View style={s.group}>
              <Text style={s.lbl}>
                FULL NAME <Text style={s.req}>*</Text>
              </Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[s.inp, !!errors.name && s.inpErr]}
                    placeholder="e.g. Eleanor Vance"
                    placeholderTextColor={theme.colors.textMuted}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="words"
                  />
                )}
              />
              {errors.name?.message && <Text style={s.errTxt}>{String(errors.name.message)}</Text>}
            </View>

            {/* Date of Birth Picker Field */}
            <View style={s.group}>
              <Text style={s.lbl}>DATE OF BIRTH</Text>
              <TouchableOpacity
                style={s.inpRow}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text style={s.inpTxt}>{formatDate(dateOfBirth)}</Text>
                <CalendarIcon size={18} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Gender */}
            <View style={s.group}>
              <Text style={s.lbl}>
                GENDER <Text style={s.req}>*</Text>
              </Text>
              <View style={s.pillRow}>
                {['Male', 'Female', 'Other'].map(g => {
                  const gLower = g.toLowerCase();
                  const active = genderValue === gLower;
                  return (
                    <TouchableOpacity
                      key={g}
                      style={[s.pill, active && s.pillOn]}
                      onPress={() => setValue('gender', gLower, { shouldValidate: true })}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.pillTxt, active && s.pillTxtOn]}>{g}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.gender?.message && (
                <Text style={s.errTxt}>{String(errors.gender.message)}</Text>
              )}
            </View>

            {/* Blood Group Modal Field */}
            <View style={s.group}>
              <Text style={s.lbl}>BLOOD GROUP</Text>
              <TouchableOpacity
                style={s.inpRow}
                onPress={() => setShowBGModal(true)}
                activeOpacity={0.7}
              >
                <Text style={bloodGroup ? s.inpTxt : s.inpPh}>
                  {bloodGroup || 'Select Blood Group'}
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.textMuted }}>▼</Text>
              </TouchableOpacity>
            </View>

            {/* Status */}
            <View style={s.group}>
              <Text style={s.lbl}>STATUS</Text>
              <View style={s.pillRow}>
                {(['active', 'inactive'] as const).map(st => {
                  const active = statusValue === st;
                  return (
                    <TouchableOpacity
                      key={st}
                      style={[s.pill, active && s.pillOn]}
                      onPress={() => setValue('status', st, { shouldValidate: true })}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.pillTxt, active && s.pillTxtOn]}>
                        {st.charAt(0).toUpperCase() + st.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* Date Picker Modal */}
        <DatePickerModal
          visible={showDatePicker}
          value={dateOfBirth}
          onChange={d => setValue('date_of_birth', d, { shouldValidate: true })}
          onClose={() => setShowDatePicker(false)}
        />

        {/* Blood Group Modal */}
        <BloodGroupModal
          visible={showBGModal}
          selectedGroup={bloodGroup || ''}
          onSelect={bg => setValue('blood_group', bg, { shouldValidate: true })}
          onClose={() => setShowBGModal(false)}
        />

        {/* User Picker Modal */}
        <UserPickerModal
          visible={showUserPicker}
          onClose={() => setShowUserPicker(false)}
          onPick={handlePickUser}
        />
      </>
    );
  }
);

const s = StyleSheet.create({
  group: { marginBottom: 18 },
  lbl: {
    fontSize: 11,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textMuted,
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  req: { color: theme.colors.danger },
  inp: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontWeight: '400',
    color: theme.colors.dark,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  inpErr: {
    borderColor: theme.colors.danger,
  },
  errTxt: {
    fontSize: 12,
    color: theme.colors.danger,
    marginTop: 5,
    fontWeight: '500',
  },
  inpRow: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  inpTxt: { fontSize: 15, fontWeight: '400', color: theme.colors.dark },
  inpPh: { fontSize: 15, fontWeight: '400', color: theme.colors.textMuted },
  pillRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillOn: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  pillTxt: { fontSize: 13, fontWeight: theme.fontWeight.semibold, color: theme.colors.textSlate },
  pillTxtOn: { color: theme.colors.surface },
  imgWrap: { alignItems: 'center', paddingVertical: 10 },
  imgCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: 'relative',
    marginBottom: 8,
  },
  imgPreview: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
  },
  imgPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surfaceBorder,
  },
  imgPlaceholderTxt: { fontSize: 36 },
  imgCameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  imgHint: { fontSize: 12, color: theme.colors.textMuted, fontWeight: '500' },
  lockedRow: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
  },
  lockedTxt: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    flex: 1,
    marginRight: 8,
  },
  lockedHint: { fontSize: 11, color: theme.colors.textMuted, marginTop: 5, fontStyle: 'italic' },
});

export default BasicInfoForm;
