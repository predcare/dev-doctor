import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaWrapper } from '../../Layout/SafeAreaWrapper';
import type { EditPatientScreenProps } from '../../route';
import { editPatientStyles as styles } from '../../styled/EditPatientScreen.styled';

const TEAL = '#00897B';

const LockedField = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.lockedInput}>
      <Text style={styles.lockedText}>{value || '—'}</Text>
    </View>
  </View>
);

export const EditPatientScreen: React.FC<EditPatientScreenProps> = ({ route, navigation }) => {
  const patientId = route?.params?.patientId || 'PAT-1092';
  const patientName = route?.params?.patientName || 'Eleanor Vance';

  const [loading, setLoading] = useState(false);

  // Pickers modal states
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Read-only personal info (Doctor cannot edit personal identity)
  const [roName] = useState(patientName);
  const [roEmail] = useState('eleanor.vance@example.com');
  const [roPhone] = useState('+91 98765 43210');
  const [roGender] = useState('Female');
  const [roDob] = useState('14/05/1992');

  // Editable fields
  const [formData, setFormData] = useState({
    patient_id: patientId,
    address: '742 Evergreen Terrace, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postal_code: '560034',
    blood_pressure: '120/80',
    pulse: '72',
    temperature: '98.6',
    spo2: '98',
    weight: '62',
    height: '168',
    bmi: '21.97',
    drug_allergies: 'Penicillin, Sulfa drugs',
    medical_history: 'Essential Hypertension (controlled), Mild Seasonal Asthma',
  });

  const countries = [
    { id: 1, name: 'India' },
    { id: 2, name: 'United States' },
    { id: 3, name: 'United Kingdom' },
    { id: 4, name: 'United Arab Emirates' },
  ];

  const states = [
    { id: 1, name: 'Karnataka' },
    { id: 2, name: 'Maharashtra' },
    { id: 3, name: 'Tamil Nadu' },
    { id: 4, name: 'Delhi' },
  ];

  const cities = [
    { id: 1, name: 'Bengaluru' },
    { id: 2, name: 'Mysuru' },
    { id: 3, name: 'Mangaluru' },
    { id: 4, name: 'Hubballi' },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'weight' || field === 'height') {
        const w = parseFloat(field === 'weight' ? value : prev.weight);
        const h = parseFloat(field === 'height' ? value : prev.height);
        if (w > 0 && h > 0) {
          next.bmi = (w / Math.pow(h / 100, 2)).toFixed(2);
        }
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: `Patient ${patientName} updated successfully.`,
        position: 'bottom',
      });
      navigation?.goBack();
    }, 600);
  };

  const renderPickerModal = (
    visible: boolean,
    onClose: () => void,
    title: string,
    items: { id: number; name: string }[],
    selectedName: string,
    onSelect: (item: { id: number; name: string }) => void
  ) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHead}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 350 }}>
            {items.map(item => {
              const selected = item.name === selectedName;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.modalOpt, selected && styles.modalOptSelected]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalOptTxt, selected && styles.modalOptTxtSelected]}>
                    {item.name}
                  </Text>
                  {selected && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaWrapper>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => navigation?.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.idBadge}>
          <Text style={styles.idBadgeTxt} numberOfLines={1}>
            #{formData.patient_id}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: '#6366F1' }]} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.cantEditBadge}>
            <Text style={styles.cantEditTxt}>🔒 Doctor cannot edit</Text>
          </View>
        </View>

        <View style={styles.card}>
          <LockedField label="Full Name" value={roName} />
          <LockedField label="Email Address" value={roEmail} />
          <LockedField label="Phone Number" value={roPhone} />
          <LockedField label="Gender" value={roGender} />
          <LockedField label="Date of Birth" value={roDob} />
        </View>
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: TEAL }]} />
          <Text style={styles.sectionTitle}>Address Information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter street address"
              value={formData.address}
              onChangeText={t => handleChange('address', t)}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerTxt}>{formData.country}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>State</Text>
            <TouchableOpacity
              style={styles.picker}
              onPress={() => setShowStatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.pickerTxt}>{formData.state}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>City</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowCityPicker(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerTxt} numberOfLines={1}>
                  {formData.city}
                </Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Postal Code</Text>
              <TextInput
                style={styles.input}
                placeholder="560001"
                value={formData.postal_code}
                onChangeText={t => handleChange('postal_code', t)}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>
        </View>

        {/* Section 3: Vital Signs */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.sectionTitle}>Vital Signs</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Blood Pressure</Text>
              <TextInput
                style={styles.input}
                placeholder="120/80"
                value={formData.blood_pressure}
                onChangeText={t => handleChange('blood_pressure', t)}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Pulse (bpm)</Text>
              <TextInput
                style={styles.input}
                placeholder="72"
                value={formData.pulse}
                onChangeText={t => handleChange('pulse', t)}
                keyboardType="number-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Temperature (°F)</Text>
              <TextInput
                style={styles.input}
                placeholder="98.6"
                value={formData.temperature}
                onChangeText={t => handleChange('temperature', t)}
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>SpO2 (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="98"
                value={formData.spo2}
                onChangeText={t => handleChange('spo2', t)}
                keyboardType="number-pad"
                maxLength={3}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="70"
                value={formData.weight}
                onChangeText={t => handleChange('weight', t)}
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="170"
                value={formData.height}
                onChangeText={t => handleChange('height', t)}
                keyboardType="decimal-pad"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          {!!formData.bmi && (
            <View style={[styles.inputGroup, { marginBottom: 0 }]}>
              <Text style={styles.label}>BMI (Auto-calculated)</Text>
              <View style={styles.bmiBox}>
                <Text style={styles.bmiVal}>{formData.bmi}</Text>
                <Text style={styles.bmiUnit}>kg/m²</Text>
              </View>
            </View>
          )}
        </View>

        {/* Section 4: Medical Information */}
        <View style={styles.sectionRow}>
          <View style={[styles.sectionBar, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.sectionTitle}>Medical Information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Drug Allergies</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="List any drug allergies"
              value={formData.drug_allergies}
              onChangeText={t => handleChange('drug_allergies', t)}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.inputGroup, { marginBottom: 0 }]}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Chronic conditions, past surgeries..."
              value={formData.medical_history}
              onChangeText={t => handleChange('medical_history', t)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#9CA3AF"
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => navigation?.goBack()}
            disabled={loading}
          >
            <Text style={styles.cancelTxt}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveBtn, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.saveTxt}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      {renderPickerModal(
        showCountryPicker,
        () => setShowCountryPicker(false),
        'Select Country',
        countries,
        formData.country,
        item => handleChange('country', item.name)
      )}

      {/* State Picker Modal */}
      {renderPickerModal(
        showStatePicker,
        () => setShowStatePicker(false),
        'Select State',
        states,
        formData.state,
        item => handleChange('state', item.name)
      )}

      {/* City Picker Modal */}
      {renderPickerModal(
        showCityPicker,
        () => setShowCityPicker(false),
        'Select City',
        cities,
        formData.city,
        item => handleChange('city', item.name)
      )}
    </SafeAreaWrapper>
  );
};

export default EditPatientScreen;
