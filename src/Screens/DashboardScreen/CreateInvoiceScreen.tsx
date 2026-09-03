import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InvoiceHeaderCard from '../../components/Modules/Invoice/InvoiceHeaderCard';
import SendIcon from '../../components/ui/icons/SendIcon';
import TrashIcon from '../../components/ui/icons/TrashIcon';
import { useInvoiceSettings } from '../../hooks/react-query/invoices/invoices.hooks';
import { useMyPatientInfo } from '../../hooks/react-query/patients/patients.hooks';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { showErrorToast } from '../../lib/common/toast.utils';
import {
  createInvoiceSchema,
  TCreateInvoiceSchemaType,
} from '../../lib/schemas/createInvoice.schema';
import type { CreateInvoiceScreenProps } from '../../route';
import { createInvoiceStyles as S } from '../../styled/CreateInvoiceScreen.styled';
import { TPaymentMode } from '../../typescripts/types/common.types';
import { Invoice, InvoiceLineItem, PaymentMode } from '../../typescripts/types/invoice.types';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

const fmt = (n: number) => `₹ ${n.toFixed(2)}`;

const computeItemTotal = (item: any): number => {
  const qty = parseFloat(item?.qty) || 0;
  const price = parseFloat(item?.price) || 0;
  const disc = parseFloat(item?.discount) || 0;
  const base = qty * price;
  const discAmt = item?.discount_type === 'flat' ? disc : (base * disc) / 100;
  return parseFloat(Math.max(base - discAmt, 0).toFixed(2));
};

