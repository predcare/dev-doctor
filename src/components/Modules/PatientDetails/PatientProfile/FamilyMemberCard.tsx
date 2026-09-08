import React from 'react';
import { Text, View } from 'react-native';
import { capitalize, formatDate, getInitials } from '../../../../lib/common/common.utils';
import { patientProfileTabStyles } from '../../../../styled/PatientProfileTabPanel.styled';

interface FamilyMemberCardProps {
  name: string;
  phone: string;
  dateOfBirth: string;
  relation: string;
  gender: string;
  patientId: string;
  email?: string;
}
const FamilyMemberCard = ({
  name,
  phone,
  dateOfBirth,
  relation,
  gender,
  patientId,
  email,
}: FamilyMemberCardProps) => {
  return (
    <View style={patientProfileTabStyles.familyMemberCard}>
      <View style={patientProfileTabStyles.familyCardHeader}>
        <View style={patientProfileTabStyles.familyAvatar}>
          <Text style={patientProfileTabStyles.familyAvatarText}>{getInitials(name)}</Text>
        </View>
        <View style={patientProfileTabStyles.familyHeaderInfo}>
          <Text style={patientProfileTabStyles.familyMemberName}>{name}</Text>
          <View style={patientProfileTabStyles.familyHeaderBadges}>
            <View style={patientProfileTabStyles.relationBadge}>
              <Text style={patientProfileTabStyles.relationBadgeText}>{capitalize(relation)}</Text>
            </View>
            <View style={patientProfileTabStyles.patientIdPill}>
              <Text style={patientProfileTabStyles.patientIdPillText}>{patientId}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={patientProfileTabStyles.familyCardBody}>
        {gender && (
          <View style={patientProfileTabStyles.familyDetailRow}>
            <Text style={patientProfileTabStyles.familyDetailLabel}>Gender</Text>
            <Text style={patientProfileTabStyles.familyDetailValue}>{capitalize(gender)}</Text>
          </View>
        )}
        {dateOfBirth && (
          <View style={patientProfileTabStyles.familyDetailRow}>
            <Text style={patientProfileTabStyles.familyDetailLabel}>DOB</Text>
            <Text style={patientProfileTabStyles.familyDetailValue}>
              {formatDate(dateOfBirth, 'DD-MMM-YYYY')}
            </Text>
          </View>
        )}
        {phone && (
          <View style={patientProfileTabStyles.familyDetailRow}>
            <Text style={patientProfileTabStyles.familyDetailLabel}>Phone</Text>
            <Text style={patientProfileTabStyles.familyDetailValue}>{phone}</Text>
          </View>
        )}
        {email && (
          <View style={patientProfileTabStyles.familyDetailRow}>
            <Text style={patientProfileTabStyles.familyDetailLabel}>Email</Text>
            <Text style={patientProfileTabStyles.familyDetailValue}>{email}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FamilyMemberCard;
