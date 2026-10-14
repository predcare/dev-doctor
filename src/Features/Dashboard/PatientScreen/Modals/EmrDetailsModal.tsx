import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CloseIcon, DownloadIcon, FileDocumentIcon, OpenBadgeIcon } from '../../../../components/ui/icons';
import { formatDate } from '../../../../lib/commons/common.utils';
import theme from '../../../../styled/theme.styled';
import { IPatientEMRDoc } from '../../../../typescripts/interfaces/profile.interfaces';

export interface EmrDetailsModalProps {
  visible: boolean;
  document: IPatientEMRDoc | null;
  onOpenDocument: (doc: IPatientEMRDoc) => void;
  onSaveToDevice: (doc: IPatientEMRDoc) => void;
  onDownload: (doc: IPatientEMRDoc) => void;
  onClose: () => void;
}

const IMAGE_EXTS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const fileExt = (url?: string) => {
  const cleanPath = (url || '').split('?')[0] || '';
  return (cleanPath.split('.').pop() || '').toLowerCase();
};

export const EmrDetailsModal: React.FC<EmrDetailsModalProps> = ({
  visible,
  document,
  onOpenDocument,
  onSaveToDevice,
  onDownload,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  if (!visible || !document) return null;

  const ext = fileExt(document.document_url);
  const isImage = IMAGE_EXTS.includes(ext);
  const description = document.description?.trim() || '';
  const notes = document.notes?.trim() || '';
  const doctorName = document.doctor_name?.trim() || '';
  const specialization = document.specialization?.trim() || '';
  const uploadedOn = formatDate(document.created_at);
  const showNotes = !!notes && notes !== description;

  const runAction = (action: (doc: IPatientEMRDoc) => void) => {
    onClose();
    setTimeout(() => action(document), 100);
  };

  const isVisible = !!document.visible_to_patient;
  const fileSize = document.file_size?.trim() || '';

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  maxHeight: height * 0.88,
                  paddingBottom: Math.max(20, insets.bottom + 12),
                },
              ]}
            >
              <View style={styles.handle} />

              <View style={styles.headerRow}>
                <View style={styles.typeChip}>
                  <Text style={styles.typeChipText}>
                    {document.document_type || 'Medical Document'}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                  <CloseIcon />
                </TouchableOpacity>
              </View>

              <Text style={styles.sheetTitle} numberOfLines={2}>
                {document.title || 'Medical Document'}
              </Text>

              <View style={styles.pillRow}>
                <View style={[styles.pill, isVisible ? styles.pillVisible : styles.pillHidden]}>
                  <Text style={[styles.pillText, isVisible ? styles.pillTextVisible : styles.pillTextHidden]}>
                    {isVisible ? 'Visible to patient' : 'Hidden from patient'}
                  </Text>
                </View>
                {!!fileSize && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{fileSize}</Text>
                  </View>
                )}
                {!!uploadedOn && (
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{uploadedOn}</Text>
                  </View>
                )}
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={styles.scrollContent}
              >
                {!!description && (
                  <View style={styles.descCard}>
                    <Text style={styles.descLabel}>Description</Text>
                    <Text style={styles.descText}>{description}</Text>
                  </View>
                )}
                {isImage && !!document.document_url ? (
                  <View style={styles.previewFrame}>
                    <Image
                      source={{ uri: document.document_url }}
                      style={styles.preview}
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View style={styles.fileHero}>
                    <FileDocumentIcon size={28} color={theme.colors.primary} />
                    <Text style={styles.fileHeroExt}>{(ext || 'file').toUpperCase()}</Text>
                  </View>
                )}



                {showNotes && (
                  <View style={styles.notesCard}>
                    <Text style={styles.descLabel}>Notes</Text>
                    <Text style={styles.descText}>{notes}</Text>
                  </View>
                )}

                {(!!doctorName || !!specialization) && (
                  <View style={styles.metaCard}>
                    {!!doctorName && <DetailRow label="Doctor" value={doctorName} />}
                    {!!specialization && <DetailRow label="Specialization" value={specialization} />}
                  </View>
                )}
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => runAction(onOpenDocument)}
                  activeOpacity={0.85}
                >
                  <OpenBadgeIcon size={18} color={theme.colors.textInverted} />
                  <Text style={styles.primaryBtnText}>{isImage ? 'Open Image' : 'Open File'}</Text>
                </TouchableOpacity>

                <View style={styles.secondaryRow}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => runAction(onSaveToDevice)}
                    activeOpacity={0.85}
                  >
                    <FileDocumentIcon size={16} color={theme.colors.primary} />
                    <Text style={styles.secondaryBtnText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => runAction(onDownload)}
                    activeOpacity={0.85}
                  >
                    <DownloadIcon size={16} color={theme.colors.primary} />
                    <Text style={styles.secondaryBtnText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metaRow}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={styles.metaValue}>{value}</Text>
  </View>
);

export default EmrDetailsModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.surfaceBorder,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeChip: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    maxWidth: '78%',
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.dark,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  pill: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pillVisible: {
    backgroundColor: theme.colors.successSoft,
  },
  pillHidden: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  pillText: {
    fontSize: 11,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textSlate,
  },
  pillTextVisible: {
    color: theme.colors.primary,
  },
  pillTextHidden: {
    color: theme.colors.textSlate,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  previewFrame: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  preview: {
    width: '100%',
    height: 210,
  },
  fileHero: {
    height: 120,
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: theme.colors.primarySoft,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  fileHeroExt: {
    fontSize: 12,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    letterSpacing: 0.6,
  },
  descCard: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    padding: 14,
    marginBottom: 12,
  },
  notesCard: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  descLabel: {
    fontSize: 11,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  descText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  metaCard: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 4,
  },
  metaRow: {
    paddingVertical: 10,
  },
  metaLabel: {
    fontSize: 11,
    color: theme.colors.textSlate,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: theme.colors.dark,
    fontWeight: theme.fontWeight.medium,
  },
  actions: {
    paddingTop: 12,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceBorder,
  },
  primaryBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textInverted,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.mintBdr,
    backgroundColor: theme.colors.primarySoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.primary,
  },
});
