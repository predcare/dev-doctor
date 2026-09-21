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
import { useDebounce } from '../../hooks/commons/useDebounce';
import { useMyPatientList } from '../../hooks/react-query/patients/patients.hooks';
import Header from '../../Layout/Header';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import { getAge } from '../../lib/common/common.utils';
import {
  AppRoute,
  type PatientsScreenNavigationProp,
  type PatientsScreenRouteProp,
} from '../../route';
import { MyPatientsStyles as S } from '../../styled/PatientsScreen.styled';
import { theme } from '../../styled/theme.styled';

export interface PatientsScreenProps {
  navigation?: PatientsScreenNavigationProp;
  route?: PatientsScreenRouteProp;
}

export const PatientsScreen: React.FC<PatientsScreenProps> = () => {
  const appNavigation = useNavigation();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const debounceSearch = useDebounce(search, 500);
  const {
    data: myPatients,
    isPending: myPatientPending,
    refetch: fetchPatientList,
    isError: isPatientError,
    error: patientError,
  } = useMyPatientList({
    page: 1,
    limit: 10,
    search: debounceSearch,
  });

  const { patientsList, totalCount } = useMemo(() => {
    const totalCount = myPatients?.meta?.total ?? myPatients?.data?.length;
    return {
      patientsList: Array.isArray(myPatients?.data) ? myPatients.data : [],
      totalCount,
    };
  }, [myPatients?.data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPatientList();
    setRefreshing(false);
  }, [fetchPatientList]);

  const clearSearch = useCallback(() => {
    setSearch('');
  }, []);

  const handleAddPatient = useCallback(() => {
    appNavigation.navigate(AppRoute.ADD_PATIENT);
  }, [appNavigation]);

  const handlePatientDetails = useCallback(
    (params: { patientId: string | number; name: string }) => {
      appNavigation.navigate(AppRoute.PATIENT_DETAILS, {
        patientId: params?.patientId,
        patientName: params?.name,
      });
    },
    [appNavigation]
  );

  return (
    <SafeAreaWrapper showBottomBar={true} activeBottomTab="Patients">
      <View style={S.container}>
        <Header
          title="Patients"
          description="Manage and view your patient records"
          onNotificationPress={() => appNavigation?.navigate(AppRoute.NOTIFICATIONS)}
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
                myPatientPending
                  ? 'Loading patient records...'
                  : 'Search by name, phone, email or ID...'
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
              : `${patientsList.length} OF ${totalCount} RECORDS`}
          </Text>
        </View>
        {myPatientPending ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <PatientSkeleton />
          </ScrollView>
        ) : isPatientError ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100, justifyContent: 'center' }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
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
            data={patientsList}
            keyExtractor={item => String(item.id || item.patient_id || item.user_id)}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <PatientCard
                age={getAge(item?.date_of_birth)}
                gender={item?.gender}
                name={item?.name}
                patientId={item?.patient_id}
                condition={item?.medical_history}
                phoneNumber={item?.phone_number}
                profileImage={item?.profile_image}
                email={item?.email}
                onPress={() =>
                  handlePatientDetails({
                    name: item?.name,
                    patientId: item?.user_id,
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
        )}
        <TouchableOpacity
          style={S.fab}
          onPress={() => handleAddPatient()}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Add New Patient"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <PlusIcon color={theme.colors.surface} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default PatientsScreen;
