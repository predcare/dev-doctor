import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PaymentMode } from '../../../typescripts/types/invoice.types';

interface InvoiceBillingConfigProps {
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
  notes: string;
  onNotesChange: (text: string) => void;
}

export const InvoiceBillingConfig: React.FC<InvoiceBillingConfigProps> = ({
  paymentMode,
  onPaymentModeChange,
  notes,
  onNotesChange,
}) => {
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const paymentModes: PaymentMode[] = ['Cash', 'Card', 'UPI', 'Online'];

  return (
    <View style={styles.container}>
      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>💳 Payment & Notes</Text>
      </View>

      <View style={styles.sectionCard}>
        {/* Payment Mode Selection */}
        <Text style={styles.fieldLbl}>PAYMENT MODE</Text>
        <View style={styles.payModeRow}>
          <View style={styles.payModeLeft}>
            <Text style={styles.payModeIcon}>💳</Text>
            <Text style={styles.payModeVal}> {paymentMode}</Text>
          </View>
          <TouchableOpacity
            style={styles.changeBtn}
            onPress={() => setShowPaymentPicker(!showPaymentPicker)}
            activeOpacity={0.7}
          >
            <Text style={styles.changeBtnTxt}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Dropdown Options for Payment Mode */}
        {showPaymentPicker && (
          <View style={styles.pickerBox}>
            {paymentModes.map(mode => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.pickerOpt,
                  paymentMode === mode && styles.pickerOptActive,
                ]}
                onPress={() => {
                  onPaymentModeChange(mode);
                  setShowPaymentPicker(false);
                }}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.pickerOptTxt,
                    paymentMode === mode && styles.pickerOptTxtActive,
                  ]}
                >
                  {mode === 'Cash' ? '💵 Cash' : mode === 'Card' ? '💳 Card' : mode === 'UPI' ? '📱 UPI' : '🌐 Online'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Clinical Notes Input */}
        <Text style={[styles.fieldLbl, { marginTop: 14 }]}>NOTES</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Add any special instructions..."
          placeholderTextColor="#D1D5DB"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={onNotesChange}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  payModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 4,
  },
  payModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payModeIcon: {
    fontSize: 14,
  },
  payModeVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00897B',
  },
  changeBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  pickerBox: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    marginVertical: 6,
    overflow: 'hidden',
  },
  pickerOpt: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerOptActive: {
    backgroundColor: '#F0FDF9',
  },
  pickerOptTxt: {
    fontSize: 13,
    color: '#374151',
  },
  pickerOptTxtActive: {
    color: '#00897B',
    fontWeight: '700',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#FAFAFA',
  },
});

export default InvoiceBillingConfig;
