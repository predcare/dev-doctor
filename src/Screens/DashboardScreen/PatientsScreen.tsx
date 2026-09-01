import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import CommonEmptyCard from '../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../components/commons/CommonErrorCard/CommonErrorCard';
import PatientCard from '../../components/Modules/Patients/PatientCard';
import PatientSkeleton from '../../components/Skeletons/PatientSkeleton';
import { PlusIcon, SearchIcon } from '../../components/ui/icons';
import { useMyPatientList } from '../../hooks/react-query/patients/patients.hooks';
import Header from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { getAge } from '../../lib/common/common.utils';
import { showInfoToast } from '../../lib/common/toast.utils';
import type { PatientsScreenNavigationProp, PatientsScreenRouteProp } from '../../route';
import { MyPatientsStyles as S } from '../../styled/PatientsScreen.styled';
import { theme } from '../../styled/theme.styled';
import { useAuthStore } from '../../zustand/stores/useAuthStore';

export interface PatientsScreenProps {
  navigation?: PatientsScreenNavigationProp;
  route?: PatientsScreenRouteProp;
}

export const PatientsScreen: React.FC<PatientsScreenProps> = ({ navigation }) => {
  const appNavigation = useNavigation();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useAuthStore(state => state);
  const {
    data: myPatients,
    isPending: myPatientPending,
    refetch: fetchPatientList,
    isError: isPatientError,
    error: patientError,
  } = useMyPatientList({
    doctorId: userData?.user_id,
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatientList();
    setRefreshing(false);
  }, [fetchPatientList]);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const handleAddPatient = useCallback(() => {
    appNavigation.navigate('AddPatient');
  }, [appNavigation]);

  const displayPatients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return myPatients;
    return myPatients?.filter(
      p =>
        p.name?.toLowerCase().includes(q) ||
        p.patient_id?.toLowerCase().includes(q) ||
        p.phone_number?.includes(q) ||
        p.condition?.toLowerCase().includes(q)
    );
  }, [search, myPatients]);

  return (
    <SafeAreaWrapper>
      <View style={S.container}>
        <Header
          title="Patients"
          description="Manage and view your patient records"
          unreadCount={3}
          onNotificationPress={() => navigation?.navigate('Notifications')}
        />
        <View style={S.searchRow}>
          <View style={[S.searchPill, myPatientPending && { opacity: 0.7 }]}>
            <SearchIcon color={theme.colors.textMuted} size={16} />
            <TextInput
              style={S.searchInput}
              value={search}
              onChangeText={(value: string) => {
                setSearch(value);
              }}
              editable={!myPatientPending}
              placeholder={
                myPatientPending ? 'Loading patient records...' : 'Search by name, phone or ID...'
              }
              placeholderTextColor={theme.colors.textMuted}
            />
            {search.length > 0 && !myPatientPending && (
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
            {myPatientPending
              ? 'Loading Records...'
              : `${displayPatients?.length ?? 0} OF ${myPatients?.length ?? 0} RECORDS`}
          </Text>
        </View>
        {myPatientPending ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <PatientSkeleton />
          </ScrollView>
        ) : isPatientError ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
          >
            <CommonErrorCard
              title="Failed to Load Patients"
              message={
                (patientError as any)?.message ||
                'Something went wrong while fetching patient records.'
              }
              onRetry={fetchPatientList}
            />
          </ScrollView>
        ) : (
          <FlatList
            data={displayPatients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PatientCard
                age={getAge(item?.date_of_birth)}
                gender={item?.gender}
                name={item?.name}
                patientId={item?.patient_id}
                condition={item?.condition}
                onPress={() => showInfoToast('Coming Soon...')}
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
        )}
        <TouchableOpacity style={S.fab} onPress={() => handleAddPatient()} activeOpacity={0.85}>
          <PlusIcon color={theme.colors.surface} size={22} />
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default PatientsScreen;
