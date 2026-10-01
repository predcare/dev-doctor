
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { Text, View } from 'react-native'
import Header from '../../../Layout/Header'
import SafeAreaWrapper from '../../../Layout/SafeAreaWrapper'
import { AppRoute } from '../../../route'

const HomeScreen = () => {
    const navigation = useNavigation()
    return (
        <SafeAreaWrapper showBottomBar hasHeader>
            <Header
                isHome
                onNotificationPress={() => navigation?.navigate(AppRoute.NOTIFICATIONS)}
                onProfilePress={() => navigation?.navigate('Account' as any)}
            />
            <View>
                <Text>HomeScreen</Text>
            </View>
        </SafeAreaWrapper>
    )
}

export default HomeScreen
