import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FileViewer from 'react-native-file-viewer';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { CalendarIcon, DiagnosisDocumentIcon, EditIcon, InfoCircleIcon, LightbulbInstructionsIcon, MealIcon, PatientAgeCalendarIcon, PatientAvatarIcon, PatientGenderIcon, ReferralIcon, SymptomsWarningIcon } from '../../../components/ui/icons';
import { useDownloadPrescriptionPdf, useGetPrescriptionDetails, useResendPrescriptionEmail } from '../../../hooks/react-query/prescriptions/prescriptions.hooks';
import { PatientsQueryKeys } from '../../../hooks/react-query/query.keys';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { _toTitleCase, formatDate } from '../../../lib/commons/common.utils';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../../lib/commons/toast.utils';
import { AppRoute, PrescriptionViewScreenProps } from '../../../route';
import { TEAL, TEAL_DARK } from '../../../styled/BookAppointmentScreen.styled';
import prescriptionViewStyles from '../../../styled/PrescriptionViewScreen.styled';
import { IPatientPrescriptionDoc } from '../../../typescripts/interfaces/prescriptions.interfaces';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import PrescriptionViewSkeleton, { PrescriptionBottomBarSkeleton } from './Skeletons/PrescriptionViewSkeleton';

export const PrescriptionViewScreen: React.FC<PrescriptionViewScreenProps> = ({
    navigation,
    route,
}) => {
    const { rxId } = route?.params || {};
    const { showLoader, hideLoader } = useLoadingStore(state => state);
    const {
        data: prescriptionInfo,
        isFetching: prescriptionInfoLoading,
        isError,
        refetch,
    } = useGetPrescriptionDetails({
        id: Number(rxId),
    });

    const rxDoc: IPatientPrescriptionDoc | undefined = prescriptionInfo?.data;

    const [downloadProgress, setDownloadProgress] = useState(0);

    const { mutate: resendEmailMutation, isPending: resendEmailLoading } =
        useResendPrescriptionEmail();
    const { mutate: downloadPdfMutation, isPending: downloadPdfLoading } =
        useDownloadPrescriptionPdf();

    const sanitizeText = useCallback((val?: string | null): string | null => {
        if (!val || typeof val !== 'string') return null;
        const trimmed = val.trim();
        if (!trimmed) return null;
        const lower = trimmed.toLowerCase();
        const dummyWords = ['dummy', 'demo', 'null', 'undefined', 'n/a', 'none'];
        if (dummyWords.includes(lower)) return null;
        return trimmed;
    }, []);

    // Format dynamic display data using useMemo
    const displayData = useMemo(() => {
        if (!rxDoc) return null;

        const standardVitals: { label: string; value: string }[] = [];
        if (rxDoc.blood_pressure) standardVitals.push({ label: 'BP', value: rxDoc.blood_pressure });
        if (rxDoc.pulse) standardVitals.push({ label: 'PULSE', value: `${rxDoc.pulse} bpm` });
        if (rxDoc.temperature) standardVitals.push({ label: 'TEMP', value: `${rxDoc.temperature} °C` });
        if (rxDoc.spo2) standardVitals.push({ label: 'SPO2', value: `${rxDoc.spo2}%` });
        if (rxDoc.weight) standardVitals.push({ label: 'WT', value: `${rxDoc.weight} kg` });
        if (rxDoc.height) standardVitals.push({ label: 'HT', value: `${rxDoc.height} cm` });
        if (rxDoc.bmi) standardVitals.push({ label: 'BMI', value: rxDoc.bmi });

        // Custom Vitals (Separated!)
        const customVitals: { name: string; value: string }[] = [];
        if (Array.isArray(rxDoc.custom_vitals)) {
            rxDoc.custom_vitals.forEach(cv => {
                if (cv?.name && cv?.value) {
                    customVitals.push({ name: cv.name, value: cv.value });
                }
            });
        }

        return {
            rxId: rxDoc.prescription_id || route?.params?.rxId || `#${rxDoc.id}`,
            clinicName: rxDoc.resolved_clinic_name || rxDoc.clinic_name || 'PRED Care Medical Center',
            clinicAddress: rxDoc.resolved_clinic_address || rxDoc.clinic_address,
            date: formatDate(rxDoc.created_at),
            status: rxDoc.status || 'completed',
            isSent: Boolean(rxDoc?.email_sent_at) ? true : false,

            // Patient Info
            patientName: rxDoc.patient_name || route?.params?.patientName || 'Patient',
            patientAge: rxDoc.patient_age || 'N/A',
            patientGender: rxDoc.patient_gender || 'N/A',
            patientId: rxDoc.patient_id ? `#${rxDoc.patient_id}` : route?.params?.patientId || 'N/A',
            patintDisplayId: rxDoc.patient_display_id ? `#${rxDoc.patient_display_id}` : route?.params?.patientId || 'N/A',

            // Medical background
            drugAllergies: sanitizeText(rxDoc.drug_allergies),
            chronicConditions: sanitizeText(rxDoc.chronic_conditions),

            // Clinical fields
            standardVitals,
            customVitals,
            chiefComplaints: sanitizeText(rxDoc.chief_complaints),
            symptoms: sanitizeText(rxDoc.symptoms),
            examinationNotes: sanitizeText(rxDoc.examination_notes),
            diagnosis: sanitizeText(rxDoc.diagnosis),
            treatmentPlan: sanitizeText(rxDoc.treatment_plan),
            generalAdvice: sanitizeText(rxDoc.general_advice),
            notes: sanitizeText(rxDoc.notes),

            // Lists
            medications: rxDoc.medications || [],
            labTests: rxDoc.lab_tests || [],

            // Follow Up & Referral
            followUp: rxDoc.follow_up_date ? formatDate(rxDoc.follow_up_date, 'DD/MM/YYYY') : null,
            referralSpecialist: sanitizeText(rxDoc.referral_specialist),
            referralDoctorHospital: sanitizeText(rxDoc.referral_doctor_hospital),
            referralDoctorName: sanitizeText(rxDoc.referral_doctor_name),
            referralReason: sanitizeText(rxDoc.referral_reason),
            pdfUrl: rxDoc.pdf_url,
        };
    }, [
        rxDoc,
        route?.params?.rxId,
        route?.params?.patientName,
        route?.params?.patientId,
        sanitizeText,
    ]);

    const handleResendToPatient = useCallback(() => {
        if (!rxDoc?.id) {
            showErrorToast('Prescription ID is missing', 'Email Failed');
            return;
        }
        showLoader("Sending prescription to patient's email...");
        resendEmailMutation(rxDoc.id, {
            onSuccess: async res => {
                try {
                    if (res?.success) {
                        showSuccessToast(
                            res?.message || "Prescription sent to patient's email.",
                            '📧 Email Sent'
                        );
                        await refetch();
                        await queryClient.invalidateQueries({ queryKey: [PatientsQueryKeys.Prescriptions] });
                    } else {
                        showErrorToast(res?.message || 'Failed to send prescription email.', 'Email Failed');
                    }
                } finally {
                    hideLoader();
                }
            },
            onError: (err: any) => {
                hideLoader();
                showErrorToast(err?.message || 'Failed to resend prescription email.', 'Email Failed');
            },
        });
    }, [rxDoc?.id, resendEmailMutation, showLoader, hideLoader, refetch]);

    const handleDownloadPDF = useCallback(() => {
        if (!rxDoc?.id) {
            showErrorToast('Prescription ID is missing', 'Download Failed');
            return;
        }
        setDownloadProgress(0);
        downloadPdfMutation(
            {
                id: rxDoc.id,
                onProgress: setDownloadProgress,
            },
            {
                onSuccess: async localPath => {
                    if (localPath) {
                        try {
                            await FileViewer.open(localPath, {
                                showOpenWithDialog: true,
                                showAppsSuggestions: true,
                            });
                        } catch (err: any) {
                            showErrorToast(err?.message || 'Failed to open PDF viewer.', 'Cannot Open PDF');
                        }
                    }
                    setDownloadProgress(0);
                },
                onError: (err: any) => {
                    showErrorToast(err?.message || 'Failed to download PDF.', 'Cannot Open PDF');
                    setDownloadProgress(0);
                },
            }
        );
    }, [rxDoc?.id, downloadPdfMutation]);

    const handleBack = useCallback(() => {
        const fromScreen = route?.params?.fromScreen;
        const patientId = rxDoc?.patient_id || route?.params?.patientId;

        if (navigation?.canGoBack()) {
            navigation.goBack();
        } else if (fromScreen === AppRoute.PATIENT_DETAILS && patientId) {
            navigation?.navigate(AppRoute.PATIENT_DETAILS, {
                patientId: patientId,
                patientName: displayData?.patientName || route?.params?.patientName,
            });
        } else if (fromScreen === AppRoute.PRESCRIPTION_LIST) {
            navigation?.navigate(AppRoute.PRESCRIPTION_LIST);
        } else if (patientId) {
            navigation?.navigate(AppRoute.PATIENT_DETAILS, {
                patientId: patientId,
                patientName: displayData?.patientName || route?.params?.patientName,
            });
        } else {
            navigation?.navigate(AppRoute.PRESCRIPTION_LIST);
        }
    }, [navigation, route?.params, rxDoc?.patient_id, displayData?.patientName]);

    const handleEdit = useCallback(() => {
        if (rxDoc) {
            navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
                patientId: rxDoc.patient_id,
                prescriptionId: rxDoc.id,
                fromScreen: route?.params?.fromScreen,
            });
        } else {
            showInfoToast('Prescription details not available for editing.', 'Edit Prescription');
        }
    }, [navigation, rxDoc, route?.params?.fromScreen]);

    if (prescriptionInfoLoading) {
        return (
            <SafeAreaWrapper
                showBottomBar
                isPathClear
                header={
                    <Header
                        title="Summary"
                        isBackBtn
                        onBackPress={handleBack}
                    />
                }
            >
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 16 }}
                >
                    <PrescriptionViewSkeleton />
                </ScrollView>
                <PrescriptionBottomBarSkeleton />
            </SafeAreaWrapper>
        );
    }

    // 2. Error State
    if (isError || !displayData) {
        return (
            <SafeAreaWrapper
                showBottomBar
                isPathClear
                header={
                    <Header
                        title="Summary"
                        isBackBtn
                        onBackPress={handleBack}
                    />
                }
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <CommonErrorCard
                        title="Unable to Load Prescription"
                        message="We could not fetch the details for this prescription. Please check your network and try again."
                        onRetry={refetch}
                    />
                </ScrollView>
            </SafeAreaWrapper>
        );
    }

    return (
        <SafeAreaWrapper
            showBottomBar
            isPathClear
            header={
                <Header
                    title="Summary"
                    description={displayData?.rxId?.toString() || ''}
                    isBackBtn
                    onBackPress={handleBack}
                    rightAction={
                        <View style={prescriptionViewStyles.headerRight}>
                            {rxDoc && rxDoc?.published_version_count < 2 && (
                                <TouchableOpacity
                                    style={prescriptionViewStyles.editPill}
                                    activeOpacity={0.7}
                                    onPress={handleEdit}
                                >
                                    <EditIcon size={14} color={TEAL} />
                                    <Text style={prescriptionViewStyles.editPillTxt}>Edit</Text>
                                </TouchableOpacity>
                            )}
                            {displayData.rxId ? (
                                <View style={prescriptionViewStyles.rxIdBadge}>
                                    <Text style={prescriptionViewStyles.rxIdBadgeTxt}>{displayData.rxId}</Text>
                                </View>
                            ) : null}
                        </View>
                    }
                />
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 16 }}
            >
                <View style={prescriptionViewStyles.clinicCard}>
                    <View style={prescriptionViewStyles.clinicTopRow}>
                        <Text style={prescriptionViewStyles.clinicName}>{displayData.clinicName}</Text>
                        <Text style={prescriptionViewStyles.clinicDate}>{displayData.date}</Text>
                    </View>
                    <View style={prescriptionViewStyles.clinicBottomRow}>
                        {displayData.clinicAddress ? (
                            <Text style={prescriptionViewStyles.clinicSub} numberOfLines={1}>{displayData.clinicAddress}</Text>
                        ) : (
                            <Text style={prescriptionViewStyles.clinicSub}>Prescription Details</Text>
                        )}
                        <View
                            style={[
                                prescriptionViewStyles.statusChip,
                                { backgroundColor: displayData?.isSent ? '#D1FAE5' : '#FEF3C7' },
                            ]}
                        >
                            <Text
                                style={[prescriptionViewStyles.statusChipTxt, { color: displayData?.isSent ? '#059669' : '#D97706' }]}
                            >
                                {displayData?.isSent ? 'SENT' : 'NOT SENT'}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={prescriptionViewStyles.patientCard}>
                    <View style={prescriptionViewStyles.patientAvatarBox}>
                        <PatientAvatarIcon size={24} color={TEAL} />
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={prescriptionViewStyles.patientName}>{displayData.patientName}</Text>
                        <View style={prescriptionViewStyles.patientMetaRow}>
                            <View style={prescriptionViewStyles.patientMetaItem}>
                                <PatientAgeCalendarIcon size={14} color={TEAL_DARK} style={{ marginRight: 4 }} />
                                <Text style={prescriptionViewStyles.patientMetaTxt}>{displayData.patientAge}</Text>
                            </View>

                            <View style={prescriptionViewStyles.patientMetaItem}>
                                <PatientGenderIcon size={14} color={TEAL_DARK} style={{ marginRight: 4 }} />
                                <Text style={prescriptionViewStyles.patientMetaTxt}>{_toTitleCase(displayData.patientGender)}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={prescriptionViewStyles.patientIdBadge}>
                        <Text style={prescriptionViewStyles.patientIdBadgeTxt}>{displayData.patintDisplayId}</Text>
                    </View>
                </View>
                {(displayData.drugAllergies || displayData.chronicConditions || displayData.standardVitals.length > 0 || displayData.customVitals.length > 0) && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.medicalBadgesColumn}>
                            {displayData.drugAllergies && (
                                <View style={prescriptionViewStyles.medicalBadgeFull}>
                                    <Text style={prescriptionViewStyles.medicalBadgeTitle}>Drug Allergies</Text>
                                    <Text style={prescriptionViewStyles.medicalBadgeVal}>{displayData.drugAllergies}</Text>
                                </View>
                            )}

                            {displayData.chronicConditions && (
                                <View style={prescriptionViewStyles.medicalBadgeFull}>
                                    <Text style={prescriptionViewStyles.medicalBadgeTitle}>Chronic Conditions</Text>
                                    <Text style={prescriptionViewStyles.medicalBadgeVal}>{displayData.chronicConditions}</Text>
                                </View>
                            )}

                            {(displayData.standardVitals.length > 0 || displayData.customVitals.length > 0) && (
                                <View style={prescriptionViewStyles.medicalBadgeFull}>
                                    <Text style={prescriptionViewStyles.medicalBadgeTitle}>Vitals</Text>
                                    <View style={prescriptionViewStyles.vitalGrid}>
                                        {[
                                            ...displayData.standardVitals.map((v) => ({ label: v.label, value: v.value })),
                                            ...displayData.customVitals.map((cv) => ({ label: cv.name, value: cv.value })),
                                        ].map((item, i) => (
                                            <View key={`${item.label}-${i}`} style={prescriptionViewStyles.vitalGridBox}>
                                                <Text style={prescriptionViewStyles.vitalLbl}>{item.label}</Text>
                                                <Text style={prescriptionViewStyles.vitalVal}>{item.value}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}
                {/* Chief Complaints Section */}
                {(displayData.chiefComplaints || displayData.symptoms) && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.outerSectionHd}>
                            <SymptomsWarningIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.outerSectionTitle}>Chief Complaints</Text>
                        </View>

                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.textBox}>
                                <Text style={prescriptionViewStyles.textBoxTxt}>
                                    {displayData.chiefComplaints || displayData.symptoms}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Examination Notes */}
                {displayData.examinationNotes && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.outerSectionHd}>
                            <DiagnosisDocumentIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.outerSectionTitle}>Examination Notes</Text>
                        </View>

                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.textBox}>
                                <Text style={prescriptionViewStyles.textBoxTxt}>{displayData.examinationNotes}</Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Diagnosis Section */}
                {displayData.diagnosis && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.outerSectionHd}>
                            <DiagnosisDocumentIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.outerSectionTitle}>Diagnosis</Text>
                        </View>

                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.textBox}>
                                <Text style={[prescriptionViewStyles.textBoxTxt, { color: TEAL, fontWeight: '700' }]}>
                                    {displayData.diagnosis}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Treatment Plan Section */}
                {displayData.treatmentPlan && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.outerSectionHd}>
                            <LightbulbInstructionsIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.outerSectionTitle}>Treatment Plan</Text>
                        </View>

                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.textBox}>
                                <Text style={prescriptionViewStyles.textBoxTxt}>{displayData.treatmentPlan}</Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Medications Section */}
                {displayData.medications.length > 0 && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.outerSectionHd}>
                                <Text style={[prescriptionViewStyles.medicalBadgeTitle, { marginBottom: 0 }]}>Medications</Text>
                                <View style={{ flex: 1 }} />
                                <Text style={[prescriptionViewStyles.medicalBadgeTitle, { marginBottom: 0 }]}>{displayData.medications.length} ITEMS</Text>
                            </View>
                            {displayData?.medications?.map((med, i) => {
                                const strengthStr = med.strength
                                    ? `${med.strength} ${med.strengthUnit || 'mg'}`
                                    : '';
                                const durationStr = med.durationNum
                                    ? `${med.durationNum} ${med.durationUnit || 'days'}`
                                    : '';

                                return (
                                    <View
                                        key={med.id || i}
                                        style={[prescriptionViewStyles.medItem, i < displayData.medications.length - 1 && prescriptionViewStyles.medBorder]}
                                    >
                                        <View style={prescriptionViewStyles.medTopRow}>
                                            <Text style={[prescriptionViewStyles.medicalBadgeVal, { flex: 1 }]}>
                                                {med.name} {strengthStr ? `(${strengthStr})` : ''}
                                            </Text>
                                        </View>

                                        <View style={prescriptionViewStyles.medBotRow}>
                                            {durationStr ? (
                                                <View style={prescriptionViewStyles.medMetaItem}>
                                                    <CalendarIcon size={14} color="#64748B" />
                                                    <Text style={prescriptionViewStyles.medMetaTxt}>{durationStr}</Text>
                                                </View>
                                            ) : null}
                                            {med.timing ? (
                                                <View style={prescriptionViewStyles.medMetaItem}>
                                                    <MealIcon size={14} color="#64748B" />
                                                    <Text style={prescriptionViewStyles.medMetaTxt}>{med.timing}</Text>
                                                </View>
                                            ) : null}
                                            {med.instructions ? (
                                                <View style={prescriptionViewStyles.medMetaItem}>
                                                    <InfoCircleIcon size={14} color="#64748B" />
                                                    <Text style={prescriptionViewStyles.medMetaTxt}>{med.instructions}</Text>
                                                </View>
                                            ) : null}
                                            {med.instructions ? (
                                                <View style={prescriptionViewStyles.medMetaItem}>
                                                    <InfoCircleIcon size={14} color="#64748B" />
                                                    <Text style={prescriptionViewStyles.medMetaTxt}>{med.instructions}</Text>
                                                </View>
                                            ) : null}
                                            {med.dosage ? (
                                                <View style={prescriptionViewStyles.medMetaItem}>
                                                    <InfoCircleIcon size={14} color="#64748B" />
                                                    <Text style={prescriptionViewStyles.medMetaTxt}>{med.dosage}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
                {/* Instructions & Advice Card */}
                {displayData.generalAdvice && (
                    <View style={prescriptionViewStyles.instructionsCard}>
                        <View style={prescriptionViewStyles.instructionsHd}>
                            <LightbulbInstructionsIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.instructionsTitle}>INSTRUCTIONS & ADVICE</Text>
                        </View>
                        <Text style={prescriptionViewStyles.instructionsTxt}>{displayData.generalAdvice}</Text>
                    </View>
                )}
                {/* Doctor Notes Card */}
                {displayData.notes && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.outerSectionHd}>
                            <LightbulbInstructionsIcon size={18} color={TEAL} />
                            <Text style={prescriptionViewStyles.outerSectionTitle}>Doctor Notes</Text>
                        </View>
                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.textBox}>
                                <Text style={prescriptionViewStyles.textBoxTxt}>{displayData.notes}</Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* Follow-up Card */}
                {displayData.followUp && (
                    <View style={prescriptionViewStyles.followUpCard}>
                        <View>
                            <Text style={prescriptionViewStyles.followUpLbl}>FOLLOW-UP</Text>
                            <Text style={prescriptionViewStyles.followUpDate}>{displayData.followUp}</Text>
                        </View>
                        <View style={prescriptionViewStyles.followUpIconBox}>
                            <CalendarIcon size={22} color={TEAL_DARK} />
                        </View>
                    </View>
                )}
                {/* Referral Card */}
                {(displayData.referralSpecialist ||
                    displayData.referralDoctorHospital ||
                    displayData.referralDoctorName ||
                    displayData.referralReason) && (
                        <View style={prescriptionViewStyles.outerSection}>
                            <View style={prescriptionViewStyles.referralCard}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <ReferralIcon size={18} color="#1D4ED8" />
                                    <Text style={prescriptionViewStyles.referralTitle}>Referral Details</Text>
                                </View>
                                {displayData.referralSpecialist && (
                                    <Text style={prescriptionViewStyles.referralTxt}>Specialist: {displayData.referralSpecialist}</Text>
                                )}
                                {displayData.referralDoctorHospital && (
                                    <Text style={prescriptionViewStyles.referralTxt}>
                                        Hospital Name: {displayData.referralDoctorHospital}
                                    </Text>
                                )}
                                {displayData.referralDoctorName && (
                                    <Text style={prescriptionViewStyles.referralTxt}>Doctor Name: {displayData.referralDoctorName}</Text>
                                )}
                                {displayData.referralReason && (
                                    <Text style={{ fontSize: 13, color: '#475569', marginTop: 2 }}>
                                        Reason: {displayData.referralReason}
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                {/* Lab Tests Section */}
                {displayData.labTests.length > 0 && (
                    <View style={prescriptionViewStyles.outerSection}>
                        <View style={prescriptionViewStyles.contentCard}>
                            <View style={prescriptionViewStyles.outerSectionHd}>
                                <Text style={[prescriptionViewStyles.medicalBadgeTitle, { marginBottom: 0 }]}>Lab Tests</Text>
                                <View style={{ flex: 1 }} />
                                <Text style={[prescriptionViewStyles.medicalBadgeTitle, { marginBottom: 0 }]}>{displayData.labTests.length} ITEMS</Text>
                            </View>
                            {displayData.labTests.map((lab, i) => (
                                <View
                                    key={i}
                                    style={[prescriptionViewStyles.medItem, i < displayData.labTests.length - 1 && prescriptionViewStyles.medBorder]}
                                >
                                    <Text style={prescriptionViewStyles.medName}>
                                        {lab.name || lab.text}
                                        {lab.instructions && (
                                            <Text style={{ fontWeight: '400', color: '#64748B', fontSize: 13 }}>
                                                {'  '}({lab.instructions})
                                            </Text>
                                        )}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
            <View style={prescriptionViewStyles.bottomBar}>
                <View style={prescriptionViewStyles.shareBtnRow}>
                    {rxDoc && rxDoc?.published_version_count < 2 && (
                        <TouchableOpacity
                            style={[prescriptionViewStyles.shareBtn, resendEmailLoading && { opacity: 0.7 }]}
                            onPress={handleResendToPatient}
                            disabled={resendEmailLoading}
                            activeOpacity={0.85}
                        >
                            {resendEmailLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <>
                                    <Text style={prescriptionViewStyles.shareBtnTxt}>{displayData?.isSent ? "Resend" : "Send"}</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={[
                            !(rxDoc && rxDoc?.published_version_count < 2)
                                ? prescriptionViewStyles.shareBtnDocBtnFull
                                : prescriptionViewStyles.shareBtnDocBtn,
                            downloadPdfLoading && { opacity: 0.7 },
                        ]}
                        onPress={handleDownloadPDF}
                        disabled={downloadPdfLoading}
                        activeOpacity={0.85}
                    >
                        {downloadPdfLoading ? (
                            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 6 }}>
                                <ActivityIndicator color={TEAL} size="small" />
                                {downloadProgress > 0 && downloadProgress < 100 ? (
                                    <Text style={{ fontSize: 11, color: TEAL, fontWeight: '700' }}>
                                        {downloadProgress}%
                                    </Text>
                                ) : null}
                            </View>
                        ) : (
                            <>
                                <Text style={prescriptionViewStyles.shareBtnDocBtnFullTxt}>Download PDF</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaWrapper>
    );
};

export default PrescriptionViewScreen;
