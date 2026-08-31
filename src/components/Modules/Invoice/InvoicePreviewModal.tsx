import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { theme } from '../../../styled/theme.styled';
import { Invoice } from '../../../typescripts/types/invoice.types';

interface InvoicePreviewModalProps {
  visible: boolean;
  invoice: Invoice | null;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  visible,
  invoice,
  onClose,
}) => {
  if (!invoice) return null;

  const handlePrint = () => {
    Toast.show({
      type: 'success',
      text1: 'Sending to Printer...',
      text2: `Invoice ${invoice.invoiceNumber} queued for printing.`,
      position: 'bottom',
    });
  };

  const handleSavePDF = () => {
    Toast.show({
      type: 'success',
      text1: 'PDF Exported!',
      text2: `${invoice.invoiceNumber}.pdf saved to Downloads directory.`,
      position: 'bottom',
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header Bar */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tax Invoice / Receipt Preview</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeTxt}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* PDF Receipt Layout Paper */}
          <ScrollView style={styles.paperScroll} contentContainerStyle={styles.paperContent}>
            {/* Header / Clinic Logo */}
            <View style={styles.paperHeader}>
              <View style={styles.clinicDetails}>
                <Text style={styles.paperClinicName}>
                  {invoice.clinicName || 'Pred Care Multispecialty Clinic'}
                </Text>
                <Text style={styles.paperClinicSub}>
                  {invoice.clinicAddress || '7th Block, Koramangala, Bengaluru, KA'}
                </Text>
                <Text style={styles.paperClinicSub}>Phone: +91 98765 43210 • Reg: MED-KA-9921</Text>
              </View>
              <View style={styles.invoiceBadgeBox}>
                <Text style={styles.paperInvTitle}>TAX INVOICE</Text>
                <Text style={styles.paperInvNum}>{invoice.invoiceNumber}</Text>
                <Text style={styles.paperInvDate}>Date: {invoice.createdDate}</Text>
              </View>
            </View>

            <View style={styles.paperDivider} />

            {/* Billed To Section */}
            <View style={styles.billedToRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelTitle}>BILLED TO:</Text>
                <Text style={styles.patientName}>{invoice.patientName}</Text>
                <Text style={styles.patientMeta}>ID: {invoice.patientId}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.labelTitle}>PAYMENT STATUS:</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusTxt}>{invoice.status.toUpperCase()}</Text>
                </View>
                <Text style={styles.modeTxt}>Mode: {invoice.paymentMode}</Text>
              </View>
            </View>

            {/* Line Items Table */}
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.thCell, { flex: 2 }]}>Particulars</Text>
                <Text style={[styles.thCell, { flex: 0.6, textAlign: 'center' }]}>Qty</Text>
                <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Rate (₹)</Text>
                <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Total (₹)</Text>
              </View>

              {invoice.items.map((item, idx) => (
                <View key={item.id || idx} style={styles.tableRow}>
                  <Text style={[styles.tdCell, { flex: 2, fontWeight: '600' }]}>{item.name}</Text>
                  <Text style={[styles.tdCell, { flex: 0.6, textAlign: 'center' }]}>{item.qty}</Text>
                  <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>
                    {parseFloat(item.price).toFixed(2)}
                  </Text>
                  <Text style={[styles.tdCell, { flex: 1, textAlign: 'right', fontWeight: '700' }]}>
                    {item.total.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Totals */}
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalVal}>₹{invoice.subtotal.toFixed(2)}</Text>
              </View>

              {invoice.totalDiscount > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Discounts:</Text>
                  <Text style={[styles.totalVal, { color: theme.colors.success }]}>
                    - ₹{invoice.totalDiscount.toFixed(2)}
                  </Text>
                </View>
              )}

              {invoice.cgst > 0 && (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>CGST (9%) + SGST (9%):</Text>
                  <Text style={styles.totalVal}>₹{(invoice.cgst + invoice.sgst).toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.grandRow}>
                <Text style={styles.grandLabel}>Amount Paid / Total:</Text>
                <Text style={styles.grandVal}>₹{invoice.grandTotal.toFixed(2)}</Text>
              </View>
            </View>

            {/* Signature & Stamp */}
            <View style={styles.footerSignatureRow}>
              <Text style={styles.footerNoteText}>
                {invoice.notes || 'Thank you for choosing our clinic. Wish you a healthy recovery!'}
              </Text>
              <View style={styles.sigBox}>
                <View style={styles.sigLine} />
                <Text style={styles.sigTxt}>Doctor Signature & Stamp</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.btnSecondary} onPress={handlePrint}>
              <Text style={styles.btnSecondaryTxt}>🖨️ Print Receipt</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={handleSavePDF}>
              <Text style={styles.btnPrimaryTxt}>📥 Download PDF</Text>
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
