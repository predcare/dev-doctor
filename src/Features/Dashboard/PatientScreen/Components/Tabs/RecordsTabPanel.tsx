import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Linking, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import CommonEmptyCard from '../../../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../../../components/commons/CommonErrorCard/CommonErrorCard';
import { PlusIcon } from '../../../../../components/ui/icons';
import { useMyPatientEmrs, useShareEmrDocument } from '../../../../../hooks/react-query/patients/patients.hooks';
import { showInfoToast, showSuccessToast } from '../../../../../lib/commons/toast.utils';
import { RecordsTabRouteProp } from '../../../../../route';
import { recordTabstyles } from '../../../../../styled/PatientDetailsScreen.styled';
import theme from '../../../../../styled/theme.styled';
import { IPatientEMRDoc } from '../../../../../typescripts/interfaces/profile.interfaces';
import { useAuthStore } from '../../../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../../../zustand/stores/useLoadingStore';
import DocumentActionsModal from '../../Modals/DocumentActionsModal';
import EMRUploadModal from '../../Modals/EMRUploadModal';
import MedicalRecordsSkeleton from '../../Skeletons/MedicalRecordsSkeleton';
import MedicalDocumentCard from '../MedicalDocumentCard';



export interface RecordsTabPanelProps {
  patientId: number | string;
}

export const RecordsTabPanel: React.FC<RecordsTabPanelProps> = ({ patientId }) => {
  const route = useRoute<RecordsTabRouteProp>();
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForAction, setSelectedDocForAction] = useState<IPatientEMRDoc | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);

  const { userData } = useAuthStore(state => state);
  const { hideLoader, showLoader } = useLoadingStore(state => state);
  const {
    data: emrData,
    isPending: isEMRPending,
    isError: isEMRCardError,
    refetch: refetchEmr,
  } = useMyPatientEmrs({
    patientId: patientId,
  });

  const { mutate: shareEmrDocumentMutate, isPending: isShareEmrDocumentPending } =
    useShareEmrDocument();



  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchEmr();
    setRefreshing(false);
  }, [refetchEmr]);

  const handleDocumentClick = (doc: IPatientEMRDoc) => {
    setSelectedDocForAction(doc);
    setShowActionsModal(true);
  };

  const handleToggleShare = (docId: string | number, newShareState: boolean) => {
    showLoader('Sharing EMR Document');
    shareEmrDocumentMutate(
      {
        docId,
        body: { visible_to_patient: newShareState },
      },
      {
        onSuccess: async res => {
          if (res?.success) {
            showSuccessToast(res?.message);
            await refetchEmr();
          }
        },
        onSettled: () => {
          hideLoader();
        },
      }
    );
  };

  const handleOpenDocument = (doc: IPatientEMRDoc) => {
    const fullUrl = doc.document_url;
    showInfoToast(`Opening "${doc.title || 'Document'}"...`, 'Opening Document');
    if (fullUrl) {
      Linking.openURL(fullUrl).catch(() => {
        showInfoToast(`Could not open document`, 'Open Document');
      });
    }
  };

  const handleSaveToDevice = (doc: IPatientEMRDoc) => {
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

  useEffect(() => {
    if (route.params?.openUploadModal) {
      setShowUploadModal(true);
      navigation.setParams({ openUploadModal: undefined });
    }
  }, [route.params?.openUploadModal, navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View style={recordTabstyles.headerRow}>
        <View style={recordTabstyles.titleGroup}>
          <Text style={recordTabstyles.title}>Medical Documents</Text>
          {Array.isArray(emrData) && emrData.length > 0 && (
            <View style={recordTabstyles.countBadge}>
              <Text style={recordTabstyles.countBadgeText}>{emrData.length}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={recordTabstyles.uploadBtn}
          onPress={() => setShowUploadModal(true)}
          activeOpacity={0.8}
        >
          <PlusIcon size={18} color={theme.colors.textInverted} />
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
            message="Something went wrong while fetching patient records."
            onRetry={refetchEmr}
          />
        </View>
      ) : (
        <FlatList
          data={emrData || []}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => {
            const isDoctorUploaded =
              String(item?.owner_id) === String(userData?.id) ||
              String(item?.created_by) === String(userData?.id);
            return (
              <MedicalDocumentCard
                document_type={item.document_type}
                id={item.id}
                title={item.title}
                visible_to_patient={!!item.visible_to_patient}
                created_at={item?.created_at}
                isDoctorUploaded={isDoctorUploaded}
                isUpdatingShare={isShareEmrDocumentPending}
                document_url={item?.document_url}
                onPress={() => handleDocumentClick(item)}
                onToggleShare={newVal => handleToggleShare(item.id, newVal)}
              />
            );
          }}
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
        doctorId={userData?.id}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          refetchEmr();
        }}
      />
    </View>
  );
};



export default RecordsTabPanel;
