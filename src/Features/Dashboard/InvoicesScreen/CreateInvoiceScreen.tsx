import { yupResolver } from '@hookform/resolvers/yup';
import React, { useMemo } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { queryClient } from '../../../components/providers/ReactQueryProvider';
import { TrashIcon } from '../../../components/ui/icons';
import SendIcon from '../../../components/ui/icons/SendIcon';
import {
  useCreateInvoices,
  useInvoiceSettings,
} from '../../../hooks/react-query/invoices/invoices.hooks';
import {
  ICreateManualInvoicePayload,
  ICreateManualItem,
} from '../../../hooks/react-query/invoices/payload.interfaces';
import { useMyPatientInfo } from '../../../hooks/react-query/patients/patients.hooks';
import { MyInvoices } from '../../../hooks/react-query/query.keys';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { formatAddress } from '../../../lib/commons/common.utils';
import { showErrorToast, showSuccessToast } from '../../../lib/commons/toast.utils';
import {
  createInvoiceSchema,
  TCreateInvoiceSchemaType,
} from '../../../lib/schemas/createInvoice.schema';
import { CreateInvoiceScreenProps } from '../../../route';
import createInvoiceStyles from '../../../styled/CreateInvoiceScreen.styled';
import theme from '../../../styled/theme.styled';
import { useAuthStore } from '../../../zustand/stores/useAuthStore';
import { useLoadingStore } from '../../../zustand/stores/useLoadingStore';
import InvoiceHeaderCard from './Cards/InvoiceHeaderCard';

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
  const appointmentId = String(route?.params?.appointmentId || '');

  const { userData } = useAuthStore(state => state);
  const { showLoader, hideLoader } = useLoadingStore(state => state);

  const { data: patientInfo, isPending: isLoadingPatient } = useMyPatientInfo({
    patientId: patientId,
  });
  const { data: invoiceSettings, isPending: isLoadingSettings } = useInvoiceSettings();

  const rawGstType = String(invoiceSettings?.gst_type || 'none').toLowerCase().trim();
  const isGstEnabled = !rawGstType.includes('none') && rawGstType !== '';
  const gstMode: 'none' | 'intra' | 'inter' = isGstEnabled
    ? rawGstType.includes('inter')
      ? 'inter'
      : 'intra'
    : 'none';

  const patientName = patientInfo?.name || 'Patient';

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TCreateInvoiceSchemaType>({
    resolver: yupResolver(createInvoiceSchema),
    defaultValues: {
      items: [
        {
          id: '1',
          name: '',
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
  const watchedPaymentStatus = useWatch({ control, name: 'paymentStatus' }) || 'Unpaid';

  const { mutate: createInvoices, isPending: loadingCreateInvoices } = useCreateInvoices();


  // Computed totals memoized
  const { subtotal, totalDiscount, taxableAmount, cgst, sgst, igst, grandTotal } = useMemo(() => {
    let sub = 0;
    let disc = 0;
    let totalTax = 0;

    (watchedItems || []).forEach(i => {
      const q = parseFloat(i?.qty || '0') || 0;
      const p = parseFloat(i?.price || '0') || 0;
      const d = parseFloat(i?.discount || '0') || 0;
      const base = q * p;
      const dAmt = i?.discount_type === 'flat' ? d : (base * d) / 100;
      const itemTaxable = Math.max(base - dAmt, 0);
      const taxRate = isGstEnabled ? parseFloat(i?.tax_percent || '0') || 0 : 0;
      const itemTax = (itemTaxable * taxRate) / 100;

      sub += base;
      disc += dAmt;
      totalTax += itemTax;
    });

    const taxable = Math.max(sub - disc, 0);
    const roundedTax = parseFloat(totalTax.toFixed(2));
    const isIntra = isGstEnabled && gstMode === 'intra';
    const isInter = isGstEnabled && gstMode === 'inter';

    const c = isIntra ? parseFloat((roundedTax / 2).toFixed(2)) : 0;
    const s = isIntra ? parseFloat((roundedTax / 2).toFixed(2)) : 0;
    const i = isInter ? roundedTax : 0;
    const grand = parseFloat((taxable + (isGstEnabled ? roundedTax : 0)).toFixed(2));

    return {
      subtotal: sub,
      totalDiscount: disc,
      taxableAmount: taxable,
      cgst: c,
      sgst: s,
      igst: i,
      grandTotal: grand,
    };
  }, [watchedItems, isGstEnabled, gstMode]);

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
    const clinicName =
      invoiceSettings?.clinic_name ||
      userData?.clinic_name ||
      userData?.clinic?.name ||
      '';
    if (!clinicName.trim()) {
      showErrorToast(
        'Please configure your clinic information in Invoice Settings before generating invoices'
      );
      handleNavigateInvoiceSettings();
      return;
    }

    const manualItems: ICreateManualItem[] = (data.items || []).map(item => {
      const q = parseFloat(item.qty || '1') || 1;
      const p = parseFloat(item.price || '0') || 0;
      const d = parseFloat(item.discount || '0') || 0;
      const base = q * p;
      const discPct = item.discount_type === 'flat' ? (base > 0 ? (d / base) * 100 : 0) : d;

      return {
        item_name: item.name,
        hsn_sac: '',
        qty: q,
        unit_price: p,
        discount_percent: parseFloat(discPct.toFixed(2)),
        tax_rate: isGstEnabled ? parseFloat(item.tax_percent || '0') || 0 : 0,
      };
    });

    const payload: ICreateManualInvoicePayload = {
      clinic_id: String(userData?.clinic?.id || userData?.clinic_id || ''),
      patient_id: patientId,
      patient_name: patientInfo?.name || patientName || '',
      patient_phone: patientInfo?.phone_number || '',
      patient_email: patientInfo?.email || '',
      patient_gender: patientInfo?.gender || '',
      patient_age: (patientInfo as any)?.age ? String((patientInfo as any).age) : undefined,
      appointment_id: appointmentId || undefined,
      payment_mode: 'Cash',
      payment_status: data?.paymentStatus || 'Unpaid',
      gst_type: gstMode,
      items: manualItems,
      notes: data?.notes || '',
      ...({
        subtotal,
        total_discount: totalDiscount,
        cgst,
        sgst,
        igst,
        grand_total: grandTotal,
        clinic_name: clinicName,
        clinic_address:
          invoiceSettings?.clinic_address || userData?.clinic_address || '',
        clinic_phone:
          invoiceSettings?.clinic_phone || userData?.clinic_phone || '',
        clinic_email:
          invoiceSettings?.clinic_email || userData?.clinic_email || '',
        clinic_gstin:
          invoiceSettings?.clinic_gstin || userData?.clinic_gstin || '',
      } as any),
    };
    showLoader('Creating invoice...');
    createInvoices(payload, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [MyInvoices.AllInvoices] });
        hideLoader();
        showSuccessToast('Invoice created successfully');
        navigation?.goBack();
      },
      onError: () => {
        hideLoader();
      },
    });
  };

  if (isLoadingPatient || isLoadingSettings) {
    return (
      <SafeAreaWrapper showBottomBar>
        <View style={createInvoiceStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={createInvoiceStyles.loadingText}>Loading invoice details...</Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper showBottomBar>
      <KeyboardAvoidingView style={createInvoiceStyles.keyboardView} behavior="padding">
        <View style={createInvoiceStyles.header}>
          <TouchableOpacity
            style={createInvoiceStyles.backBtn}
            onPress={() => navigation?.goBack()}
            activeOpacity={0.7}
          >
            <Text style={createInvoiceStyles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={createInvoiceStyles.headerTitle}>Create Invoice</Text>
        </View>

        <ScrollView
          style={createInvoiceStyles.scroll}
          contentContainerStyle={createInvoiceStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <InvoiceHeaderCard
            patientName={patientName}
            patientGenId={patientGeneratedId}
            clinicName={invoiceSettings?.clinic_name || userData?.clinic?.name || ''}
            clinicAddress={
              invoiceSettings?.clinic_address ||
              formatAddress({
                city: userData?.clinic?.city,
                country: userData?.clinic?.country,
                pincode: userData?.clinic?.pincode,
                state: userData?.clinic?.state,
              }) || ''
            }
            onEditClinicPress={handleNavigateInvoiceSettings}
          />

          {/* Line Items Section */}
          <View style={createInvoiceStyles.sectionContainer}>
            <View style={createInvoiceStyles.sectionRow}>
              <Text style={createInvoiceStyles.sectionTitle}>🧾 Invoice Items</Text>
              <TouchableOpacity
                onPress={handleAddItem}
                style={createInvoiceStyles.addBtn}
                activeOpacity={0.7}
              >
                <Text style={createInvoiceStyles.addBtnTxt}>+ Add Item</Text>
              </TouchableOpacity>
            </View>

            <View style={createInvoiceStyles.sectionCard}>
              {fields.map((fieldItem, idx) => {
                const itemError = errors.items?.[idx];
                const currentItem = watchedItems[idx] || fieldItem;
                const itemTotal = computeItemTotal(currentItem);

                return (
                  <View
                    key={fieldItem.id}
                    style={[
                      createInvoiceStyles.itemBlock,
                      idx === 0 && { borderTopWidth: 0, paddingTop: 0, marginTop: 0 },
                    ]}
                  >
                    {/* Item Name / Description */}
                    <Text style={createInvoiceStyles.fieldLbl}>DESCRIPTION</Text>
                    <Controller
                      control={control}
                      name={`items.${idx}.name`}
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          style={[
                            createInvoiceStyles.descInput,
                            itemError?.name && createInvoiceStyles.descInputError,
                          ]}
                          placeholder="Consultation / Medicine / Test"
                          placeholderTextColor="#D1D5DB"
                          value={value}
                          onChangeText={onChange}
                        />
                      )}
                    />
                    {itemError?.name && (
                      <Text style={createInvoiceStyles.errorText}>{itemError.name.message}</Text>
                    )}

                    {/* QTY | RATE | TOTAL */}
                    <View style={createInvoiceStyles.threeCol}>
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={createInvoiceStyles.fieldLbl}>QTY</Text>
                        <Controller
                          control={control}
                          name={`items.${idx}.qty`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={createInvoiceStyles.smallInput}
                              keyboardType="numeric"
                              value={value}
                              onChangeText={onChange}
                              placeholderTextColor="#D1D5DB"
                              placeholder="1"
                            />
                          )}
                        />
                        {itemError?.qty && (
                          <Text style={createInvoiceStyles.errorText}>{itemError.qty.message}</Text>
                        )}
                      </View>

                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={createInvoiceStyles.fieldLbl}>RATE</Text>
                        <Controller
                          control={control}
                          name={`items.${idx}.price`}
                          render={({ field: { onChange, value } }) => (
                            <TextInput
                              style={createInvoiceStyles.smallInput}
                              keyboardType="numeric"
                              value={value}
                              onChangeText={onChange}
                              placeholderTextColor="#D1D5DB"
                              placeholder="0"
                            />
                          )}
                        />
                        {itemError?.price && (
                          <Text style={createInvoiceStyles.errorText}>
                            {itemError.price.message}
                          </Text>
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={createInvoiceStyles.fieldLbl}>TOTAL</Text>
                        <View
                          style={[
                            createInvoiceStyles.smallInput,
                            createInvoiceStyles.smallInputReadOnly,
                          ]}
                        >
                          <Text style={createInvoiceStyles.smallInputTxt}>{fmt(itemTotal)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* DISCOUNT (FULL WIDTH) | DELETE */}
                    <View style={createInvoiceStyles.threeCol}>
                      <View style={{ flex: 1, marginRight: fields.length > 1 ? 8 : 0 }}>
                        <Text style={createInvoiceStyles.fieldLbl}>DISCOUNT</Text>
                        <View style={createInvoiceStyles.discountRow}>
                          <Controller
                            control={control}
                            name={`items.${idx}.discount`}
                            render={({ field: { onChange, value } }) => (
                              <TextInput
                                style={[
                                  createInvoiceStyles.smallInput,
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
                            style={createInvoiceStyles.discTypeBtn}
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
                            <Text style={createInvoiceStyles.discTypeTxt}>
                              {currentItem.discount_type === 'flat' ? '₹' : '%'} ▾
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {fields.length > 1 ? (
                        <TouchableOpacity
                          style={createInvoiceStyles.deleteIconBtn}
                          onPress={() => handleDeleteItem(idx)}
                          activeOpacity={0.7}
                        >
                          <TrashIcon color="#EF4444" size={18} />
                        </TouchableOpacity>
                      ) : (
                        <View style={{ width: 36 }} />
                      )}
                    </View>

                    {/* TAX (GST %) SELECTOR */}
                    {isGstEnabled && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={createInvoiceStyles.fieldLbl}>TAX (GST %)</Text>
                        <View style={createInvoiceStyles.taxChipRow}>
                          {(['0', '5', '18', '40'] as const).map(rate => {
                            const isSelected = (currentItem.tax_percent || '0') === rate;
                            return (
                              <TouchableOpacity
                                key={rate}
                                style={[
                                  createInvoiceStyles.taxChip,
                                  isSelected && createInvoiceStyles.taxChipActive,
                                ]}
                                onPress={() =>
                                  setValue(`items.${idx}.tax_percent`, rate, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  })
                                }
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    createInvoiceStyles.taxChipTxt,
                                    isSelected && createInvoiceStyles.taxChipTxtActive,
                                  ]}
                                >
                                  {rate}%
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>

          {/* Payment & Billing Config Section */}
          <View style={createInvoiceStyles.sectionContainer}>
            <View style={{ marginBottom: 8 }}>
              <Text style={createInvoiceStyles.sectionTitle}>💳 Payment & Notes</Text>
            </View>

            <View style={createInvoiceStyles.sectionCard}>
              <Text style={createInvoiceStyles.fieldLbl}>PAYMENT STATUS</Text>
              <View style={createInvoiceStyles.statusChipRow}>
                <TouchableOpacity
                  style={[
                    createInvoiceStyles.statusChip,
                    watchedPaymentStatus === 'Paid' && createInvoiceStyles.statusChipActivePaid,
                  ]}
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
                      createInvoiceStyles.statusChipTxt,
                      watchedPaymentStatus === 'Paid' &&
                      createInvoiceStyles.statusChipTxtActivePaid,
                    ]}
                  >
                    ✓ Paid
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    createInvoiceStyles.statusChip,
                    watchedPaymentStatus === 'Unpaid' && createInvoiceStyles.statusChipActiveUnpaid,
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
                      createInvoiceStyles.statusChipTxt,
                      watchedPaymentStatus === 'Unpaid' &&
                      createInvoiceStyles.statusChipTxtActiveUnpaid,
                    ]}
                  >
                    ⏳ Unpaid
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[createInvoiceStyles.fieldLbl, { marginTop: 14 }]}>NOTES</Text>
              <Controller
                control={control}
                name="notes"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={createInvoiceStyles.notesInput}
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

          <View style={createInvoiceStyles.totalsCard}>
            <View style={createInvoiceStyles.totalRow}>
              <Text style={createInvoiceStyles.totalLbl}>Subtotal</Text>
              <Text style={createInvoiceStyles.totalVal}>{fmt(subtotal)}</Text>
            </View>

            {totalDiscount > 0 && (
              <View style={createInvoiceStyles.totalRow}>
                <Text style={createInvoiceStyles.totalLbl}>Discount</Text>
                <Text style={[createInvoiceStyles.totalVal, createInvoiceStyles.totalValDiscount]}>
                  - {fmt(totalDiscount)}
                </Text>
              </View>
            )}

            {isGstEnabled && (
              <View style={createInvoiceStyles.totalRow}>
                <Text style={createInvoiceStyles.totalLbl}>Taxable Amount</Text>
                <Text style={createInvoiceStyles.totalVal}>{fmt(taxableAmount)}</Text>
              </View>
            )}

            {isGstEnabled && gstMode === 'intra' && (
              <>
                <View style={createInvoiceStyles.totalRow}>
                  <Text style={createInvoiceStyles.totalLbl}>CGST</Text>
                  <Text style={createInvoiceStyles.totalVal}>{fmt(cgst)}</Text>
                </View>
                <View style={createInvoiceStyles.totalRow}>
                  <Text style={createInvoiceStyles.totalLbl}>SGST</Text>
                  <Text style={createInvoiceStyles.totalVal}>{fmt(sgst)}</Text>
                </View>
              </>
            )}

            {isGstEnabled && gstMode === 'inter' && (
              <View style={createInvoiceStyles.totalRow}>
                <Text style={createInvoiceStyles.totalLbl}>IGST</Text>
                <Text style={createInvoiceStyles.totalVal}>{fmt(igst)}</Text>
              </View>
            )}

            <View style={createInvoiceStyles.divider} />
            <Text style={createInvoiceStyles.grandLbl}>GRAND TOTAL</Text>
            <Text style={createInvoiceStyles.grandVal}>{fmt(grandTotal)}</Text>
          </View>

          <TouchableOpacity
            style={[
              createInvoiceStyles.submitBtn,
              createInvoiceStyles.submitBtnSpacing,
              loadingCreateInvoices && { opacity: 0.7 },
            ]}
            onPress={() => handleSubmit(onSubmit)()}
            disabled={loadingCreateInvoices}
            activeOpacity={0.85}
          >
            {loadingCreateInvoices ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <SendIcon color="#FFFFFF" size={18} />
                <Text style={createInvoiceStyles.submitBtnTxt}>Generate & Send</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default CreateInvoiceScreen;
