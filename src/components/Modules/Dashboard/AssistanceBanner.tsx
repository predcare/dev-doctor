import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { homeStyles } from '../../../styled/HomeScreen.styled';

export interface AssistanceBannerProps {
  onContactSupport?: () => void;
}

export const AssistanceBanner: React.FC<AssistanceBannerProps> = ({
  onContactSupport,
}) => {
  return (
    <View style={homeStyles.supportBanner}>
      <View style={homeStyles.supportCircle1} />
      <View style={homeStyles.supportCircle2} />
      <Text style={homeStyles.supportTitle}>Need Assistance?</Text>
      <Text style={homeStyles.supportSub}>
        Our dedicated support team is{'\n'}here to help you 24/7.
      </Text>
      <TouchableOpacity
        style={homeStyles.supportBtn}
        onPress={onContactSupport}
        activeOpacity={0.85}
      >
        <Text style={homeStyles.supportBtnText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AssistanceBanner;
