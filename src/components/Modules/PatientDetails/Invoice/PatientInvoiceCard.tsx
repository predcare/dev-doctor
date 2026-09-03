import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { dateOnly } from '../../../../lib/common/common.utils';
import { patientInvoiceTabStyles as styles } from '../../../../styled/PatientInvoiceTabPanel.styled';

export interface PatientInvoiceCardProps {
  invoiceNumber?: string;
  grandTotal?: number | string;
  createdAt?: string;
  paymentStatus?: string;
  paymentMode?: string;
  onPress?: () => void;
}

export const PatientInvoiceCard: React.FC<PatientInvoiceCardProps> = ({
  invoiceNumber = '',
  grandTotal = 0,
  createdAt,
  paymentStatus = '',
  paymentMode = '',
  onPress,
}) => {
  const rawStatus = (paymentStatus || '').toLowerCase().trim();
  const isPaid = rawStatus === 'paid';
  const isOverdue = rawStatus === 'overdue';
  const pillBg = isPaid ? '#DCFCE7' : isOverdue ? '#FEE2E2' : '#FEF3C7';
  const pillColor = isPaid ? '#16A34A' : isOverdue ? '#DC2626' : '#B45309';
  const label = isPaid ? 'PAID' : isOverdue ? 'OVERDUE' : 'PENDING';
  const totalAmount = Number(grandTotal || 0);

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
        <View style={styles.topMetaRow}>
          <Text style={styles.recordTitle} numberOfLines={1}>
            #{invoiceNumber}
          </Text>
          <Text style={styles.invoiceAmount}>₹{totalAmount.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.bottomMetaRow}>
          <View style={styles.pillsContainer}>
            <Text style={styles.recordSub}>{dateOnly(createdAt || '')}</Text>
            <View style={[styles.pill, { backgroundColor: pillBg }]}>
              <Text style={[styles.pillText, { color: pillColor }]}>{label}</Text>
            </View>
            {paymentMode ? (
              <View style={[styles.pill, { backgroundColor: '#F1F5F9' }]}>
                <Text style={[styles.pillText, { color: '#475569' }]}>
                  {paymentMode.toUpperCase()}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={styles.chevron}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default PatientInvoiceCard;
