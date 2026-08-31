import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { patientInvoiceTabStyles as styles } from '../../../../styled/PatientInvoiceTabPanel.styled';
import { Invoice, PatientInvoiceTabProps } from '../../../../typescripts/types/invoice.types';
import InvoicePreviewModal from '../../Invoice/InvoicePreviewModal';

const TEAL = '#00897B';

export const PatientInvoiceTabPanel: React.FC<PatientInvoiceTabProps> = ({
  patientId,
  patientName,
  navigation,
}) => {
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<Invoice | null>(null);

  // Static Patient Invoices Mock Data
  const [patientInvoices] = useState<Invoice[]>([
    {
      id: 'inv_101',
      invoiceNumber: 'INV-2026-0042',
      patientId: patientId || 'PAT-1092',
      patientName: patientName || 'Eleanor Vance',
      appointmentDate: '12 Aug 2026',
      createdDate: '12 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Consultation & Special Diagnostic ECG',
          qty: '1',
          price: '800',
          discount: '0',
          discount_type: '%',
          tax_percent: '18',
          total: 944,
        },
        {
          id: '2',
          name: 'Troponin-T Marker',
          qty: '1',
          price: '500',
          discount: '0',
          discount_type: '%',
          tax_percent: '0',
          total: 500,
        },
      ],
      subtotal: 1300,
      totalDiscount: 0,
      cgst: 72,
      sgst: 72,
      igst: 0,
      grandTotal: 1444,
      paymentMode: 'UPI',
      status: 'Paid',
      clinicName: 'Pred Care Multispecialty Clinic',
    },
    {
      id: 'inv_102',
      invoiceNumber: 'INV-2026-0018',
      patientId: patientId || 'PAT-1092',
      patientName: patientName || 'Eleanor Vance',
      appointmentDate: '01 Aug 2026',
      createdDate: '01 Aug 2026',
      items: [
        {
          id: '1',
          name: 'Follow-up Consultation',
          qty: '1',
          price: '500',
          discount: '0',
          discount_type: '%',
          tax_percent: '0',
          total: 500,
        },
      ],
      subtotal: 500,
      totalDiscount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      grandTotal: 500,
      paymentMode: 'Cash',
      status: 'Paid',
      clinicName: 'Pred Care Multispecialty Clinic',
    },
    {
      id: 'inv_103',
      invoiceNumber: 'INV-2026-0005',
      patientId: patientId || 'PAT-1092',
      patientName: patientName || 'Eleanor Vance',
      appointmentDate: '15 Jul 2026',
      createdDate: '15 Jul 2026',
      items: [
        {
          id: '1',
          name: 'General Physical Checkup',
          qty: '1',
          price: '1200',
          discount: '10',
          discount_type: '%',
          tax_percent: '18',
          total: 1274.4,
        },
      ],
      subtotal: 1200,
      totalDiscount: 120,
      cgst: 97.2,
      sgst: 97.2,
      igst: 0,
      grandTotal: 1274.4,
      paymentMode: 'Online',
      status: 'Pending',
      clinicName: 'Pred Care Multispecialty Clinic',
    },
  ]);

  const handleCreateNewInvoice = () => {
    if (navigation?.navigate) {
      navigation.navigate('CreateInvoice', {
        patientId: patientId || 'PF-001092',
        patientName: patientName || 'Eleanor Vance',
      });
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* Header Row: Invoices title + "+ New Invoice" button */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeading}>Invoices</Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          onPress={handleCreateNewInvoice}
        >
          <Text style={styles.primaryBtnText}>+ New Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Invoice List */}
      {patientInvoices.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconBox}>
            <Text style={styles.emptyIconText}>INV</Text>
          </View>
          <Text style={styles.emptyTitle}>No Invoices Yet</Text>
          <Text style={styles.emptyText}>Tap "+ New Invoice" to create one.</Text>
        </View>
      ) : (
        patientInvoices.map((inv: Invoice) => {
          const rawStatus = (inv.status || '').toLowerCase().trim();
          const isPaid = rawStatus === 'paid';
          const isOverdue = rawStatus === 'overdue';
          const pillBg = isPaid ? '#DCFCE7' : isOverdue ? '#FEE2E2' : '#FEF3C7';
          const pillColor = isPaid ? '#16A34A' : isOverdue ? '#DC2626' : '#B45309';
          const label = isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING';
          const grandTotal = Number(inv.grandTotal || 0);

          return (
            <View key={inv.id} style={styles.card}>
              <View style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
                {/* Top: invoice number + amount */}
                <View style={styles.topMetaRow}>
                  <Text style={styles.recordTitle} numberOfLines={1}>
                    #{inv.invoiceNumber || inv.id}
                  </Text>
                  <Text style={styles.invoiceAmount}>
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </Text>
                </View>

                {/* Bottom: date + status pill + payment mode pill + open PDF arrow */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedInvoiceForPreview(inv)}
                  style={styles.bottomMetaRow}
                >
                  <View style={styles.pillsContainer}>
                    <Text style={styles.recordSub}>{inv.createdDate}</Text>
                    <View style={[styles.pill, { backgroundColor: pillBg }]}>
                      <Text style={[styles.pillText, { color: pillColor }]}>
                        {label}
                      </Text>
                    </View>
                    {inv.paymentMode ? (
                      <View style={[styles.pill, { backgroundColor: '#F1F5F9' }]}>
                        <Text style={[styles.pillText, { color: '#475569' }]}>
                          {inv.paymentMode}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })
      )}

      <View style={{ height: 24 }} />

      {/* PDF View Modal */}
      {selectedInvoiceForPreview && (
        <InvoicePreviewModal
          visible={!!selectedInvoiceForPreview}
          invoice={selectedInvoiceForPreview}
          onClose={() => setSelectedInvoiceForPreview(null)}
        />
      )}
    </ScrollView>
  );
};

export default PatientInvoiceTabPanel;

