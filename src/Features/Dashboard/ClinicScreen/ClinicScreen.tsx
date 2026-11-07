import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
    AssociationIcon,
    BioIcon,
    ClinicIcon,
    LocationIcon,
    MapIcon,
    PhoneIcon,
    ProfileIcon,
    ScheduleIcon,
    SpecializationIcon
} from '../../../components/ui/icons';
import { useProfile } from '../../../hooks/react-query/profile/profile.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { ensureClinicAccess } from '../../../lib/commons/auth.Utils';
import {
    capitalize,
    getInitials,
    openLocationOnMap
} from '../../../lib/commons/common.utils';
import { AppRoute } from '../../../route';
import { doctorClinicStyles } from '../../../styled/ProfileScreen.styled';
import theme from '../../../styled/theme.styled';
import ClinicInfoCard from './Cards/ClinicInfoCard';
import ProfileSkeleton from './Skeletons/DoctorProfileSkeleton';

export const ClinicScreen: React.FC = () => {
    const navigation = useNavigation();
    const [isRefetching, setIsRefetching] = useState(false);

    const { data: doctorProfile, isPending: profilePending, refetch: profileRefetch } = useProfile();

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


    const onRefresh = useCallback(async () => {
        setIsRefetching(true);
        await profileRefetch();
        setIsRefetching(false);
    }, [profileRefetch]);

    const navigateToAccountTab = () => {
        navigation.navigate(AppRoute.ACCOUNT);
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
        return <ProfileSkeleton />;
    }

    return (
        <SafeAreaWrapper
            showBottomBar
            activeBottomTab="Account"
            header={
                <Header
                    title="Clinic Details"
                    description="View and manage your clinic details"
                    isBackBtn
                    onBackPress={() => navigation.goBack()}
                />
            }
        >
            <ScrollView
                style={doctorClinicStyles.scroll}
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
                <View style={doctorClinicStyles.hero}>
                    <View style={doctorClinicStyles.heroRow}>
                        <View style={doctorClinicStyles.avatarWrap}>
                            <View style={doctorClinicStyles.avatarRing}>
                                <View style={doctorClinicStyles.avatarCircle}>
                                    <Text style={doctorClinicStyles.avatarTxt}>
                                        {getInitials(doctorProfile.name || '')}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={doctorClinicStyles.heroInfo}>
                            <Text style={doctorClinicStyles.drName}>
                                {`${doctorProfile.salutation || 'DR.'} ${doctorProfile.name}`}
                            </Text>
                            <View style={doctorClinicStyles.idRow}>
                                <Text style={doctorClinicStyles.drId}>ID: {doctorProfile.doctor_id}</Text>
                                <View style={doctorClinicStyles.dot} />
                                <View
                                    style={[
                                        doctorClinicStyles.activeBadge,
                                        {
                                            backgroundColor: isActive
                                                ? theme.colors.inPersonBg
                                                : theme.colors.dangerLight,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            doctorClinicStyles.activeTxt,
                                            { color: isActive ? theme.colors.primaryDark : theme.colors.danger },
                                        ]}
                                    >
                                        {isActive ? 'ACTIVE' : 'Inactive'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={doctorClinicStyles.card}>
                    {clinic ? (
                        <>
                            {clinic.name && (
                                <ClinicInfoCard
                                    label="CLINIC NAME"
                                    value={clinic.name}
                                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                            {clinic.clinic_reg_number && (
                                <ClinicInfoCard
                                    label="CLINIC REGISTRATION NUMBER"
                                    value={clinic.clinic_reg_number}
                                    iconPath={<ClinicIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                            {clinic.contact_numbers && clinic.contact_numbers.length > 0 && (
                                <ClinicInfoCard
                                    label="CLINIC PHONE"
                                    value={clinic.contact_numbers.join(', ')}
                                    iconPath={<PhoneIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                            {clinicAddress && (
                                <ClinicInfoCard
                                    label="CLINIC ADDRESS"
                                    value={clinicAddress}
                                    iconPath={<LocationIcon size={18} color={theme.colors.primary} />}
                                    rightAction={
                                        <TouchableOpacity
                                            style={doctorClinicStyles.mapBtn}
                                            onPress={handleOpenMap}
                                            activeOpacity={0.7}
                                        >
                                            <MapIcon size={18} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                    }
                                />
                            )}
                            {clinic.about && (
                                <ClinicInfoCard
                                    label="ABOUT CLINIC"
                                    value={clinic.about}
                                    iconPath={<BioIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                            {clinic.specialities && clinic.specialities.length > 0 && (
                                <ClinicInfoCard
                                    label="CLINIC SPECIALITIES"
                                    multiTag={true}
                                    tags={clinic.specialities}
                                    iconPath={<SpecializationIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                            {clinic.status && (
                                <ClinicInfoCard
                                    label="ASSOCIATION STATUS"
                                    value={capitalize(clinic.status)}
                                    iconPath={<AssociationIcon size={18} color={theme.colors.primary} />}
                                />
                            )}
                        </>
                    ) : (
                        <View style={doctorClinicStyles.emptyTab}>
                            <ClinicIcon color={theme.colors.textMuted} size={44} />
                            <Text style={doctorClinicStyles.emptyTitle}>No Clinic Information</Text>
                            <Text style={doctorClinicStyles.emptySub}>
                                Add your clinic details in Settings
                            </Text>
                            <TouchableOpacity
                                style={doctorClinicStyles.emptyBtn}
                                onPress={navigateToAccountTab}
                                activeOpacity={0.85}
                            >
                                <Text style={doctorClinicStyles.emptyBtnTxt}>Go to Settings</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                <View style={doctorClinicStyles.actions}>
                    <TouchableOpacity
                        style={doctorClinicStyles.primaryBtn}
                        onPress={() => {
                            if (!ensureClinicAccess()) return;
                            navigation?.navigate(AppRoute.AVAILABILITY)
                        }}
                        activeOpacity={0.87}
                    >
                        <ScheduleIcon color={theme.colors.surface} size={18} />
                        <Text style={doctorClinicStyles.primaryBtnTxt}>Manage Availability</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={doctorClinicStyles.secondaryBtn}
                        onPress={navigateToAccountTab}
                        activeOpacity={0.87}
                    >
                        <ProfileIcon color={theme.colors.primary} size={18} />
                        <Text style={doctorClinicStyles.secondaryBtnTxt}>Account Settings</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 28 }} />
            </ScrollView>
        </SafeAreaWrapper>
    );
};

export default ClinicScreen;
