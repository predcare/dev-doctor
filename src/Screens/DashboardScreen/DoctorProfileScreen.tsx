import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import ProfileInfoCard from '../../components/Modules/Profile/ProfileInfoCard';
import DoctorProfileSkeleton from '../../components/Skeletons/DoctorProfileSkeleton';
import CustomTabs from '../../components/ui/CustomTabs/CustomTabs';
import {
  AssociationIcon,
  BioIcon,
  CalendarIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ClinicIcon,
  EditIcon,
  ExperienceIcon,
  LicenseIcon,
  MailIcon,
  MapIcon,
  PhoneIcon,
  ProfileIcon,
  QualificationsIcon,
  RxIcon,
  ScheduleIcon,
  SpecializationIcon,
} from '../../components/ui/icons';
import LocationIcon from '../../components/ui/icons/LocaltionIcon';
import { useProfile } from '../../hooks/react-query/profile/profile.hooks';
import {
  capitalize,
  formatDate,
  getInitials,
  openLocationOnMap,
} from '../../lib/common/common.utils';
import {
  AppRoute,
  type ProfileScreenNavigationProp,
  type ProfileScreenRouteProp,
} from '../../route';
import { doctorProfileStyles } from '../../styled/DoctorProfileScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface DoctorProfileScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = () => {
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'pro' | 'clinic'>('pro');
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: doctorProfile, isPending: profilePending, refetch: profileRefetch } = useProfile();
  console.log('doctorProfile', doctorProfile);
  const { isActive, clinic } = useMemo(() => {
    const res = (doctorProfile?.doctor_status || doctorProfile?.status)?.toLowerCase() === 'active';
    return { isActive: res, clinic: doctorProfile?.clinic };
  }, [doctorProfile?.doctor_status, doctorProfile?.status, doctorProfile?.clinic]);

  const clinicAddress = useMemo(() => {
    if (!clinic) return doctorProfile?.clinic_address;
    return [clinic?.line1, clinic?.city, clinic?.state, clinic?.country, clinic?.pincode]
      .filter(Boolean)
      .join(', ');
  }, [clinic, doctorProfile?.clinic_address]);

  const subSpecializations = useMemo(() => {
    const raw = doctorProfile?.sub_specializations;
    if (!raw) return [];
    if (typeof raw === 'object') {
      return Object.entries(raw).flatMap(([cat, items]) =>
        Array.isArray(items) ? items.map(item => `${cat}: ${item}`) : `${cat}: ${items}`
      );
    }
    return Array.isArray(raw) ? raw : [String(raw)];
  }, [doctorProfile?.sub_specializations]);

  const onRefresh = useCallback(async () => {
    setIsRefetching(true);
    await profileRefetch();
    setIsRefetching(false);
  }, [profileRefetch]);

  const navigateToAccountTab = () => {
    navigation.navigate(AppRoute.MAIN_TABS, { screen: AppRoute.ACCOUNT });
  };

  const handleOpenMap = useCallback(() => {
    const loc = clinic?.location || doctorProfile?.clinic_location || doctorProfile?.location;
    openLocationOnMap({
      lat: loc?.lat,
      long: loc?.lng,
      address: clinicAddress,
    });
  }, [clinic?.location, doctorProfile?.clinic_location, doctorProfile?.location, clinicAddress]);

  if (profilePending || !doctorProfile) {
    return <DoctorProfileSkeleton />;
  }

  return (
    <SafeAreaWrapper>
      <View style={doctorProfileStyles.header}>
        <TouchableOpacity
          style={doctorProfileStyles.backBtn}
          onPress={() => navigation?.canGoBack?.() && navigation.goBack()}
          activeOpacity={0.8}
        >
          <ChevronLeftIcon size={18} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <Text style={doctorProfileStyles.headerTitle}>Doctor Profile</Text>
        <TouchableOpacity
          style={doctorProfileStyles.editBtn}
          onPress={navigateToAccountTab}
          activeOpacity={0.8}
        >
          <EditIcon size={14} color={theme.colors.primary} />
          <Text style={doctorProfileStyles.editTxt}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={doctorProfileStyles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={doctorProfileStyles.hero}>
          <View style={doctorProfileStyles.heroRow}>
            <View style={doctorProfileStyles.avatarWrap}>
              <View style={doctorProfileStyles.avatarRing}>
                <View style={doctorProfileStyles.avatarCircle}>
                  <Text style={doctorProfileStyles.avatarTxt}>
                    {getInitials(doctorProfile.name || '')}
                  </Text>
                </View>
              </View>
              <View style={doctorProfileStyles.verifiedBadge}>
                <CheckBadgeIcon color={theme.colors.surface} size={10} />
              </View>
            </View>
            <View style={doctorProfileStyles.heroInfo}>
              <Text style={doctorProfileStyles.drName}>
                {`${doctorProfile.salutation || 'DR.'} ${doctorProfile.name}`.toUpperCase()}
              </Text>
              <View style={doctorProfileStyles.idRow}>
                <Text style={doctorProfileStyles.drId}>ID: {doctorProfile.doctor_id}</Text>
                <View style={doctorProfileStyles.dot} />
                <View
                  style={[
                    doctorProfileStyles.activeBadge,
                    {
                      backgroundColor: isActive
                        ? theme.colors.successLight
                        : theme.colors.dangerLight,
                    },
                  ]}
                >
                  <View
                    style={[
                      doctorProfileStyles.activeDot,
                      {
                        backgroundColor: isActive ? theme.colors.success : theme.colors.danger,
                      },
                    ]}
                  />
                  <Text
                    style={[
                      doctorProfileStyles.activeTxt,
                      { color: isActive ? theme.colors.success : theme.colors.danger },
                    ]}
                  >
                    {isActive ? 'ACTIVE' : 'INACTIVE'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <CustomTabs
          tabs={[
            {
              key: 'pro',
              label: 'Professional Details',
              icon: (active: boolean) => (
                <ProfileIcon
                  color={active ? theme.colors.surface : theme.colors.textMuted}
                  size={16}
                />
              ),
            },
            {
              key: 'clinic',
              label: 'Clinic Info',
              icon: (active: boolean) => (
                <ClinicIcon
                  color={active ? theme.colors.surface : theme.colors.textMuted}
                  size={16}
                />
              ),
            },
          ]}
          activeTab={tab}
          onTabChange={setTab}
        />

        {tab === 'pro' && (
          <View style={doctorProfileStyles.card}>
            {doctorProfile.specialization && (
              <ProfileInfoCard
                label="SPECIALIZATION"
                value={doctorProfile.specialization}
                iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {subSpecializations.length > 0 && (
              <ProfileInfoCard
                label="SUB SPECIALIZATION"
                multiTag={true}
                tags={subSpecializations}
                iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.qualifications && (
              <ProfileInfoCard
                label="QUALIFICATIONS"
                value={doctorProfile.qualifications}
                iconPath={<QualificationsIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.experience_years != null && (
              <ProfileInfoCard
                label="EXPERIENCE"
                value={`${doctorProfile.experience_years} Years`}
                iconPath={<ExperienceIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.languages_spoken && doctorProfile.languages_spoken.length > 0 && (
              <ProfileInfoCard
                label="LANGUAGES SPOKEN"
                multiTag={true}
                tags={doctorProfile.languages_spoken}
                iconPath={<ProfileIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.gender && (
              <ProfileInfoCard
                label="GENDER"
                value={capitalize(doctorProfile.gender)}
                iconPath={<ProfileIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.email && (
              <ProfileInfoCard
                label="EMAIL"
                value={doctorProfile.email}
                iconPath={<MailIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.phone_number && (
              <ProfileInfoCard
                label="PHONE"
                value={doctorProfile.phone_number}
                iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.date_of_birth && (
              <ProfileInfoCard
                label="DATE OF BIRTH"
                value={formatDate(doctorProfile.date_of_birth)}
                iconPath={<CalendarIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.blood_type && (
              <ProfileInfoCard
                label="BLOOD TYPE"
                value={doctorProfile.blood_type}
                iconPath={<RxIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.address && (
              <ProfileInfoCard
                label="ADDRESS"
                value={doctorProfile.address}
                iconPath={<LocationIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.alternate_number && (
              <ProfileInfoCard
                label="ALTERNATE NUMBER"
                value={doctorProfile.alternate_number}
                iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.whatsapp_number && (
              <ProfileInfoCard
                label="WHATSAPP NUMBER"
                value={doctorProfile.whatsapp_number}
                iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.license_number && (
              <ProfileInfoCard
                label="MEDICAL LICENSE"
                value={doctorProfile.license_number}
                iconPath={<LicenseIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.verification_status && (
              <ProfileInfoCard
                label="VERIFICATION STATUS"
                value={capitalize(doctorProfile.verification_status)}
                iconPath={<CheckBadgeIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile.bio && (
              <ProfileInfoCard
                label="PROFESSIONAL BIO"
                value={doctorProfile.bio}
                iconPath={<BioIcon size={18} color={theme.colors.primary} />}
              />
            )}
          </View>
        )}

        {tab === 'clinic' && (
          <View style={doctorProfileStyles.card}>
            {clinic ? (
              <>
                {clinic.name && (
                  <ProfileInfoCard
                    label="CLINIC NAME"
                    value={clinic.name}
                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {/* {clinic.id && (
                  <ProfileInfoCard
                    label="CLINIC ID"
                    value={`Id:- ${clinic.id}`}
                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                  />
                )} */}
                {clinic.clinic_reg_number && (
                  <ProfileInfoCard
                    label="CLINIC REGISTRATION NUMBER"
                    value={clinic.clinic_reg_number}
                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {clinic.contact_numbers && clinic.contact_numbers.length > 0 && (
                  <ProfileInfoCard
                    label="CLINIC PHONE"
                    value={clinic.contact_numbers.join(', ')}
                    iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {clinicAddress && (
                  <ProfileInfoCard
                    label="CLINIC ADDRESS"
                    value={clinicAddress}
                    iconPath={<LocationIcon size={18} color={theme.colors.primary} />}
                    rightAction={
                      <TouchableOpacity
                        style={doctorProfileStyles.mapBtn}
                        onPress={handleOpenMap}
                        activeOpacity={0.7}
                      >
                        <MapIcon size={18} color={theme.colors.primary} />
                      </TouchableOpacity>
                    }
                  />
                )}
                {clinic.about && (
                  <ProfileInfoCard
                    label="ABOUT CLINIC"
                    value={clinic.about}
                    iconPath={<BioIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {clinic.specialities && clinic.specialities.length > 0 && (
                  <ProfileInfoCard
                    label="CLINIC SPECIALITIES"
                    multiTag={true}
                    tags={clinic.specialities}
                    iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {clinic.status && (
                  <ProfileInfoCard
                    label="ASSOCIATION STATUS"
                    value={capitalize(clinic.status)}
                    iconPath={<AssociationIcon size={18} color={theme.colors.primary} />}
                  />
                )}
              </>
            ) : (
              <View style={doctorProfileStyles.emptyTab}>
                <ClinicIcon color={theme.colors.textMuted} size={44} />
                <Text style={doctorProfileStyles.emptyTitle}>No Clinic Information</Text>
                <Text style={doctorProfileStyles.emptySub}>
                  Add your clinic details in Settings
                </Text>
                <TouchableOpacity
                  style={doctorProfileStyles.emptyBtn}
                  onPress={navigateToAccountTab}
                  activeOpacity={0.85}
                >
                  <Text style={doctorProfileStyles.emptyBtnTxt}>Go to Settings</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View style={doctorProfileStyles.actions}>
          <TouchableOpacity
            style={doctorProfileStyles.primaryBtn}
            onPress={() => navigation?.navigate(AppRoute.AVAILABILITY)}
            activeOpacity={0.87}
          >
            <ScheduleIcon color={theme.colors.surface} size={18} />
            <Text style={doctorProfileStyles.primaryBtnTxt}>Manage Availability</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={doctorProfileStyles.secondaryBtn}
            onPress={navigateToAccountTab}
            activeOpacity={0.87}
          >
            <ProfileIcon color={theme.colors.primary} size={18} />
            <Text style={doctorProfileStyles.secondaryBtnTxt}>Account Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default DoctorProfileScreen;
