import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import CommonEmptyCard from '../../../components/commons/CommonEmptyCard/CommonEmptyCard';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { PlusIcon, SearchIcon } from '../../../components/ui/icons';
import CrossIcon from '../../../components/ui/icons/CrossIcon';
import { useDebounce } from '../../../hooks/commons/useDebounce';
import { useMyPatientInfiniteList } from '../../../hooks/react-query/patients/patients.hooks';
import { getAge } from '../../../lib/commons/common.utils';
import { AppRoute } from '../../../route';
import PatientsStyles from '../../../styled/PatientsScreen.styled';
import theme from '../../../styled/theme.styled';
import PatientCard from './Components/PatientCard';
import PatientSkeleton from './Skeletons/PatientSkeleton';

export const PatientsScreen: React.FC = () => {
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
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useMyPatientInfiniteList({
        limit: 15,
        search: debounceSearch,
    });

    const { patientsList, totalCount } = useMemo(() => {
        const pages = myPatients?.pages ?? [];
        const list = pages.flatMap(page => (Array.isArray(page?.data) ? page.data : []));
        const total = pages[0]?.meta?.total ?? list.length;
        return {
            patientsList: list,
            totalCount: total,
        };
    }, [myPatients?.pages]);

    const handleLoadMore = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        <SafeAreaWrapper
            showBottomBar={true}
            activeBottomTab="Patients"
            header={<Header title="My Patients" description="Manage and view your patient records" />}
        >
            <View style={PatientsStyles.container}>
                <View style={PatientsStyles.searchRow}>
                    <View style={PatientsStyles.searchPill}>
                        <SearchIcon color={theme.colors.textMuted} size={16} />
                        <TextInput
                            style={PatientsStyles.searchInput}
                            placeholder="Search by name, phone, email or ID..."
                            placeholderTextColor={theme.colors.textMuted}
                            value={search}
                            onChangeText={(value: string) => {
                                setSearch(value);
                            }}
                        />
                        {search?.length > 0 && (
                            <TouchableOpacity
                                style={PatientsStyles.clearSearchBtn}
                                onPress={clearSearch}
                                activeOpacity={0.7}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <CrossIcon color={theme.colors.red} size={11} strokeWidth={2.5} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View style={PatientsStyles.txHeader}>
                    <Text style={PatientsStyles.txLabel}>PATIENTS</Text>
                    <Text style={PatientsStyles.txCount}>
                        {myPatientPending
                            ? 'Loading Records...'
                            : `${patientsList?.length || 0} OF ${totalCount || 0} RECORDS`}
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
                        onEndReached={handleLoadMore}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                                    <ActivityIndicator size="small" color={theme.colors.primary} />
                                </View>
                            ) : undefined
                        }
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
                    style={[PatientsStyles.fab]}
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
