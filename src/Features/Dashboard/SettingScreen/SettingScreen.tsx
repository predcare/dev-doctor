import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';
import Header from '../../../Layout/Header';
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper';
import { AppRoute } from '../../../route';

const SettingScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaWrapper showBottomBar>
            <Header
                title="Settings"
                description="Manage your App Settings"
                onNotificationPress={() => navigation?.navigate(AppRoute.NOTIFICATIONS)}
            />
            <View>
                <Text>HomeScreen</Text>
            </View>
        </SafeAreaWrapper>
    );
};

export default SettingScreen;
