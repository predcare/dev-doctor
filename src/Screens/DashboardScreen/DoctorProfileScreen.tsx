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
  ScheduleIcon,
  SpecializationIcon,
} from '../../components/ui/icons';
import LocationIcon from '../../components/ui/icons/LocaltionIcon';
import { useProfile } from '../../hooks/react-query/profile/profile.hooks';
import { capitalize, getInitials, openLocationOnMap } from '../../lib/common/common.utils';
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
  const navigation = useNavigation();
  const [tab, setTab] = useState<'pro' | 'clinic'>('pro');
  const [isRefetching, setIsRefetching] = useState(false);

  const { data: doctorProfile, isPending: profilePending, refetch: profileRefetch } = useProfile();

  const isActive = useMemo(() => {
    return doctorProfile?.status.toLowerCase() === 'active';
  }, [doctorProfile?.status]);

  const subSpecializations = useMemo(() => {
    const raw = doctorProfile?.sub_specializations;
    if (!raw) return [];
    let parsed = raw;
    if (typeof parsed === 'string') {
      try {
        parsed = JSON.parse(parsed);
      } catch {
        const items = parsed
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);
        const parent = doctorProfile?.specialization;
        return items.map((item: string) => (parent ? `${parent}: ${item}` : item));
      }
    }
    if (Array.isArray(parsed)) {
      const parent = doctorProfile?.specialization;
      return parsed
        .map((item: any) => String(item).trim())
        .filter(Boolean)
        .map((item: string) => (parent ? `${parent}: ${item}` : item));
    }
    if (typeof parsed === 'object' && parsed !== null) {
      const list: string[] = [];
      Object.entries(parsed).forEach(([category, val]: [string, any]) => {
        const catName = category.trim();
        if (Array.isArray(val)) {
          val.forEach((item: any) => {
            const itemStr = String(item).trim();
            if (itemStr) {
              list.push(catName ? `${catName}: ${itemStr}` : itemStr);
            }
          });
        } else if (typeof val === 'string' && val.trim()) {
          list.push(catName ? `${catName}: ${val.trim()}` : val.trim());
        }
      });
      return list.filter(Boolean);
    }
    return [];
  }, [doctorProfile?.sub_specializations, doctorProfile?.specialization]);

  const onRefresh = useCallback(async () => {
    setIsRefetching(true);
    await profileRefetch();
    setIsRefetching(false);
  }, [profileRefetch]);

  const navigateToAccountTab = () => {
    navigation.navigate(AppRoute.MAIN_TABS, {
      screen: AppRoute.ACCOUNT,
    });
  };

  const handleOpenMap = useCallback(() => {
    openLocationOnMap({
      lat: doctorProfile?.clinic_location?.lat ?? doctorProfile?.location?.lat,
      long: doctorProfile?.clinic_location?.lng ?? doctorProfile?.location?.lng,
      address: doctorProfile?.clinic_address,
    });
  }, [doctorProfile]);

  if (profilePending || !doctorProfile) {
    return <DoctorProfileSkeleton />;
  }

  return (
    <SafeAreaWrapper>
      <View style={doctorProfileStyles.header}>
        <TouchableOpacity
          style={doctorProfileStyles.backBtn}
          onPress={() => {
            if (navigation && navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
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
                    {getInitials(doctorProfile?.name || '')}
                  </Text>
                </View>
              </View>
              <View style={doctorProfileStyles.verifiedBadge}>
                <CheckBadgeIcon color={theme.colors.surface} size={10} />
              </View>
            </View>
            <View style={doctorProfileStyles.heroInfo}>
              <Text style={doctorProfileStyles.drName}>
                DR. {doctorProfile?.name.toUpperCase()}
              </Text>
              <View style={doctorProfileStyles.idRow}>
                <Text style={doctorProfileStyles.drId}>ID: {doctorProfile?.doctor_id}</Text>
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
                      {
                        color: isActive ? theme.colors.success : theme.colors.danger,
                      },
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
            <ProfileInfoCard
              label="SPECIALIZATION"
              value={doctorProfile?.specialization}
              iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
            />
            {subSpecializations.length > 0 && (
              <ProfileInfoCard
                label="SUB SPECIALIZATION"
                multiTag={true}
                tags={subSpecializations}
                iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
              />
            )}
            <ProfileInfoCard
              label="QUALIFICATIONS"
              value={doctorProfile?.qualifications}
              iconPath={<QualificationsIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="EXPERIENCE"
              value={`${doctorProfile?.experience_years} Years`}
              iconPath={<ExperienceIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="EMAIL"
              value={doctorProfile?.email}
              iconPath={<MailIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="PHONE"
              value={doctorProfile?.phone_number}
              iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
            />
            {doctorProfile?.alternate_number && (
              <ProfileInfoCard
                label="ALTERNATE NUMBER"
                value={doctorProfile?.alternate_number}
                iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
              />
            )}
            {doctorProfile?.whatsapp_number && (
              <ProfileInfoCard
                label="WHATSAPP NUMBER"
                value={doctorProfile?.whatsapp_number}
                iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
              />
            )}
            <ProfileInfoCard
              label="MEDICAL LICENSE"
              value={doctorProfile?.license_number}
              iconPath={<LicenseIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="PROFESSIONAL BIO"
              value={doctorProfile?.bio}
              iconPath={<BioIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="GOOGLE CALENDAR"
              value="Not Connected"
              iconPath={<ScheduleIcon size={18} color={theme.colors.primary} />}
            />
          </View>
        )}

        {tab === 'clinic' && (
          <View style={doctorProfileStyles.card}>
            {doctorProfile?.clinic_name ? (
              <>
                <ProfileInfoCard
                  label="CLINIC NAME"
                  value={doctorProfile?.clinic_name}
                  iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                />
                <ProfileInfoCard
                  label="CLINIC ID"
                  value={`Id:- ${doctorProfile?.clinic_id}`}
                  iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                />
                {doctorProfile?.clinic_reg_number && (
                  <ProfileInfoCard
                    label="CLINIC REGISTRATION NUMBER"
                    value={doctorProfile?.clinic_reg_number}
                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {doctorProfile?.clinic_gstin && (
                  <ProfileInfoCard
                    label="CLINIC GST NUMBER"
                    value={`${doctorProfile?.clinic_gstin}`}
                    iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {doctorProfile?.clinic_phone && (
                  <ProfileInfoCard
                    label="CLINIC PHONE"
                    value={`${doctorProfile?.clinic_phone}`}
                    iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {doctorProfile?.clinic_email && (
                  <ProfileInfoCard
                    label="CLINIC EMAIL"
                    value={`${doctorProfile?.clinic_email}`}
                    iconPath={<MailIcon size={18} color={theme.colors.primary} />}
                  />
                )}
                {doctorProfile?.clinic_address && (
                  <ProfileInfoCard
                    label="CLINIC ADDRESS"
                    value={`${doctorProfile?.clinic_address}`}
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
                <ProfileInfoCard
                  label="ASSOCIATION STATUS"
                  value={capitalize(doctorProfile?.clinic_association_status)}
                  iconPath={<AssociationIcon size={18} color={theme.colors.primary} />}
                />
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