export const CreateInvoiceScreen: React.FC<CreateInvoiceScreenProps> = ({ route, navigation }) => {
  const patientId = String(route?.params?.patientId || '');
  const patientGeneratedId = String(route?.params?.patientGeneratedId || '');

  const [invoiceNumber] = useState(`INV-2026-00${Math.floor(10 + Math.random() * 89)}`);
  const [createdDate] = useState('12 Aug 2026');
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  const { userData } = useAuthStore(state => state);
  const { data: patientInfo } = useMyPatientInfo({
    patientId: patientId,
  });

  const patientName = patientInfo?.name || 'Patient';

  const { data: invoiceSettingsData } = useInvoiceSettings({
    doctorId: userData?.user_id,
  });

  const paymentModes: TPaymentMode[] = ['Cash', 'Card', 'UPI', 'Online', 'Bank Transfer'];

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TCreateInvoiceSchemaType>({
    resolver: yupResolver(createInvoiceSchema) as any,
    defaultValues: {
      items: [
        {
          id: '1',
          name: 'Consultation / Medicine',
          qty: '1',
          price: '0',
          discount: '0',
          discount_type: '%',
          tax_percent: '0',
        },
      ],
      gstMode: 'none',
      paymentMode: 'Cash',
      paymentStatus: 'Unpaid',
      notes: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const watchedItems = useWatch({ control, name: 'items' }) || [];
  const watchedGstMode = watch('gstMode') || 'none';
  const watchedPaymentMode = watch('paymentMode') || 'Cash';
  const watchedPaymentStatus = watch('paymentStatus') || 'Unpaid';

  // Computed totals memoized
  const { subtotal, totalDiscount, taxableAmount, cgst, sgst, igst, grandTotal } = useMemo(() => {
    let sub = 0;
    let disc = 0;

    (watchedItems || []).forEach(i => {
      const q = parseFloat(i?.qty || '0') || 0;
      const p = parseFloat(i?.price || '0') || 0;
      const d = parseFloat(i?.discount || '0') || 0;
      const base = q * p;
      const dAmt = i?.discount_type === 'flat' ? d : (base * d) / 100;
      sub += base;
      disc += dAmt;
    });

    const taxable = Math.max(sub - disc, 0);
    const gstRate = watchedGstMode === 'none' ? 0 : 18;
    const totalTax =
      watchedGstMode === 'none' ? 0 : parseFloat(((taxable * gstRate) / 100).toFixed(2));
    const c = watchedGstMode === 'intra' ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const s = watchedGstMode === 'intra' ? parseFloat((totalTax / 2).toFixed(2)) : 0;
    const i = watchedGstMode === 'inter' ? totalTax : 0;
    const grand = parseFloat((taxable + totalTax).toFixed(2));

    return {
      subtotal: sub,
      totalDiscount: disc,
      taxableAmount: taxable,
      cgst: c,
      sgst: s,
      igst: i,
      grandTotal: grand,
    };
  }, [watchedItems, watchedGstMode]);

  const handleAddItem = () => {
    append({
      id: String(Date.now()),
      name: '',
      qty: '1',
      price: '0',
      discount: '0',
      discount_type: '%',
      tax_percent: '0',
    });
  };

  const handleDeleteItem = (index: number) => {
    if (fields.length <= 1) {
      Alert.alert('Required', 'Invoice must have at least one item');
      return;
    }
    remove(index);
  };

  const handleNavigateInvoiceSettings = () => {
    if (navigation?.navigate) {
      navigation.navigate('InvoiceSettings');
    }
  };

  const onSubmit = (data: TCreateInvoiceSchemaType) => {
    if (!invoiceSettingsData?.clinic_name.trim()) {
      showErrorToast(
        'Please configure your clinic information in Invoice Settings before generating invoices'
      );
      handleNavigateInvoiceSettings();
      return;
    }

    const itemsWithTotals: InvoiceLineItem[] = (data.items || []).map((item, idx) => ({
      id: item.id || String(idx + 1),
      name: item.name,
      qty: item.qty,
      price: item.price,
      discount: item.discount || '0',
      discount_type: (item.discount_type as '%' | 'flat') || '%',
      tax_percent: '0',
      total: computeItemTotal(item),
    }));

    const newInvoice: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber,
      patientId: String(patientId),
      patientName,
      createdDate,
      appointmentDate: createdDate,
      items: itemsWithTotals,
      subtotal,
      totalDiscount,
      cgst,
      sgst,
      igst,
      grandTotal,
      paymentMode: data.paymentMode as PaymentMode,
      status: (data.paymentStatus || 'Unpaid') as any,
      notes: data.notes || '',
      clinicName: userData?.clinic_name,
      clinicAddress: invoiceSettingsData?.clinic_address,
    };
  };

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={S.header}>
          <TouchableOpacity
            style={S.backBtn}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Text style={S.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={S.headerTitle}>Create Invoice</Text>
        </View>

        <ScrollView
          style={S.scroll}
          contentContainerStyle={S.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <InvoiceHeaderCard
            patientName={patientName}
            patientGenId={patientGeneratedId}
            invoiceNumber={invoiceNumber}
            invoiceDate={createdDate}
            clinicName={invoiceSettingsData?.clinic_name || ''}
            clinicAddress={invoiceSettingsData?.clinic_address || ''}
            onEditClinicPress={handleNavigateInvoiceSettings}
          />

          {/* Line Items Section */}
          <View style={S.sectionContainer}>
            <View style={S.sectionRow}>
              <Text style={S.sectionTitle}>🧾 Invoice Items</Text>
              <TouchableOpacity onPress={handleAddItem} style={S.addBtn} activeOpacity={0.7}>
                <Text style={S.addBtnTxt}>+ Add Item</Text>
              </TouchableOpacity>
            </View>

            <View style={S.sectionCard}>
              {fields.map((fieldItem, idx) => {
                const itemError = errors.items?.[idx];
                const currentItem = watchedItems[idx] || fieldItem;
                const itemTotal = computeItemTotal(currentItem);

                return (
                  <View
                    key={fieldItem.id}
                    style={[
                      S.itemBlock,
                      idx === 0 && { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
                    ]}
                  >
                    {/* Item Name / Description */}
                    <Text style={S.fieldLbl}>DESCRIPTION</Text>
                    <Controller
                      control={control}
                      name={`items.${idx}.name`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[S.descInput, itemError?.name && S.descInputError]}
                          placeholder="Consultation / Medicine / Test"
                          placeholderTextColor="#D1D5DB"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {itemError?.name && <Text style={S.errorText}>{itemError.name.message}</Text>}

                    {/* QTY | RATE | TOTAL */}
                    <View style={S.threeCol}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={S.fieldLbl}>QTY</Text>
                        <Controller
                          control={control}
                          name={`items.${idx}.qty`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={S.smallInput}
                              keyboardType="numeric"
                              value={value}
                              onChangeText={onChange}
                              placeholderTextColor="#D1D5DB"
                              placeholder="1"
                            />
                          )}
                        />
                        {itemError?.qty && <Text style={S.errorText}>{itemError.qty.message}</Text>}
                      </View>

                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={S.fieldLbl}>RATE</Text>
                        <Controller
                          control={control}
                          name={`items.${idx}.price`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={S.smallInput}
                              keyboardType="numeric"
                              value={value}
                              onChangeText={onChange}
                              placeholderTextColor="#D1D5DB"
                              placeholder="0"
                            />
                          )}
                        />
                        {itemError?.price && (
                          <Text style={S.errorText}>{itemError.price.message}</Text>
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={S.fieldLbl}>TOTAL</Text>
                        <View style={[S.smallInput, S.smallInputReadOnly]}>
                          <Text style={S.smallInputTxt}>{fmt(itemTotal)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* DISCOUNT (FULL WIDTH) | DELETE */}
                    <View style={S.threeCol}>
                      <View style={{ flex: 1, marginRight: fields.length > 1 ? 8 : 0 }}>
                        <Text style={S.fieldLbl}>DISCOUNT</Text>
                        <View style={S.discountRow}>
                          <Controller
                            control={control}
                            name={`items.${idx}.discount`}
                            render={({ field: { onChange, value } }) => (
                              <TextInput
                                style={[
                                  S.smallInput,
                                  {
                                    flex: 1,
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderRightWidth: 0,
                                  },
                                ]}
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                                placeholderTextColor="#D1D5DB"
                                placeholder="0"
                              />
                            )}
                          />
                          <TouchableOpacity
                            style={S.discTypeBtn}
                            onPress={() => {
                              const currentType = currentItem.discount_type || '%';
                              const nextType = currentType === '%' ? 'flat' : '%';
                              setValue(`items.${idx}.discount_type`, nextType, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            activeOpacity={0.7}
                          >
                            <Text style={S.discTypeTxt}>
                              {currentItem.discount_type === 'flat' ? '₹' : '%'} ▾
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {fields.length > 1 ? (
                        <TouchableOpacity
                          style={S.deleteIconBtn}
                          onPress={() => handleDeleteItem(idx)}
                          activeOpacity={0.7}
                        >
                          <TrashIcon color="#EF4444" size={18} />
                        </TouchableOpacity>
                      ) : (
                        <View style={{ width: 36 }} />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Payment & Billing Config Section */}
          <View style={S.sectionContainer}>
            <View style={{ marginBottom: 8 }}>
              <Text style={S.sectionTitle}>💳 Payment & Notes</Text>
            </View>

            <View style={S.sectionCard}>
              {/* Payment Mode Selection */}
              <Text style={S.fieldLbl}>PAYMENT MODE</Text>
              <View style={S.payModeRow}>
                <View style={S.payModeLeft}>
                  <Text style={S.payModeIcon}>💳</Text>
                  <Text style={S.payModeVal}> {watchedPaymentMode}</Text>
                </View>
                <TouchableOpacity
                  style={S.changeBtn}
                  onPress={() => setShowPaymentPicker(!showPaymentPicker)}
                  activeOpacity={0.7}
                >
                  <Text style={S.changeBtnTxt}>Change</Text>
                </TouchableOpacity>
              </View>
              {showPaymentPicker && (
                <View style={S.pickerBox}>
                  {paymentModes.map(mode => (
                    <TouchableOpacity
                      key={mode}
                      style={[S.pickerOpt, watchedPaymentMode === mode && S.pickerOptActive]}
                      onPress={() => {
                        setValue('paymentMode', mode);
                        setShowPaymentPicker(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          S.pickerOptTxt,
                          watchedPaymentMode === mode && S.pickerOptTxtActive,
                        ]}
                      >
                        {mode === 'Cash'
                          ? '💵 Cash'
                          : mode === 'Card'
                          ? '💳 Card'
                          : mode === 'UPI'
                          ? '📱 UPI'
                          : mode === 'Online'
                          ? '🌐 Online'
                          : '🏦 Bank Transfer'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Payment Status Selection */}
              <Text style={[S.fieldLbl, { marginTop: 14 }]}>PAYMENT STATUS</Text>
              <View style={S.statusChipRow}>
                <TouchableOpacity
                  style={[S.statusChip, watchedPaymentStatus === 'Paid' && S.statusChipActivePaid]}
                  onPress={() =>
                    setValue('paymentStatus', 'Paid', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      S.statusChipTxt,
                      watchedPaymentStatus === 'Paid' && S.statusChipTxtActivePaid,
                    ]}
                  >
                    ✓ Paid
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    S.statusChip,
                    watchedPaymentStatus === 'Unpaid' && S.statusChipActiveUnpaid,
                  ]}
                  onPress={() =>
                    setValue('paymentStatus', 'Unpaid', {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      S.statusChipTxt,
                      watchedPaymentStatus === 'Unpaid' && S.statusChipTxtActiveUnpaid,
                    ]}
                  >
                    ⏳ Unpaid
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[S.fieldLbl, { marginTop: 14 }]}>NOTES</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={S.notesInput}
                    placeholder="Add any special instructions..."
                    placeholderTextColor="#D1D5DB"
                    multiline
                    numberOfLines={3}
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View style={S.totalsCard}>
            <View style={S.totalRow}>
              <Text style={S.totalLbl}>Subtotal</Text>
              <Text style={S.totalVal}>{fmt(subtotal)}</Text>
            </View>

            {totalDiscount > 0 && (
              <View style={S.totalRow}>
                <Text style={S.totalLbl}>Discount</Text>
                <Text style={[S.totalVal, S.totalValDiscount]}>- {fmt(totalDiscount)}</Text>
              </View>
            )}

            {totalDiscount > 0 && (
              <View style={S.totalRow}>
                <Text style={S.totalLbl}>Taxable Amount</Text>
                <Text style={S.totalVal}>{fmt(taxableAmount)}</Text>
              </View>
            )}

            {watchedGstMode === 'intra' && (
              <>
                <View style={S.totalRow}>
                  <Text style={S.totalLbl}>CGST (9%)</Text>
                  <Text style={S.totalVal}>{fmt(cgst)}</Text>
                </View>
                <View style={S.totalRow}>
                  <Text style={S.totalLbl}>SGST (9%)</Text>
                  <Text style={S.totalVal}>{fmt(sgst)}</Text>
                </View>
              </>
            )}

            {watchedGstMode === 'inter' && (
              <View style={S.totalRow}>
                <Text style={S.totalLbl}>IGST (18%)</Text>
                <Text style={S.totalVal}>{fmt(igst)}</Text>
              </View>
            )}

            <View style={S.divider} />
            <Text style={S.grandLbl}>GRAND TOTAL</Text>
            <Text style={S.grandVal}>{fmt(grandTotal)}</Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={S.footer}>
          <View style={S.footerSummary}>
            <Text style={S.footerLabel}>GRAND TOTAL</Text>
            <Text style={S.footerAmount}>₹{grandTotal.toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity
            style={S.submitBtn}
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.85}
          >
            <SendIcon color="#FFFFFF" size={18} />
            <Text style={S.submitBtnTxt}>Generate & Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CreateInvoiceScreen;
