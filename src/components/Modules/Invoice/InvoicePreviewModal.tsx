import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDownloadInvoicePdf } from '../../../hooks/react-query/invoices/invoices.hooks';
import { handleInvoicePdfAction } from '../../../lib/common/file.utils';
import { showErrorToast } from '../../../lib/common/toast.utils';
import { theme } from '../../../styled/theme.styled';
import { IInvoiceDoc } from '../../../typescripts/interfaces/invoices.interfaces';

interface InvoicePreviewModalProps {
  visible: boolean;
  invoice: IInvoiceDoc | null;
  onClose: () => void;
  patientGeneratedId?: string | number;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  visible,
  invoice,
  onClose,
  patientGeneratedId,
}) => {
  const { mutate: downloadPdf, isPending: isDownloading } = useDownloadInvoicePdf();

  if (!invoice) return null;

  const invoiceNumber = invoice.invoice_number || '';
  const patientName = invoice.patient_name || 'Patient';
  const patientId = patientGeneratedId || '';
  const paymentStatus = invoice.payment_status || 'pending';
  const paymentMode = invoice.payment_mode || 'Cash';

  const subtotalNum = parseFloat(String(invoice.subtotal || 0));
  const totalDiscountNum = parseFloat(String(invoice.total_discount || 0));
  const cgstNum = parseFloat(String(invoice.cgst || 0));
  const sgstNum = parseFloat(String(invoice.sgst || 0));
  const igstNum = parseFloat(String(invoice.igst || 0));
  const grandTotalNum = parseFloat(String(invoice.grand_total || 0));

  const rawStatus = String(paymentStatus).toLowerCase().trim();
  const isPaid = rawStatus === 'paid';
  const isOverdue = rawStatus === 'overdue';
  const statusBg = isPaid ? theme.colors.successSoft : isOverdue ? '#FEE2E2' : '#FEF3C7';
  const statusColor = isPaid ? theme.colors.success : isOverdue ? '#DC2626' : '#B45309';

  const handleOpenPDF = () => {
    if (!invoice?.id) return;
    downloadPdf(invoice.id, {
      onSuccess: bytes => {
        handleInvoicePdfAction(invoice, 'open', bytes);
      },
    });
  };

  const handleSavePDF = () => {
    if (!invoice?.id) {
      showErrorToast('Invoice ID is missing', 'Cannot Download PDF');
      return;
    }
    downloadPdf(invoice.id, {
      onSuccess: bytes => {
        console.log('bytes', bytes);
        handleInvoicePdfAction(invoice, 'save', bytes);
      },
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tax Invoice / Receipt Preview</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.paperScroll} contentContainerStyle={styles.paperContent}>
            {/* <View style={styles.paperHeader}>
              <View style={styles.clinicDetails}>
                <Text style={styles.paperClinicName}>{clinicName}</Text>
                <Text style={styles.paperClinicSub}>{clinicAddress}</Text>
                <Text style={styles.paperClinicSub}>Phone: +91 98765 43210 • Reg: MED-KA-9921</Text>
              </View>
              <View style={styles.invoiceBadgeBox}>
                <Text style={styles.paperInvTitle}>TAX INVOICE</Text>
                <Text style={styles.paperInvNum}>{invoiceNumber}</Text>
                <Text style={styles.paperInvDate}>Date: {dateOnly(createdAt)}</Text>
              </View>
            </View>

            <View style={styles.paperDivider} /> */}

            <View style={styles.billedToRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelTitle}>BILLED TO:</Text>
                <Text style={styles.paperInvNum}>{invoiceNumber}</Text>
                <Text style={styles.patientName}>{patientName}</Text>
                {patientId && <Text style={styles.patientMeta}>ID: {patientId}</Text>}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.labelTitle}>PAYMENT STATUS:</Text>
                <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                  <Text style={[styles.statusTxt, { color: statusColor }]}>
                    {String(paymentStatus).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.modeTxt}>Mode: {paymentMode}</Text>
              </View>
            </View>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.thCell, { flex: 2 }]}>Particulars</Text>
                <Text style={[styles.thCell, { flex: 0.6, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Rate (₹)</Text>
                <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Total (₹)</Text>
              </View>

              {(invoice.items || []).map((item, idx) => (
                <View key={item.id || idx} style={styles.tableRow}>
                  <Text style={[styles.tdCell, { flex: 2, fontWeight: '600' }]}>{item.name}</Text>
                  <Text style={[styles.tdCell, { flex: 0.6, textAlign: 'center' }]}>
                    {item.qty}
                  </Text>
                  <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>
                    {parseFloat(String(item.price || 0)).toFixed(2)}
                  </Text>
                  <Text style={[styles.tdCell, { flex: 1, textAlign: 'right', fontWeight: '700' }]}>
                    {Number(item.total || 0).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Totals */}
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalVal}>₹{subtotalNum.toFixed(2)}</Text>
              </View>

              {totalDiscountNum > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Discounts:</Text>
                  <Text style={[styles.totalVal, { color: theme.colors.success }]}>
                    - ₹{totalDiscountNum.toFixed(2)}
                  </Text>
                </View>
              )}

              {(cgstNum > 0 || sgstNum > 0) && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>CGST (9%) + SGST (9%):</Text>
                  <Text style={styles.totalVal}>₹{(cgstNum + sgstNum).toFixed(2)}</Text>
                </View>
              )}

              {igstNum > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>IGST (18%):</Text>
                  <Text style={styles.totalVal}>₹{igstNum.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.grandRow}>
                <Text style={styles.grandLabel}>Amount Paid / Total:</Text>
                <Text style={styles.grandVal}>₹{grandTotalNum.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.footerSignatureRow}>
              <Text style={styles.footerNoteText}>
                {invoice.notes || 'Thank you for choosing our clinic. Wish you a healthy recovery!'}
              </Text>
              {/* <View style={styles.sigBox}>
                <View style={styles.sigLine} />
                <Text style={styles.sigTxt}>Doctor Signature & Stamp</Text>
              </View> */}
            </View>
          </ScrollView>
          <View style={styles.modalActions}>
            {!!invoice.id && (
              <TouchableOpacity style={styles.btnSecondary} onPress={handleOpenPDF}>
                <Text style={styles.btnSecondaryTxt}>👁️ Open PDF</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.btnPrimary, isDownloading && { opacity: 0.6 }]}
              onPress={handleSavePDF}
              disabled={isDownloading}
            >
              <Text style={styles.btnPrimaryTxt}>
                {isDownloading ? '⏳ Downloading...' : '📥 Download PDF'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  closeTxt: {
    fontSize: 18,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  paperScroll: {
    marginVertical: 12,
  },
  paperContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paperHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clinicDetails: {
    flex: 1,
    paddingRight: 10,
  },
  paperClinicName: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  paperClinicSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  invoiceBadgeBox: {
    alignItems: 'flex-end',
  },
  paperInvTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  paperInvNum: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    marginTop: 2,
  },
  paperInvDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  paperDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  billedToRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelTitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  patientMeta: {
    fontSize: 11,
    color: '#64748B',
  },
  statusPill: {
    backgroundColor: theme.colors.successSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 2,
  },
  statusTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.success,
  },
  modeTxt: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tdCell: {
    fontSize: 12,
    color: '#1E293B',
  },
  totalsBox: {
    alignItems: 'flex-end',
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  totalVal: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    width: 80,
    textAlign: 'right',
  },
  grandRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  grandLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  grandVal: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
    width: 90,
    textAlign: 'right',
  },
  footerSignatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
  },
  footerNoteText: {
    flex: 1,
    fontSize: 10,
    fontStyle: 'italic',
    color: '#64748B',
    paddingRight: 10,
  },
  sigBox: {
    alignItems: 'center',
  },
  sigLine: {
    width: 120,
    height: 1,
    backgroundColor: '#94A3B8',
    marginBottom: 4,
  },
  sigTxt: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 8,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSecondaryTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnPrimaryTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.surface,
  },
});

export default InvoicePreviewModal;
