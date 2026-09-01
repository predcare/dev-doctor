import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import PopupAlert from '../../components/commons/PopupAlert/PopupAlert';
import PatientCard, { PatientItem } from '../../components/Modules/Patients/PatientCard';
import { PlusIcon, SearchIcon } from '../../components/ui/icons';
import Header from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { PatientsScreenNavigationProp, PatientsScreenRouteProp } from '../../route';
import { patientsStyles as S } from '../../styled/PatientsScreen.styled';
import { theme } from '../../styled/theme.styled';

import useScreenFocus from '../../hooks/commons/useScreenFocus';

export interface PatientsScreenProps {
  navigation?: PatientsScreenNavigationProp;
  route?: PatientsScreenRouteProp;
}

const mockPatientsList: PatientItem[] = [
  {
    id: '1',
    patient_id: 'PAT-1001',
    name: 'Eleanor Vance',
    phone_number: '+1 (555) 234-5678',
    gender: 'Female',
    age: 34,
    condition: 'Arrhythmia Follow-up',
    last_visit: '10 Aug 2026',
  },
  {
    id: '2',
    patient_id: 'PAT-1002',
    name: 'Marcus Thorne',
    phone_number: '+1 (555) 876-5432',
    gender: 'Male',
    age: 48,
    condition: 'Hypertension Stage 2',
    last_visit: '04 Aug 2026',
  },
  {
    id: '3',
    patient_id: 'PAT-1003',
    name: 'Sophia Martinez',
    phone_number: '+1 (555) 345-6789',
    gender: 'Female',
    age: 29,
    condition: 'Thyroiditis',
    last_visit: '28 Jul 2026',
  },
  {
    id: '4',
    patient_id: 'PAT-1004',
    name: 'David Kim',
    phone_number: '+1 (555) 987-6543',
    gender: 'Male',
    age: 52,
    condition: 'Coronary Care',
    last_visit: '15 Jul 2026',
  },
  {
    id: '5',
    patient_id: 'PAT-1005',
    name: 'Rachel Adams',
    phone_number: '+1 (555) 456-7890',
    gender: 'Female',
    age: 41,
    condition: 'Post Angioplasty',
    last_visit: '02 Jul 2026',
  },
  {
    id: '6',
    patient_id: 'PAT-1006',
    name: 'Arjun Patel',
    phone_number: '+91 98765 43210',
    gender: 'Male',
    age: 39,
    condition: 'Type 2 Diabetes Check',
    last_visit: '25 Jun 2026',
  },
  {
    id: '7',
    patient_id: 'PAT-1007',
    name: 'Priyanka Sharma',
    phone_number: '+91 91234 56789',
    gender: 'Female',
    age: 31,
    condition: 'Prenatal Consultation',
    last_visit: '18 Jun 2026',
  },
  {
    id: '8',
    patient_id: 'PAT-1008',
    name: 'Vikram Rao',
    phone_number: '+91 99887 76655',
    gender: 'Male',
    age: 61,
    condition: 'Chronic Kidney Disease',
    last_visit: '10 Jun 2026',
  },
  {
    id: '9',
    patient_id: 'PAT-1009',
    name: 'Anita Desai',
    phone_number: '+91 94455 66778',
    gender: 'Female',
    age: 55,
    condition: 'Hyperlipidemia',
    last_visit: '01 Jun 2026',
  },
  {
    id: '10',
    patient_id: 'PAT-1010',
    name: 'Amit Verma',
    phone_number: '+91 93344 55667',
    gender: 'Male',
    age: 44,
    condition: 'Asthma Follow-up',
    last_visit: '20 May 2026',
  },
];

export const PatientsScreen: React.FC<PatientsScreenProps> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Popup Alert state
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type?: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message?: string;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string
  ) => {
    setAlertConfig({
      visible: true,
      type,
      title,
      message,
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const displayPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mockPatientsList;
    return mockPatientsList.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.patient_id?.toLowerCase().includes(q) ||
        p.phone_number?.includes(q) ||
        p.condition?.toLowerCase().includes(q)
    );
  }, [search]);

  useScreenFocus(() => {
    console.log('called patients');
  }, []);

  return (
    <SafeAreaWrapper edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.surface} />
      <View style={S.container}>
        <Header
          title="Patients"
          description="Manage and view your patient records"
          unreadCount={3}
          onNotificationPress={() => navigation?.navigate('Notifications')}
        />
        <View style={S.searchRow}>
          <View style={S.searchPill}>
            <SearchIcon color={theme.colors.textMuted} size={16} />
            <TextInput
              style={S.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search by name, phone or ID..."
              placeholderTextColor={theme.colors.textMuted}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
                <Text style={{ fontSize: 13, color: theme.colors.textMuted, paddingLeft: 6 }}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={S.txHeader}>
          <Text style={S.txLabel}>PATIENTS</Text>
          <Text style={S.txCount}>
            {displayPatients.length} OF {mockPatientsList.length} RECORDS
          </Text>
        </View>
        <FlatList
          data={displayPatients}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <PatientCard
              item={item}
              onPress={() =>
                (navigation as any)?.navigate('PatientDetails', {
                  patientId: item.patient_id,
                  patientName: item.name,
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 4 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <CommonEmptyCard
              title={search ? 'No matching patients' : 'No patients found'}
              message={
                search
                  ? 'Try searching for a different name, phone, or ID.'
                  : 'No patients have been registered under your account yet.'
              }
              actionText={search ? 'Clear Search' : undefined}
              onAction={search ? clearSearch : undefined}
            />
          }
        />

        <TouchableOpacity
          style={S.fab}
          onPress={() => (navigation as any)?.navigate('AddPatient')}
          activeOpacity={0.85}
        >
          <PlusIcon color={theme.colors.surface} size={22} />
        </TouchableOpacity>
      </View>
      <PopupAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onPress={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        onCancel={() => setAlertConfig(prev => ({ ...prev, visible: false }))}
        closeOnBackdrop={true}
      />
    </SafeAreaWrapper>
  );
};

export default PatientsScreen;
