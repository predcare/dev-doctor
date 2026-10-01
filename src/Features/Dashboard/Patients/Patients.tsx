import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { AppRoute } from '../../../route';

const PatinetScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaWrapper showBottomBar activeBottomTab='Patients'>
            <Header
                title="Patients"
                description='Manage your Patients'
                onNotificationPress={() => navigation?.navigate(AppRoute.NOTIFICATIONS)}
            />
            <View>
                <Text>PatinetScreen</Text>
            </View>
        </SafeAreaWrapper>
    );
};

export default PatinetScreen;
