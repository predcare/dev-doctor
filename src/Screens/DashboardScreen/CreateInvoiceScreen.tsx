import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import InvoiceBillingConfig from '../../components/Modules/Invoice/InvoiceBillingConfig';
import InvoiceHeaderCard from '../../components/Modules/Invoice/InvoiceHeaderCard';
import InvoiceLineItemEditor from '../../components/Modules/Invoice/InvoiceLineItemEditor';
import InvoicePreviewModal from '../../components/Modules/Invoice/InvoicePreviewModal';
import InvoiceSummaryCard from '../../components/Modules/Invoice/InvoiceSummaryCard';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { CreateInvoiceScreenProps } from '../../route';
import { theme } from '../../styled/theme.styled';
import {
  GstMode,
  Invoice,
  InvoiceLineItem,
  PaymentMode,
} from '../../typescripts/types/invoice.types';

const computeItemTotal = (item: InvoiceLineItem): number => {
  const qty = parseFloat(item.qty) || 0;
  const price = parseFloat(item.price) || 0;
  const disc = parseFloat(item.discount) || 0;
  const base = qty * price;
  const discAmt = item.discount_type === 'flat' ? disc : (base * disc) / 100;
  return parseFloat(Math.max(base - discAmt, 0).toFixed(2));
};

export const CreateInvoiceScreen: React.FC<CreateInvoiceScreenProps> = ({
  route,
  navigation,
}) => {
  const patientId = route?.params?.patientId || 'PF-001092';
  const patientName = route?.params?.patientName || 'Eleanor Vance';
  const initialFee = route?.params?.fee || 800;

  const [invoiceNumber] = useState(
    `INV-2026-00${Math.floor(10 + Math.random() * 89)}`,
  );
  const [createdDate] = useState('12 Aug 2026');

  // Items
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: '1',
      name: 'Consultation / Medicine',
      qty: '1',
      price: String(initialFee),
      discount: '0',
      discount_type: '%',
      tax_percent: '18',
      total: computeItemTotal({
        id: '1',
        name: 'Consultation / Medicine',
        qty: '1',
        price: String(initialFee),
        discount: '0',
        discount_type: '%',
        tax_percent: '18',
        total: 0,
      }),
    },
  ]);

  // Billing options
  const [gstMode, setGstMode] = useState<GstMode>('intra');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Cash');
  const [notes, setNotes] = useState('');

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generatedInvoiceObj, setGeneratedInvoiceObj] =
    useState<Invoice | null>(null);

  // Computed totals
  const subtotal = items.reduce(
    (sum, i) => sum + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0),
    0,
  );

  const totalDiscount = items.reduce((sum, i) => {
    const base = (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0);
    const d = parseFloat(i.discount) || 0;
    return sum + (i.discount_type === 'flat' ? d : (base * d) / 100);
  }, 0);

  const taxableAmount = subtotal - totalDiscount;
  const gstRate = gstMode === 'none' ? 0 : 18;
  const totalTax =
    gstMode === 'none'
      ? 0
      : parseFloat(((taxableAmount * gstRate) / 100).toFixed(2));
  const cgst = gstMode === 'intra' ? parseFloat((totalTax / 2).toFixed(2)) : 0;
  const sgst = gstMode === 'intra' ? parseFloat((totalTax / 2).toFixed(2)) : 0;
  const igst = gstMode === 'inter' ? totalTax : 0;
  const grandTotal = parseFloat((taxableAmount + totalTax).toFixed(2));

  // Handlers
  const handleUpdateItem = (
    id: string,
    field: keyof InvoiceLineItem,
    value: any,
  ) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        updated.total = computeItemTotal(updated);
        return updated;
      }),
    );
  };

  const handleDeleteItem = (id: string) => {
    if (items.length <= 1) {
      Alert.alert('Required', 'Invoice must have at least one item');
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddItem = () => {
    const nextId = String(Date.now());
    setItems(prev => [
      ...prev,
      {
        id: nextId,
        name: '',
        qty: '1',
        price: '0',
        discount: '0',
        discount_type: '%',
        tax_percent: '18',
        total: 0,
      },
    ]);
  };

  const handleNavigateInvoiceSettings = () => {
    if (navigation?.navigate) {
      navigation.navigate('InvoiceSettings');
    }
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      Alert.alert('Required', 'Add at least one item');
      return;
    }
    if (items.some(i => !i.name.trim())) {
      Alert.alert('Validation Error', 'Please enter description for all items');
      return;
    }

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      patientId,
      patientName,
      createdDate,
      appointmentDate: createdDate,
      items,
      subtotal,
      totalDiscount,
      cgst,
      sgst,
      igst,
      grandTotal,
      paymentMode,
      status: 'Paid',
      notes,
      clinicName: 'Pred Care Multispecialty Clinic',
      clinicAddress: '7th Block, Koramangala, Bengaluru, KA',
    };

    setGeneratedInvoiceObj(newInvoice);
    setShowPreviewModal(true);
  };

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Invoice</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Patient Details & Clinic Card with Edit Button */}
          <InvoiceHeaderCard
            patientName={patientName}
            patientId={patientId}
            invoiceNumber={invoiceNumber}
            invoiceDate={createdDate}
            onEditClinicPress={handleNavigateInvoiceSettings}
          />

          {/* Invoice Items */}
          <InvoiceLineItemEditor
            items={items}
            gstMode={gstMode}
            onUpdateItem={handleUpdateItem}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
          />

          {/* Payment Mode & Notes */}
          <InvoiceBillingConfig
            paymentMode={paymentMode}
            onPaymentModeChange={setPaymentMode}
            notes={notes}
            onNotesChange={setNotes}
          />

          {/* Totals */}
          <InvoiceSummaryCard
            subtotal={subtotal}
            totalDiscount={totalDiscount}
            taxableAmount={taxableAmount}
            gstMode={gstMode}
            cgst={cgst}
            sgst={sgst}
            igst={igst}
            grandTotal={grandTotal}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Generate & Send Invoice Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnTxt}>✈️ Generate & Send Invoice</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Modal */}
      {showPreviewModal && generatedInvoiceObj && (
        <InvoicePreviewModal
          visible={showPreviewModal}
          invoice={generatedInvoiceObj}
          onClose={() => {
            setShowPreviewModal(false);
            navigation?.goBack();
          }}
        />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 14,
    paddingBottom: 20,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  submitBtn: {
    backgroundColor: '#00897B',
    borderRadius: 12,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnTxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default CreateInvoiceScreen;
