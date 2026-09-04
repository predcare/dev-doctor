import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import PrescriptionViewSkeleton from '../../components/Skeletons/PrescriptionViewSkeleton';
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DiagnosisDocumentIcon,
  EditIcon,
  LabTestBoardIcon,
  LightbulbInstructionsIcon,
  PatientAgeCalendarIcon,
  PatientAvatarIcon,
  PatientGenderIcon,
  PillIcon,
  PromoStarIcon,
  ReferralIcon,
  SymptomsWarningIcon,
  VitalsPulseIcon,
} from '../../components/ui/icons';
import {
  useDownloadPrescriptionPdf,
  useGetPrescriptionDetails,
  useResendPrescriptionEmail,
} from '../../hooks/react-query/prescriptions/prescriptions.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { dateOnly } from '../../lib/common/common.utils';
import { showErrorToast, showInfoToast, showSuccessToast } from '../../lib/common/toast.utils';
import { AppRoute, PrescriptionViewScreenProps } from '../../route';
import {
  prescriptionViewStyles as S,
  TEAL,
  TEAL_DARK,
} from '../../styled/PrescriptionViewScreen.styled';
import type { IPatientPrescriptionDoc } from '../../typescripts/interfaces/prescriptions.interfaces';

export const PrescriptionViewScreen: React.FC<PrescriptionViewScreenProps> = ({
  navigation,
  route,
}) => {
  const { rxId } = route?.params || {};
  const {
    data: prescriptionInfo,
    isFetching: prescriptionInfoLoading,
    isError,
    refetch,
  } = useGetPrescriptionDetails({
    id: Number(rxId),
  });

  const rxDoc: IPatientPrescriptionDoc | undefined = prescriptionInfo?.prescription;

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
      date: dateOnly(rxDoc.created_at),
      status: rxDoc.status || 'completed',

      // Patient Info
      patientName: rxDoc.patient_name || route?.params?.patientName || 'Patient',
      patientAge: rxDoc.patient_age || 'N/A',
      patientGender: rxDoc.patient_gender || 'N/A',
      patientId: rxDoc.patient_id ? `#${rxDoc.patient_id}` : route?.params?.patientId || 'N/A',

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
      followUp:
        sanitizeText(rxDoc.follow_up) ||
        (rxDoc.follow_up_date ? new Date(rxDoc.follow_up_date).toLocaleDateString('en-GB') : null),
      referralSpecialist: sanitizeText(rxDoc.referral_specialist),
      referralDoctorHospital: sanitizeText(rxDoc.referral_doctor_hospital),
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

  const isCompleted = displayData?.status === 'completed';

  const handleResendToPatient = useCallback(() => {
    if (!rxDoc?.id) {
      showErrorToast('Prescription ID is missing', 'Email Failed');
      return;
    }
    resendEmailMutation(rxDoc.id, {
      onSuccess: res => {
        showSuccessToast(res?.message || "Prescription sent to patient's email.", '📧 Email Sent');
      },
      onError: (e: any) => {
        const msg = e?.response?.data?.message || 'Failed to send email';
        showErrorToast(msg, 'Email Failed');
      },
    });
  }, [rxDoc?.id, resendEmailMutation]);

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

  const handleEdit = useCallback(() => {
    if (rxDoc) {
      navigation?.navigate(AppRoute.CREATE_PRESCRIPTION, {
        patientId: rxDoc.patient_id,
        prescriptionId: rxDoc.id,
      });
    } else {
      showInfoToast('Prescription details not available for editing.', 'Edit Prescription');
    }
  }, [navigation, rxDoc]);

  if (prescriptionInfoLoading) {
    return (
      <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={S.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
            <ChevronLeftIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Summary</Text>
          <View style={S.headerRight} />
        </View>
        <PrescriptionViewSkeleton />
      </SafeAreaWrapper>
    );
  }

  // 2. Error State
  if (isError || !displayData) {
    return (
      <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={S.header}>
          <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
            <ChevronLeftIcon size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={S.headerTitle}>Summary</Text>
          <View style={S.headerRight} />
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
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
    <SafeAreaWrapper>
      <View style={S.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <ChevronLeftIcon size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={S.headerTitle}>Summary</Text>
        <View style={S.headerRight}>
          <TouchableOpacity style={S.editPill} activeOpacity={0.7} onPress={handleEdit}>
            <EditIcon size={14} color={TEAL} />
            <Text style={S.editPillTxt}>Edit</Text>
          </TouchableOpacity>
          <Text style={S.rxIdBadge}>{displayData.rxId}</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Clinic Card */}
        <View style={S.clinicCard}>
          <View style={{ flex: 1 }}>
            <Text style={S.clinicName}>{displayData.clinicName}</Text>
            {displayData.clinicAddress ? (
              <Text style={S.clinicSub}>{displayData.clinicAddress}</Text>
            ) : (
              <Text style={S.clinicSub}>Prescription Details</Text>
            )}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={S.clinicDate}>{displayData.date}</Text>
            <View style={{ height: 4 }} />
            <View style={[S.statusChip, { backgroundColor: isCompleted ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[S.statusChipTxt, { color: isCompleted ? '#059669' : '#D97706' }]}>
                {isCompleted ? 'CONFIRMED' : 'DRAFT'}
              </Text>
            </View>
          </View>
        </View>

        {/* Patient Card */}
        <View style={S.patientCard}>
          <View style={S.patientAvatarBox}>
            <PatientAvatarIcon size={24} color={TEAL} />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.patientName}>{displayData.patientName}</Text>
            <View style={S.patientMetaRow}>
              <View style={S.patientMetaItem}>
                <PatientAgeCalendarIcon size={14} color={TEAL_DARK} style={{ marginRight: 4 }} />
                <Text style={S.patientMetaTxt}>{displayData.patientAge}</Text>
              </View>

              <View style={S.patientMetaItem}>
                <PatientGenderIcon size={14} color={TEAL_DARK} style={{ marginRight: 4 }} />
                <Text style={S.patientMetaTxt}>{displayData.patientGender}</Text>
              </View>
            </View>
          </View>

          <View style={S.patientIdBadge}>
            <Text style={S.patientIdBadgeTxt}>{displayData.patientId}</Text>
          </View>
        </View>

        {/* Medical Background (Drug Allergies & Chronic Conditions) - Full Width Stacked */}
        {(displayData.drugAllergies || displayData.chronicConditions) && (
          <View style={S.outerSection}>
            <View style={S.medicalBadgesColumn}>
              {displayData.drugAllergies && (
                <View style={S.medicalBadgeFull}>
                  <Text style={S.medicalBadgeTitle}>Drug Allergies</Text>
                  <Text style={S.medicalBadgeVal}>{displayData.drugAllergies}</Text>
                </View>
              )}

              {displayData.chronicConditions && (
                <View style={S.medicalBadgeFull}>
                  <Text style={S.medicalBadgeTitle}>Chronic Conditions</Text>
                  <Text style={S.medicalBadgeVal}>{displayData.chronicConditions}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Standard Vitals Section */}
        {displayData.standardVitals.length > 0 && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <VitalsPulseIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Vitals</Text>
            </View>

            <View style={S.contentCard}>
              <View style={[S.vitalsRow, { flexWrap: 'wrap', gap: 6 }]}>
                {displayData.standardVitals.map((v, i) => (
                  <View key={i} style={[S.vitalBox, { minWidth: '28%', flex: 0 }]}>
                    <Text style={S.vitalLbl}>{v.label}</Text>
                    <Text style={S.vitalVal}>{v.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Custom Vitals Section (Separated!) */}
        {displayData.customVitals.length > 0 && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <VitalsPulseIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Custom Vitals</Text>
            </View>

            <View style={S.contentCard}>
              {displayData.customVitals.map((cv, i) => (
                <View key={i} style={S.customVitalBox}>
                  <Text style={S.customVitalLbl}>{cv.name}</Text>
                  <Text style={S.customVitalVal}>{cv.value}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Chief Complaints Section */}
        {(displayData.chiefComplaints || displayData.symptoms) && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <SymptomsWarningIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Chief Complaints</Text>
            </View>

            <View style={S.contentCard}>
              <View style={S.textBox}>
                <Text style={S.textBoxTxt}>
                  {displayData.chiefComplaints || displayData.symptoms}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Examination Notes */}
        {displayData.examinationNotes && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <DiagnosisDocumentIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Examination Notes</Text>
            </View>

            <View style={S.contentCard}>
              <View style={S.textBox}>
                <Text style={S.textBoxTxt}>{displayData.examinationNotes}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Diagnosis Section */}
        {displayData.diagnosis && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <DiagnosisDocumentIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Diagnosis</Text>
            </View>

            <View style={S.contentCard}>
              <View style={S.textBox}>
                <Text style={[S.textBoxTxt, { color: TEAL, fontWeight: '700' }]}>
                  {displayData.diagnosis}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Treatment Plan Section */}
        {displayData.treatmentPlan && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <LightbulbInstructionsIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Treatment Plan</Text>
            </View>

            <View style={S.contentCard}>
              <View style={S.textBox}>
                <Text style={S.textBoxTxt}>{displayData.treatmentPlan}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Medications Section */}
        {displayData.medications.length > 0 && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <PillIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Medications</Text>
              <View style={{ flex: 1 }} />
              <Text style={S.outerCountTxt}>{displayData.medications.length} ITEMS</Text>
            </View>

            <View style={S.contentCard}>
              {displayData.medications.map((med, i) => {
                const strengthStr = med.strength
                  ? `${med.strength} ${med.strengthUnit || 'mg'}`
                  : '';
                const durationStr = med.durationNum
                  ? `${med.durationNum} ${med.durationUnit || 'days'}`
                  : '';

                return (
                  <View
                    key={med.id || i}
                    style={[S.medItem, i < displayData.medications.length - 1 && S.medBorder]}
                  >
                    <View style={S.medTopRow}>
                      <Text style={S.medName}>
                        {med.name} {strengthStr ? `(${strengthStr})` : ''}
                      </Text>
                      {med.dosage ? <Text style={S.medDosage}>{med.dosage}</Text> : null}
                    </View>

                    <View style={S.medBotRow}>
                      {durationStr ? (
                        <View style={S.medMetaItem}>
                          <Text style={S.medMetaTxt}>📅 {durationStr}</Text>
                        </View>
                      ) : null}
                      {med.timing ? (
                        <View style={S.medMetaItem}>
                          <Text style={S.medMetaTxt}>🍽 {med.timing}</Text>
                        </View>
                      ) : null}
                      {med.instructions ? (
                        <View style={S.medMetaItem}>
                          <Text style={S.medMetaTxt}>ℹ️ {med.instructions}</Text>
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
          <View style={S.instructionsCard}>
            <View style={S.instructionsHd}>
              <LightbulbInstructionsIcon size={18} color={TEAL} />
              <Text style={S.instructionsTitle}>INSTRUCTIONS & ADVICE</Text>
            </View>
            <Text style={S.instructionsTxt}>{displayData.generalAdvice}</Text>
          </View>
        )}

        {/* Doctor Notes Card */}
        {displayData.notes && (
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <LightbulbInstructionsIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Doctor Notes</Text>
            </View>
            <View style={S.contentCard}>
              <View style={S.textBox}>
                <Text style={S.textBoxTxt}>{displayData.notes}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Follow-up Card */}
        {displayData.followUp && (
          <View style={S.followUpCard}>
            <View>
              <Text style={S.followUpLbl}>FOLLOW-UP</Text>
              <Text style={S.followUpDate}>{displayData.followUp}</Text>
            </View>
            <View style={S.followUpIconBox}>
              <CalendarIcon size={22} color={TEAL_DARK} />
            </View>
          </View>
        )}

        {/* Referral Card */}
        {(displayData.referralSpecialist ||
          displayData.referralDoctorHospital ||
          displayData.referralReason) && (
          <View style={S.outerSection}>
            <View style={S.referralCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ReferralIcon size={18} color="#1D4ED8" />
                <Text style={S.referralTitle}>Referral Details</Text>
              </View>
              {displayData.referralSpecialist && (
                <Text style={S.referralTxt}>Specialist: {displayData.referralSpecialist}</Text>
              )}
              {displayData.referralDoctorHospital && (
                <Text style={S.referralTxt}>
                  Doctor / Hospital: {displayData.referralDoctorHospital}
                </Text>
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
          <View style={S.outerSection}>
            <View style={S.outerSectionHd}>
              <LabTestBoardIcon size={18} color={TEAL} />
              <Text style={S.outerSectionTitle}>Lab Tests</Text>
              <View style={{ flex: 1 }} />
              <Text style={S.outerCountTxt}>{displayData.labTests.length} ITEMS</Text>
            </View>

            <View style={S.contentCard}>
              {displayData.labTests.map((lab, i) => (
                <View
                  key={i}
                  style={[S.medItem, i < displayData.labTests.length - 1 && S.medBorder]}
                >
                  <Text style={S.medName}>
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

        {/* Promo Row */}
        <TouchableOpacity style={S.promoRow} activeOpacity={0.7}>
          <View style={S.promoIconBox}>
            <PromoStarIcon size={20} color={TEAL} />
          </View>
          <Text style={S.promoTxt}>Stay healthy with our clinical sanctuary programs.</Text>
          <ChevronRightIcon size={16} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={S.bottomBar}>
        <View style={S.shareBtnRow}>
          <TouchableOpacity
            style={[S.shareBtn, resendEmailLoading && { opacity: 0.7 }]}
            onPress={handleResendToPatient}
            disabled={resendEmailLoading}
            activeOpacity={0.85}
          >
            {resendEmailLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={{ fontSize: 16, color: '#FFFFFF' }}>✉</Text>
                <Text style={S.shareBtnTxt}>Resend to Patient</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[S.shareBtnDocBtn, downloadPdfLoading && { opacity: 0.7 }]}
            onPress={handleDownloadPDF}
            disabled={downloadPdfLoading}
            activeOpacity={0.85}
          >
            {downloadPdfLoading ? (
              <View style={{ alignItems: 'center' }}>
                <ActivityIndicator color={TEAL} size="small" />
                {downloadProgress > 0 && downloadProgress < 100 ? (
                  <Text style={{ fontSize: 9, color: TEAL, fontWeight: '700' }}>
                    {downloadProgress}%
                  </Text>
                ) : null}
              </View>
            ) : (
              <Text style={{ fontSize: 22, color: TEAL }}>📥</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default PrescriptionViewScreen;
