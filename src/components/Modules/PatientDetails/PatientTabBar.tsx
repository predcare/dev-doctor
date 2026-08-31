import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { patientDetailsStyles } from '../../../styled/PatientDetailsScreen.styled';

export type MainTabKey = 'records' | 'consultation' | 'invoice' | 'profile';

export interface TabItem {
  key: MainTabKey;
  label: string;
}

export interface PatientTabBarProps {
  tabs: TabItem[];
  activeTab: MainTabKey;
  onTabPress: (tabKey: MainTabKey) => void;
}

export const PatientTabBar: React.FC<PatientTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  return (
    <View style={patientDetailsStyles.mainTabBar}>
      {tabs.map(tab => {
        const active = tab.key === activeTab;
        return (
          <TouchableOpacity
            key={tab.key}
            style={patientDetailsStyles.mainTab}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                patientDetailsStyles.mainTabLabel,
                active && patientDetailsStyles.mainTabLabelActive,
              ]}
            >
              {tab.label}
            </Text>
            {active && <View style={patientDetailsStyles.mainTabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PatientTabBar;
