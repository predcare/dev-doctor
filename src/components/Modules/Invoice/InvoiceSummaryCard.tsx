import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GstMode } from '../../../typescripts/types/invoice.types';

interface InvoiceSummaryCardProps {
  subtotal: number;
  totalDiscount: number;
  taxableAmount: number;
  gstMode: GstMode;
  cgst: number;
  sgst: number;
  igst: number;
  grandTotal: number;
}

const fmt = (n: number) => `₹ ${n.toFixed(2)}`;

export const InvoiceSummaryCard: React.FC<InvoiceSummaryCardProps> = ({
  subtotal,
  totalDiscount,
  taxableAmount,
  gstMode,
  cgst,
  sgst,
  igst,
  grandTotal,
}) => {
  return (
    <View style={styles.totalsCard}>
      {/* Subtotal */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLbl}>Subtotal</Text>
        <Text style={styles.totalVal}>{fmt(subtotal)}</Text>
      </View>

      {/* Discount */}
      {totalDiscount > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLbl}>Discount</Text>
          <Text style={[styles.totalVal, { color: '#EF4444' }]}>- {fmt(totalDiscount)}</Text>
        </View>
      )}

      {/* Taxable Amount */}
      {totalDiscount > 0 && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLbl}>Taxable Amount</Text>
          <Text style={styles.totalVal}>{fmt(taxableAmount)}</Text>
        </View>
      )}

      {/* GST Taxes */}
      {gstMode === 'intra' && (
        <>
          <View style={styles.totalRow}>
            <Text style={styles.totalLbl}>CGST (9%)</Text>
            <Text style={styles.totalVal}>{fmt(cgst)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLbl}>SGST (9%)</Text>
            <Text style={styles.totalVal}>{fmt(sgst)}</Text>
          </View>
        </>
      )}

      {gstMode === 'inter' && (
        <View style={styles.totalRow}>
          <Text style={styles.totalLbl}>IGST (18%)</Text>
          <Text style={styles.totalVal}>{fmt(igst)}</Text>
        </View>
      )}

      <View style={styles.divider} />
      <Text style={styles.grandLbl}>GRAND TOTAL</Text>
      <Text style={styles.grandVal}>{fmt(grandTotal)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  totalsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLbl: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  totalVal: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  grandLbl: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00897B',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  grandVal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#00897B',
  },
});

export default InvoiceSummaryCard;
