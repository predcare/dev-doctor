import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import { useMPatientsInvoices } from '../../../../hooks/react-query/invoices/invoices.hooks';
import { AppRoute } from '../../../../route';
import { patientInvoiceTabStyles as styles } from '../../../../styled/PatientInvoiceTabPanel.styled';
import { theme } from '../../../../styled/theme.styled';
import { IInvoiceDoc } from '../../../../typescripts/interfaces/invoices.interfaces';
import { useAuthStore } from '../../../../zustand/stores/useAuthStore';
import CommonEmptyCard from '../../../commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../commons/CommonErrorCard/CommonErrorCard';
import InvoiceSkeleton from '../../../Skeletons/InvoiceSkeleton';
import InvoicePreviewModal from '../../Invoice/InvoicePreviewModal';
import PatientInvoiceCard from './PatientInvoiceCard';

interface InvoiceTabProps {
  patientId: string | number;
  patientGeneratedId?: string;
}

export const PatientInvoiceTabPanel: React.FC<InvoiceTabProps> = ({
  patientId,
  patientGeneratedId,
}) => {
  const navigation = useNavigation();
  const { userData } = useAuthStore(state => state);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInvoiceForPreview, setSelectedInvoiceForPreview] = useState<IInvoiceDoc | null>(
    null
  );

  const {
    data: myInvoices,
    isPending: isMyInvoicesPending,
    isError: isMyInvoiceError,
    error: myInvoiceError,
    refetch: refetchMyInvoices,
  } = useMPatientsInvoices({
    doctorId: userData?.user_id,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchMyInvoices();
    setRefreshing(false);
  }, [refetchMyInvoices]);

  const handleCreateNewInvoice = useCallback(() => {
    if (navigation?.navigate) {
      navigation.navigate(AppRoute.CREATE_INVOICE, {
        patientId: patientId,
        patientGeneratedId: patientGeneratedId || '',
      });
    }
  }, [navigation, patientId]);

  const filterInvoicesList = useMemo<IInvoiceDoc[]>(() => {
    if (patientId) {
      const filterData = myInvoices?.filter(
        vItem => String(vItem?.patient_id) === String(patientId)
      );
      return filterData || [];
    }
    return myInvoices || [];
  }, [patientId, myInvoices]);

  return (
    <View style={{ flex: 1 }}>
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

      {isMyInvoicesPending ? (
        <InvoiceSkeleton />
      ) : isMyInvoiceError ? (
        <CommonErrorCard
          title="Failed to Load Invoices"
          message={
            (myInvoiceError as any)?.message ||
            'Something went wrong while fetching patient invoices.'
          }
          onRetry={refetchMyInvoices}
        />
      ) : (
        <FlatList
          data={filterInvoicesList}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PatientInvoiceCard
              invoiceNumber={item.invoice_number}
              grandTotal={item.grand_total}
              createdAt={item.created_at}
              paymentStatus={item.payment_status}
              paymentMode={item.payment_mode}
              onPress={() => setSelectedInvoiceForPreview(item)}
            />
          )}
          ListEmptyComponent={
            <CommonEmptyCard
              title="No Invoices Yet"
              message="No invoices have been created for this patient yet."
              actionText="+ New Invoice"
              onAction={handleCreateNewInvoice}
            />
          }
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        />
      )}

      {selectedInvoiceForPreview && (
        <InvoicePreviewModal
          visible={!!selectedInvoiceForPreview}
          invoice={selectedInvoiceForPreview}
          patientGeneratedId={patientGeneratedId}
          onClose={() => setSelectedInvoiceForPreview(null)}
        />
      )}
    </View>
  );
};

export default PatientInvoiceTabPanel;
