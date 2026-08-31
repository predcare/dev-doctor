import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { showInfoToast, showSuccessToast } from '../../../lib/commons/toast.utils';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import DocumentActionsModal from './DocumentActionsModal';
import EMRUploadModal from './EMRUploadModal';
import MedicalDocumentCard, { MedicalDocument } from './MedicalDocumentCard';
import PrescriptionCard, { PrescriptionItem } from './PrescriptionCard';

export type RecordSubTab = 'all' | 'documents' | 'prescriptions';

export interface RecordsTabPanelProps {
  documents: MedicalDocument[];
  prescriptions: PrescriptionItem[];
  onToggleDocShare?: (docId: string, newShareState: boolean) => void;
  onToggleRxShare?: (rxId: string, newShareState: boolean) => void;
  onAddDocumentSuccess?: (newDoc: { title: string; type: string }) => void;
  onDocumentPress?: (doc: MedicalDocument) => void;
  onPrescriptionPress?: (rx: PrescriptionItem) => void;
}

export const RecordsTabPanel: React.FC<RecordsTabPanelProps> = ({
  documents,
  prescriptions,
  onToggleDocShare,
  onToggleRxShare,
  onAddDocumentSuccess,
  onDocumentPress,
  onPrescriptionPress,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<RecordSubTab>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForAction, setSelectedDocForAction] = useState<MedicalDocument | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);

  const RECORD_TABS = [
    { key: 'all' as RecordSubTab, label: 'All', count: documents.length + prescriptions.length },
    { key: 'documents' as RecordSubTab, label: 'Docs', count: documents.length },
    { key: 'prescriptions' as RecordSubTab, label: 'Rx', count: prescriptions.length },
  ];

  const handleDocumentClick = (doc: MedicalDocument) => {
    if (onDocumentPress) {
      onDocumentPress(doc);
      return;
    }
    setSelectedDocForAction(doc);
    setShowActionsModal(true);
  };

  const handleOpenDocument = (doc: MedicalDocument) => {
    showInfoToast(`Opening "${doc.title}"...`, 'Opening Document');
  };

  const handleSaveToDevice = (doc: MedicalDocument) => {
    showSuccessToast(
      `"${doc.title}" downloaded to your device downloads folder`,
      'Saved to Device'
    );
  };

  const showDocs = activeSubTab === 'all' || activeSubTab === 'documents';
  const showPres = activeSubTab === 'all' || activeSubTab === 'prescriptions';
  const totalCount = (showDocs ? documents.length : 0) + (showPres ? prescriptions.length : 0);

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Sub-tabs Row with + Upload button pinned right */}
      <View style={patientDetailsStyles.subTabRow}>
        {RECORD_TABS.map(rt => {
          const active = activeSubTab === rt.key;
          return (
            <TouchableOpacity
              key={rt.key}
              style={[
                patientDetailsStyles.subTab,
                active && patientDetailsStyles.subTabActive,
              ]}
              onPress={() => setActiveSubTab(rt.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  patientDetailsStyles.subTabText,
                  active && patientDetailsStyles.subTabTextActive,
                ]}
              >
                {rt.label}
              </Text>
              <View
                style={[
                  patientDetailsStyles.subTabBadge,
                  active && patientDetailsStyles.subTabBadgeActive,
                ]}
              >
                <Text
                  style={[
                    patientDetailsStyles.subTabBadgeText,
                    active && patientDetailsStyles.subTabBadgeTextActive,
                  ]}
                >
                  {rt.count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* + Upload Document Button */}
        <TouchableOpacity
          style={patientDetailsStyles.addDocBtn}
          onPress={() => setShowUploadModal(true)}
          activeOpacity={0.8}
        >
          <Text style={patientDetailsStyles.addDocBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Documents Section */}
      {showDocs && documents.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={patientDetailsStyles.cardSectionTitle}>Medical Documents</Text>
          {documents.map(doc => (
            <MedicalDocumentCard
              key={doc.id}
              document={doc}
              onPress={() => handleDocumentClick(doc)}
              onToggleShare={newVal => onToggleDocShare?.(doc.id, newVal)}
            />
          ))}
        </View>
      )}

      {/* Prescriptions Section */}
      {showPres && prescriptions.length > 0 && (
        <View style={{ marginBottom: 12 }}>
          <Text style={patientDetailsStyles.cardSectionTitle}>Prescriptions</Text>
          {prescriptions.map(rx => (
            <PrescriptionCard
              key={rx.id}
              prescription={rx}
              onPress={() => onPrescriptionPress?.(rx)}
              onToggleShare={newVal => onToggleRxShare?.(rx.id, newVal)}
            />
          ))}
        </View>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <View style={patientDetailsStyles.emptyState}>
          <View style={patientDetailsStyles.emptyIconBox}>
            <Text style={patientDetailsStyles.emptyIconText}>Rx</Text>
          </View>
          <Text style={patientDetailsStyles.emptyTitle}>No Medical Records</Text>
          <Text style={patientDetailsStyles.emptyText}>
            No documents or prescriptions uploaded yet for this category.
          </Text>
        </View>
      )}

      <View style={{ height: 40 }} />

      {/* Custom Document Action Sheet Modal */}
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

      {/* EMR Upload Modal */}
      <EMRUploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={onAddDocumentSuccess}
      />
    </ScrollView>
  );
};

export default RecordsTabPanel;
