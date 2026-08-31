import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { theme } from '../../../styled/theme.styled';
import { Invoice } from '../../../typescripts/types/invoice.types';

interface InvoiceCardProps {
  invoice: Invoice;
  onPressView?: (invoice: Invoice) => void;
  onPressDownload?: (invoice: Invoice) => void;
  onPressShare?: (invoice: Invoice) => void;
}

export const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onPressView,
  onPressDownload,
  onPressShare,
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Paid':
        return { bg: theme.colors.successSoft, text: theme.colors.success, label: 'PAID' };
      case 'Pending':
        return { bg: theme.colors.warningSoft, text: theme.colors.warning, label: 'PENDING' };
      case 'Overdue':
        return { bg: theme.colors.dangerSoft, text: theme.colors.danger, label: 'OVERDUE' };
      default:
        return { bg: theme.colors.background, text: theme.colors.textMuted, label: status.toUpperCase() };
    }
  };

  const statusStyle = getStatusBadgeStyle(invoice.status);

  const handleDefaultView = () => {
    if (onPressView) {
      onPressView(invoice);
    } else {
      Alert.alert('View Invoice', `Opening PDF preview for ${invoice.invoiceNumber}...`);
    }
  };

  const handleDefaultDownload = () => {
    if (onPressDownload) {
      onPressDownload(invoice);
    } else {
      Toast.show({
        type: 'success',
        text1: 'PDF Saved!',
        text2: `${invoice.invoiceNumber}.pdf downloaded to device.`,
        position: 'bottom',
      });
    }
  };

  const handleDefaultShare = () => {
    if (onPressShare) {
      onPressShare(invoice);
    } else {
      Toast.show({
        type: 'info',
        text1: 'Receipt Sent',
        text2: `Receipt shared to ${invoice.patientName}`,
        position: 'bottom',
      });
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Row: Invoice Number + Status Badge */}
      <View style={styles.headerRow}>
        <View style={styles.invNumberContainer}>
          <Text style={styles.invIcon}>📄</Text>
          <Text style={styles.invNumber}>{invoice.invoiceNumber}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>
            {statusStyle.label}
          </Text>
        </View>
      </View>

      {/* Main Info */}
      <View style={styles.infoSection}>
        <Text style={styles.patientName}>{invoice.patientName}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📅 {invoice.createdDate}</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.metaText}>💳 {invoice.paymentMode}</Text>
          <View style={styles.dotSeparator} />
          <Text style={styles.metaText}>{invoice.items.length} item(s)</Text>
        </View>
      </View>

      {/* Amount & Items Breakdown */}
      <View style={styles.amountBox}>
        <Text style={styles.amountLabel}>Total Billed Amount</Text>
        <Text style={styles.amountValue}>
          ₹{invoice.grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      {/* Actions Row */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={handleDefaultView}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnSecondaryText}>👁️ View PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnSecondary}
          onPress={handleDefaultDownload}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnSecondaryText}>📥 Save</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={handleDefaultShare}
          activeOpacity={0.7}
        >
          <Text style={styles.actionBtnPrimaryText}>📲 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.bg,
  },
  invNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  invIcon: {
    fontSize: 14,
  },
  invNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  infoSection: {
    paddingVertical: 10,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dark,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dotSeparator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: theme.colors.textMuted,
  },
  amountBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primaryDark,
  },
  amountValue: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  actionBtnSecondary: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  actionBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 7,
    alignItems: 'center',
  },
  actionBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.surface,
  },
});

export default InvoiceCard;
