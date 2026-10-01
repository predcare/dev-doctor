import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import CommonErrorCard from '../../../components/commons/CommonErrorCard/CommonErrorCard';
import { useMyPatientInfo } from '../../../hooks/react-query/patients/patients.hooks';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { capitalize, getAge } from '../../../lib/commons/common.utils';
import { AppRoute, PatientDetailsScreenProps } from '../../../route';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';
import PatientHeaderCard from './Components/PatientHeaderCard';
import PatientTabBar, { MainTabKey, TabItem } from './Components/PatientTabBar';
import ConsultTabPanel from './Components/Tabs/ConsultTabPanel';
import PatientProfileTabPanel from './Components/Tabs/PatientProfileTabPanel';
import PrescriptionsTabPanel from './Components/Tabs/PrescriptionsTabPanel';
import RecordsTabPanel from './Components/Tabs/RecordsTabPanel';
import PatientDetailsSkeleton from './Skeletons/PatientDetailsSkeleton';

const PatientMainTabs: TabItem[] = [
    { key: 'records', label: 'Records' },
    { key: 'prescriptions', label: 'Prescriptions' },
    { key: 'consultation', label: 'Consult' },
    // { key: 'invoice', label: 'Invoice' },
    { key: 'profile', label: 'Profile' },
];

interface IRouterProps {
    patientId: string;
    patientName: string;
    openUploadModal?: boolean;
}

export const PatientDetailsScreen: React.FC<PatientDetailsScreenProps> = ({
    navigation,
    route,
}) => {
    const appNavigation = useNavigation();
    const { patientId, patientName, openUploadModal } = (route?.params as IRouterProps) || {};
    const [activeMainTab, setActiveMainTab] = useState<MainTabKey>('records');

    const {
        data: patientInfo,
        isFetching: patientInfoPending,
        isError: isPatientInfoError,
        refetch: refetchPatientInfo,
    } = useMyPatientInfo({
        patientId: Number(patientId),
    });

    const displayName = useMemo(() => {
        return patientInfo?.name || patientName;
    }, [patientInfo?.name, patientName]);

    useEffect(() => {
        if (openUploadModal) {
            setActiveMainTab('records');
        }
    }, [openUploadModal]);

    return (
        <SafeAreaWrapper
            showBottomBar
            header={
                <Header
                    title={displayName || 'Patient Details'}
                    description="View and manage patient records"
                    isBackBtn
                    onBackPress={() => {
                        if (navigation?.canGoBack()) {
                            navigation.goBack();
                        } else {
                            appNavigation?.navigate(AppRoute.PATIENTS);
                        }
                    }}
                />
            }
        >
            <View style={patientDetailsStyles.container}>
                {patientInfoPending ? (
                    <PatientDetailsSkeleton />
                ) : isPatientInfoError ? (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingVertical: 40, justifyContent: 'center' }}
                        showsVerticalScrollIndicator={false}
                    >
                        <CommonErrorCard
                            title="Failed to Load Patient Details"
                            message="Something went wrong while fetching patient records."
                            onRetry={refetchPatientInfo}
                        />
                    </ScrollView>
                ) : (
                    <>
                        <PatientHeaderCard
                            name={patientInfo?.name || 'UnKnown'}
                            patientId={patientInfo?.patient_id || ''}
                            gender={capitalize(patientInfo?.gender || '')}
                            age={
                                getAge(patientInfo?.date_of_birth || '', {
                                    large: true,
                                }) || ''
                            }
                            bloodGroup={patientInfo?.blood_type || ''}
                            profileImg={patientInfo?.profile_image}
                        />
                        <PatientTabBar
                            tabs={PatientMainTabs}
                            activeTab={activeMainTab}
                            onTabPress={setActiveMainTab}
                        />
                        <View style={{ flex: 1 }}>
                            {activeMainTab === 'records' && <RecordsTabPanel patientId={patientId} />}
                            {activeMainTab === 'prescriptions' && <PrescriptionsTabPanel patientId={patientId} />}
                            {activeMainTab === 'profile' && <PatientProfileTabPanel patientInfo={patientInfo} />}
                            {activeMainTab === 'consultation' && <ConsultTabPanel patientId={patientId} />}
                        </View>
                    </>
                )}
            </View>
        </SafeAreaWrapper>
    );
};

export default PatientDetailsScreen;
