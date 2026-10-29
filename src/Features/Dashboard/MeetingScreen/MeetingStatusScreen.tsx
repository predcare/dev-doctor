import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import {
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HomeIcon,
  StethoscopeIcon,
  VideoIcon,
} from '../../../components/ui/icons';
import useJoinVideoCall from '../../../hooks/commons/meeting/useJoinVideoCall';
import { useMyAppointmentInfo } from '../../../hooks/react-query/appointments/appointments.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import {
  formatDate,
  formatTimeSlot,
  isInProgressStatus,
  resolveAppointmentDurationMinutes,
  shouldHideJoinForCallDuration,
} from '../../../lib/commons/common.utils';
import {
  AppRoute,
  ConsultationCompletedScreenNavigationProp,
  ConsultationCompletedScreenRouteProp,
} from '../../../route';
import consultationCompletedStyles from '../../../styled/ConsultationCompletedScreen.styled';
import theme from '../../../styled/theme.styled';
import MeetingStatusSkeleton from './Skeletons/MeetingStatusSkeleton';

const formatStatusLabel = (status?: string | null): string => {
  if (!status) return '';
  return status.replace(/[_-]+/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

export const MeetingStatusScreen: React.FC = () => {
  const navigation = useNavigation<ConsultationCompletedScreenNavigationProp>();
  const route = useRoute<ConsultationCompletedScreenRouteProp>();
  const appointmentId = route.params?.appointmentId;
  const hasAppointmentId =
    appointmentId !== undefined && appointmentId !== null && `${appointmentId}` !== '';
  const hasLeftRef = useRef(false);
  const { joinVideoCall } = useJoinVideoCall();

  const {
    data: apptInfo,
    isFetching: apptInfoIsPending,
    isError: apptInfoIsError,
    refetch: refetchApptInfo,
  } = useMyAppointmentInfo({ id: hasAppointmentId ? appointmentId : undefined });

  const handleGoHome = useCallback(() => {
    if (hasLeftRef.current) return;
    hasLeftRef.current = true;
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoute.HOME }],
    });
  }, [navigation]);

  const handleViewAppointments = () => {
    if (hasLeftRef.current) return;
    hasLeftRef.current = true;
    navigation.reset({
      index: 0,
      routes: [{ name: AppRoute.APPOINTMENTS }],
    });
  };

  useEffect(() => {
    navigation.setOptions({
      gestureEnabled: false,
    });

    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', (e: any) => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        handleGoHome();
      }
    });

    const onBackPress = () => {
      handleGoHome();
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      unsubscribeBeforeRemove();
      subscription.remove();
    };
  }, [navigation, handleGoHome]);

  const isVideo = (apptInfo?.consultation_type || '').toLowerCase() === 'video';
  const patientName = apptInfo?.patient?.name || '';
  const patientMeta = [apptInfo?.patient?.gender, apptInfo?.patient?.age ? `${apptInfo.patient.age} yrs` : '']
    .filter(Boolean)
    .join(' • ');
  const clinicName = apptInfo?.clinic?.name || '';
  const statusLabel = formatStatusLabel(apptInfo?.appointment_status);
  const timeSlot = formatTimeSlot(apptInfo?.start_time, apptInfo?.end_time);
  const hideJoin = shouldHideJoinForCallDuration({
    status: apptInfo?.appointment_status,
    appointmentDurationMinutes: resolveAppointmentDurationMinutes(
      undefined,
      apptInfo?.slot_duration_minutes || apptInfo?.appointment_duration,
      apptInfo?.start_time,
      apptInfo?.end_time
    ),
    callDurationSeconds: Number(apptInfo?.call_duration_seconds || 0),
  });
  const joinLabel =
    isInProgressStatus(apptInfo?.appointment_status) || Number(apptInfo?.call_duration_seconds) > 0
      ? 'Rejoin Call'
      : 'Join Call';
  const showLoader = hasAppointmentId && apptInfoIsPending && !apptInfo;
  const showError = !hasAppointmentId || apptInfoIsError;

  return (
    <SafeAreaWrapper
      header={
        <Header
          title="Call Summary"
          isBackBtn
          onBackPress={handleGoHome}
          isIconShow={false}
          rightAction={<View />}
        />
      }
    >
      <ScrollView
        contentContainerStyle={consultationCompletedStyles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={consultationCompletedStyles.heroSection}>
          <View style={consultationCompletedStyles.checkCircleOuter}>
            <View style={consultationCompletedStyles.checkCircleInner}>
              <CheckIcon size={26} color={theme.colors.surface} />
            </View>
          </View>
          <Text style={consultationCompletedStyles.heading}>Call Ended!</Text>
          <Text style={consultationCompletedStyles.subheading}>
            Your video session has concluded and your visit details are saved.
          </Text>
        </View>
        {showLoader ? (
          <MeetingStatusSkeleton />
        ) : showError ? (
          <CommonErrorCard
            title={hasAppointmentId ? 'Unable to load visit' : 'Visit unavailable'}
            message={
              hasAppointmentId
                ? 'We could not load this appointment. Please try again.'
                : 'This visit could not be opened because the appointment id is missing.'
            }
            onRetry={hasAppointmentId ? () => refetchApptInfo() : undefined}
          />
        ) : (
          <>
            <View style={consultationCompletedStyles.card}>
              <View style={consultationCompletedStyles.doctorRow}>
                <View style={consultationCompletedStyles.doctorDetails}>
                  <Text style={consultationCompletedStyles.doctorName}>{patientName}</Text>
                  {patientMeta ? (
                    <Text style={consultationCompletedStyles.doctorSpecialty}>{patientMeta}</Text>
                  ) : null}
                  {clinicName ? (
                    <Text style={consultationCompletedStyles.doctorClinic}>{clinicName}</Text>
                  ) : null}
                </View>
                {statusLabel ? (
                  <View style={consultationCompletedStyles.statusBadge}>
                    <View style={consultationCompletedStyles.statusDot} />
                    <Text style={consultationCompletedStyles.statusBadgeText}>{statusLabel}</Text>
                  </View>
                ) : null}
              </View>
              <View style={consultationCompletedStyles.cardDivider} />

              <View style={consultationCompletedStyles.cardMetaRow}>
                <View style={consultationCompletedStyles.typePill}>
                  {isVideo ? (
                    <VideoIcon size={14} color={theme.colors.primary} />
                  ) : (
                    <StethoscopeIcon size={14} color={theme.colors.primary} />
                  )}
                  <Text style={consultationCompletedStyles.typePillText}>
                    {isVideo ? 'Video Consultation' : 'In-Person Visit'}
                  </Text>
                </View>
                <View style={consultationCompletedStyles.refIdContainer}>
                  <Text style={consultationCompletedStyles.refIdLabel}>Ref: </Text>
                  <Text style={consultationCompletedStyles.refIdValue}>
                    {apptInfo?.appointment_id || ''}
                  </Text>
                </View>
              </View>
            </View>
            <View style={consultationCompletedStyles.gridRow}>
              <View style={consultationCompletedStyles.gridCell}>
                <View style={consultationCompletedStyles.gridCellHeader}>
                  <View style={consultationCompletedStyles.gridIconWrap}>
                    <CalendarIcon size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={consultationCompletedStyles.gridLabel}>DATE</Text>
                </View>
                <Text style={consultationCompletedStyles.gridValue}>
                  {formatDate(apptInfo?.appointment_date, 'DD MMM YYYY')}
                </Text>
              </View>
              <View style={consultationCompletedStyles.gridCell}>
                <View style={consultationCompletedStyles.gridCellHeader}>
                  <View style={consultationCompletedStyles.gridIconWrap}>
                    <ClockIcon size={14} color={theme.colors.primary} />
                  </View>
                  <Text style={consultationCompletedStyles.gridLabel}>TIME SLOT</Text>
                </View>
                <Text style={consultationCompletedStyles.gridValue} numberOfLines={1}>
                  {timeSlot}
                </Text>
              </View>
            </View>
          </>
        )}
        {isVideo && !hideJoin && !showLoader && !showError && (
          <TouchableOpacity
            style={consultationCompletedStyles.primaryBtn}
            activeOpacity={0.8}
            onPress={() =>
              joinVideoCall({
                appointmentId: apptInfo?.id,
                patientName: apptInfo?.patient?.name,
                patientId: apptInfo?.patient?.patient_id,
              })
            }
          >
            <VideoIcon size={18} color={theme.colors.surface} />
            <Text style={consultationCompletedStyles.primaryBtnTxt}>{joinLabel}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={consultationCompletedStyles.primaryBtn}
          activeOpacity={0.8}
          onPress={handleGoHome}
        >
          <HomeIcon size={18} color={theme.colors.surface} />
          <Text style={consultationCompletedStyles.primaryBtnTxt}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={consultationCompletedStyles.secondaryBtn}
          activeOpacity={0.8}
          onPress={handleViewAppointments}
        >
          <CalendarIcon size={18} color={theme.colors.primary} />
          <Text style={consultationCompletedStyles.secondaryBtnTxt}>View Appointments</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default MeetingStatusScreen;
