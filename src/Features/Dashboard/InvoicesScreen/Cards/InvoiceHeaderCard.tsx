import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InvoiceHeaderCardProps {
  patientName: string;
  patientGenId: string;
  patientAge?: string;
  patientGender?: string;
  clinicName?: string;
  clinicAddress?: string;
  onEditClinicPress?: () => void;
}

export const InvoiceHeaderCard: React.FC<InvoiceHeaderCardProps> = ({
  patientName,
  patientGenId,
  patientAge = '34y',
  patientGender = 'Female',
  clinicName = 'PRED Care Multispecialty Clinic',
  clinicAddress = '7th Block, Koramangala, Bengaluru, KA',
  onEditClinicPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.patientCard}>
        <View style={styles.patientAvatar}>
          <Text style={styles.patientAvatarTxt}>
            {(patientName || 'P').substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientLabel}>PATIENT DETAILS</Text>
          <Text style={styles.patientName}>{patientName}</Text>
          <Text style={styles.patientMeta}>
            {[patientAge, patientGender, patientGenId ? `ID: #${patientGenId}` : null]
              .filter(Boolean)
              .join('  •  ')}
          </Text>
        </View>
      </View>

      {/* ── Clinic Card with Edit Button ── */}
      <View style={styles.clinicCard}>
        <View style={styles.clinicTop}>
          <Text style={styles.clinicName}>{clinicName}</Text>
          {clinicAddress ? (
            <Text style={styles.clinicMeta} numberOfLines={1}>
              {clinicAddress}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  patientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  patientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00897B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  patientAvatarTxt: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  patientLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  patientMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  clinicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  clinicTop: {
    flex: 1,
  },
  clinicName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00897B',
    marginBottom: 2,
  },
  clinicMeta: {
    fontSize: 12,
    color: '#9CA3AF',
  }
});

export default InvoiceHeaderCard;
