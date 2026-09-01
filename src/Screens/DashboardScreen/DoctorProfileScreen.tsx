import React, { useCallback, useState } from 'react';
import { RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import ProfileInfoCard from '../../components/Modules/Profile/ProfileInfoCard';
import PopupAlert, { AlertType } from '../../components/commons/PopupAlert/PopupAlert';
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
  PhoneIcon,
  ProfileIcon,
  QualificationsIcon,
  ScheduleIcon,
  SpecializationIcon,
} from '../../components/ui/icons';
import type { ProfileScreenNavigationProp, ProfileScreenRouteProp } from '../../route';
import { doctorProfileStyles } from '../../styled/DoctorProfileScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface DoctorProfileScreenProps {
  navigation?: ProfileScreenNavigationProp;
  route?: ProfileScreenRouteProp;
}

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({ navigation, route }) => {
  const user = route?.params ? (route.params as any)?.user : undefined;

  const [tab, setTab] = useState<'pro' | 'clinic'>('pro');
  const [isRefetching, setIsRefetching] = useState(false);

  // Popup alert state
  const [popupAlert, setPopupAlert] = useState<{
    visible: boolean;
    type: AlertType;
    title: string;
    message: string;
  }>({
    visible: false,
    type: 'info',
    title: 'Information',
    message: '',
  });

  const showAlert = (title: string, message: string, type: AlertType = 'info') => {
    setPopupAlert({
      visible: true,
      type,
      title,
      message,
    });
  };

  const onRefresh = useCallback(() => {
    setIsRefetching(true);
    setTimeout(() => {
      setIsRefetching(false);
    }, 1000);
  }, []);

  // Doctor static details with fallback
  const doctor = {
    name: user?.name || 'Sarah Jenkins',
    doctor_id: user?.doctor_id || 'DOC-2024-9842',
    status: user?.status || 'Active',
    specialization: user?.specialization || 'Cardiologist',
    qualifications: user?.qualifications || 'MBBS, MD (Harvard Medical School)',
    experience_years: user?.experience_years ?? 12,
    email: user?.email || 'dr.jenkins@stjude.org',
    phone_number: user?.phone_number || '+1 (555) 234-5678',
    license_number: user?.license_number || 'MED-US-2024-9842',
    bio:
      user?.bio ||
      'Board-certified Cardiologist with 12+ years of clinical practice in interventional cardiology and preventative cardiovascular care.',
    clinic_name: user?.clinic_name || 'St. Jude Medical Center',
    clinic_id: user?.clinic_id || '8842',
    clinic_association_status: user?.clinic_association_status || 'verified',
    google_calendar_connected: user?.google_calendar_connected ?? true,
  };

  const initials = 'SJ';
  const isActive = doctor.status.toLowerCase() === 'active';

  const navigateToAccountTab = () => {
    if (navigation) {
      (navigation as any).navigate('MainTabs', { screen: 'Account', params: { user } });
    }
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />

      {/* Header Bar */}
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
        {/* Doctor Hero Card Header */}
        <View style={doctorProfileStyles.hero}>
          <View style={doctorProfileStyles.heroRow}>
            <View style={doctorProfileStyles.avatarWrap}>
              <View style={doctorProfileStyles.avatarRing}>
                <View style={doctorProfileStyles.avatarCircle}>
                  <Text style={doctorProfileStyles.avatarTxt}>{initials}</Text>
                </View>
              </View>
              <View style={doctorProfileStyles.verifiedBadge}>
                <CheckBadgeIcon color={theme.colors.surface} size={10} />
              </View>
            </View>
            <View style={doctorProfileStyles.heroInfo}>
              <Text style={doctorProfileStyles.drName}>DR. {doctor.name.toUpperCase()}</Text>
              <View style={doctorProfileStyles.idRow}>
                <Text style={doctorProfileStyles.drId}>ID: {doctor.doctor_id}</Text>
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

        {/* Custom Segmented Tabs */}
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

        {/* Tab 1: Professional Details */}
        {tab === 'pro' && (
          <View style={doctorProfileStyles.card}>
            <ProfileInfoCard
              label="SPECIALIZATION"
              value={doctor.specialization}
              iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="QUALIFICATIONS"
              value={doctor.qualifications}
              iconPath={<QualificationsIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="EXPERIENCE"
              value={`${doctor.experience_years} Years`}
              iconPath={<ExperienceIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="EMAIL"
              value={doctor.email}
              iconPath={<MailIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="PHONE"
              value={doctor.phone_number}
              iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="MEDICAL LICENSE"
              value={doctor.license_number}
              iconPath={<LicenseIcon size={18} color={theme.colors.primary} />}
            />
            <ProfileInfoCard
              label="PROFESSIONAL BIO"
              value={doctor.bio}
              iconPath={<BioIcon size={18} color={theme.colors.primary} />}
            />
          </View>
        )}

        {/* Tab 2: Clinic Info */}
        {tab === 'clinic' && (
          <View style={doctorProfileStyles.card}>
            {doctor.clinic_name ? (
              <>
                <ProfileInfoCard
                  label="CLINIC NAME"
                  value={doctor.clinic_name}
                  iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                />
                <ProfileInfoCard
                  label="CLINIC ID"
                  value={`CL-${doctor.clinic_id}`}
                  iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                />
                <ProfileInfoCard
                  label="ASSOCIATION STATUS"
                  value={doctor.clinic_association_status.toUpperCase()}
                  iconPath={<AssociationIcon size={18} color={theme.colors.primary} />}
                />
                <ProfileInfoCard
                  label="GOOGLE CALENDAR"
                  value={doctor.google_calendar_connected ? 'Connected' : 'Not Connected'}
                  iconPath={<ScheduleIcon size={18} color={theme.colors.primary} />}
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

        {/* Action Buttons */}
        <View style={doctorProfileStyles.actions}>
          <TouchableOpacity
            style={doctorProfileStyles.primaryBtn}
            onPress={() => (navigation as any)?.navigate('Availability', { user })}
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

      {/* Popup Alert Modal */}
      <PopupAlert
        visible={popupAlert.visible}
        type={popupAlert.type}
        title={popupAlert.title}
        message={popupAlert.message}
        onPress={() => setPopupAlert(prev => ({ ...prev, visible: false }))}
        onCancel={() => setPopupAlert(prev => ({ ...prev, visible: false }))}
        closeOnBackdrop={true}
      />
    </SafeAreaWrapper>
  );
};

export default DoctorProfileScreen;
