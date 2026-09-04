import React, { useCallback, useState } from 'react';
import { FlatList, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useMyPatientEmrs } from '../../../hooks/react-query/patients/patients.hooks';
import { showInfoToast, showSuccessToast } from '../../../lib/common/toast.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import { theme } from '../../../styled/theme.styled';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import CommonEmptyCard from '../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../commons/CommonErrorCard/CommonErrorCard';
import MedicalRecordsSkeleton from '../../Skeletons/MedicalRecordsSkeleton';
import DocumentActionsModal from './DocumentActionsModal';
import EMRUploadModal from './EMRUploadModal';
import MedicalDocumentCard, { MedicalDocument } from './MedicalDocumentCard';

export interface RecordsTabPanelProps {
  patientId: number | string;
}

export const RecordsTabPanel: React.FC<RecordsTabPanelProps> = ({ patientId }) => {
  const { userData } = useAuthStore(state => state);
  const {
    data: emrData,
    isPending: isEMRPending,
    isError: isEMRCardError,
    error: emrCardError,
    refetch: refetchEmr,
  } = useMyPatientEmrs({
    patientId: patientId,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForAction, setSelectedDocForAction] = useState<MedicalDocument | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [localShareOverrides, setLocalShareOverrides] = useState<Record<string | number, boolean>>(
    {}
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchEmr();
    setRefreshing(false);
  }, [refetchEmr]);

  const handleDocumentClick = (doc: MedicalDocument) => {
    setSelectedDocForAction(doc);
    setShowActionsModal(true);
  };

  const handleToggleShare = (docId: string | number, newShareState: boolean) => {
    setLocalShareOverrides(prev => ({ ...prev, [docId]: newShareState }));
  };

  const handleOpenDocument = (doc: MedicalDocument) => {
    const fullUrl = doc.document_url;
    showInfoToast(`Opening "${doc.title || 'Document'}"...`, 'Opening Document');
    if (fullUrl) {
      Linking.openURL(fullUrl).catch(() => {
        showInfoToast(`Could not open document`, 'Open Document');
      });
    }
  };

  const handleSaveToDevice = (doc: MedicalDocument) => {
    const fullUrl = doc.document_url;
    if (fullUrl) {
      Linking.openURL(fullUrl).catch(() => {
        showInfoToast(`Could not download document`, 'Download Document');
      });
    } else {
      showSuccessToast(
        `"${doc.title || 'Document'}" downloaded to your device downloads folder`,
        'Saved to Device'
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          patientDetailsStyles.subTabRow,
          { justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
        ]}
      >
        <Text
          style={[patientDetailsStyles.cardSectionTitle, { marginBottom: 0, paddingHorizontal: 0 }]}
        >
          Medical Documents
        </Text>
        <TouchableOpacity
          style={patientDetailsStyles.addDocBtn}
          onPress={() => setShowUploadModal(true)}
          activeOpacity={0.8}
        >
          <Text style={patientDetailsStyles.addDocBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      {isEMRPending && !refreshing ? (
        <View style={{ flex: 1 }}>
          <MedicalRecordsSkeleton />
        </View>
      ) : isEMRCardError ? (
        <View style={{ flex: 1 }}>
          <CommonErrorCard
            title="Failed to Load Medical Documents"
            message={
              (emrCardError as any)?.message ||
              'Something went wrong while fetching patient records.'
            }
            onRetry={refetchEmr}
          />
        </View>
      ) : (
        <FlatList
          data={emrData || []}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <MedicalDocumentCard
              document_type={item.document_type}
              id={item.id}
              title={item.title}
              visible_to_patient={item?.visible_to_patient}
              appointment_date={item?.appointment_date}
              created_at={item?.created_at}
              doctor_name={item?.doctor_name}
              doctor_id={item?.doctor_id}
              isDoctorUploaded={item?.doctor_id === userData?.user_id}
              document_url={item?.document_url}
              onPress={() => handleDocumentClick(item)}
              onToggleShare={newVal => handleToggleShare(item.id, newVal)}
            />
          )}
          ListEmptyComponent={
            <CommonEmptyCard
              title="No Medical Documents"
              message="No medical documents uploaded yet for this patient."
              actionText="+ Add Document"
              onAction={() => setShowUploadModal(true)}
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      <DocumentActionsModal
        visible={showActionsModal}
        document={selectedDocForAction}
        onOpenDocument={handleOpenDocument}
        onSaveToDevice={handleSaveToDevice}
        onClose={() => {
          setShowActionsModal(false);
          setSelectedDocForAction(null);
        }}
      />

      <EMRUploadModal
        visible={showUploadModal}
        patientId={patientId}
        doctorId={userData?.user_id}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          refetchEmr();
        }}
      />
    </View>
  );
};

export default RecordsTabPanel;
