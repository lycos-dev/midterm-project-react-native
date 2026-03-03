import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

type ApplicationFormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ApplicationForm'>;
  route: RouteProp<RootStackParamList, 'ApplicationForm'>;
};

// Country data with phone validation rules
interface CountryData {
  name: string;
  code: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
  placeholder: string;
  flag: string;
}

const COUNTRIES: CountryData[] = [
  { name: 'Philippines', code: 'PH', dialCode: '+63', minLength: 10, maxLength: 10, placeholder: '912 345 6789', flag: '🇵🇭' },
  { name: 'United States', code: 'US', dialCode: '+1', minLength: 10, maxLength: 10, placeholder: '555 123 4567', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', minLength: 10, maxLength: 11, placeholder: '7911 123456', flag: '🇬🇧' },
  { name: 'India', code: 'IN', dialCode: '+91', minLength: 10, maxLength: 10, placeholder: '98765 43210', flag: '🇮🇳' },
  { name: 'Australia', code: 'AU', dialCode: '+61', minLength: 9, maxLength: 9, placeholder: '412 345 678', flag: '🇦🇺' },
  { name: 'Canada', code: 'CA', dialCode: '+1', minLength: 10, maxLength: 10, placeholder: '555 123 4567', flag: '🇨🇦' },
  { name: 'Singapore', code: 'SG', dialCode: '+65', minLength: 8, maxLength: 8, placeholder: '8123 4567', flag: '🇸🇬' },
  { name: 'Japan', code: 'JP', dialCode: '+81', minLength: 10, maxLength: 10, placeholder: '90 1234 5678', flag: '🇯🇵' },
  { name: 'South Korea', code: 'KR', dialCode: '+82', minLength: 9, maxLength: 10, placeholder: '10 1234 5678', flag: '🇰🇷' },
  { name: 'Germany', code: 'DE', dialCode: '+49', minLength: 10, maxLength: 11, placeholder: '151 23456789', flag: '🇩🇪' },
];

const ApplicationFormScreen: React.FC<ApplicationFormScreenProps> = ({
  navigation,
  route,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whyHireYou, setWhyHireYou] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(COUNTRIES[0]); // Default to Philippines
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [contactError, setContactError] = useState('');
  const [whyHireYouError, setWhyHireYouError] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const contactInputRef = useRef<TextInput>(null);
  const whyHireYouInputRef = useRef<TextInput>(null);

  const { colors } = useTheme();
  const fromScreen = route.params?.fromScreen || 'JobFinder';

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: fromScreen }],
      })
    );
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const formatPhoneNumber = (text: string, country: CountryData): string => {
    // Remove all non-digit characters
    const digitsOnly = text.replace(/\D/g, '');
    
    // Limit to max length
    const limited = digitsOnly.slice(0, country.maxLength);
    
    // Auto-format based on country
    if (country.code === 'PH') {
      // Philippines: 912 345 6789
      if (limited.length > 6) {
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
      } else if (limited.length > 3) {
        return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      }
      return limited;
    } else if (country.code === 'US' || country.code === 'CA') {
      // US/Canada: 555 123 4567
      if (limited.length > 6) {
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
      } else if (limited.length > 3) {
        return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      }
      return limited;
    } else if (country.code === 'GB') {
      // UK: 7911 123456
      if (limited.length > 4) {
        return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      }
      return limited;
    } else if (country.code === 'IN') {
      // India: 98765 43210
      if (limited.length > 5) {
        return `${limited.slice(0, 5)} ${limited.slice(5)}`;
      }
      return limited;
    } else if (country.code === 'AU') {
      // Australia: 412 345 678
      if (limited.length > 6) {
        return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`;
      } else if (limited.length > 3) {
        return `${limited.slice(0, 3)} ${limited.slice(3)}`;
      }
      return limited;
    } else if (country.code === 'SG') {
      // Singapore: 8123 4567
      if (limited.length > 4) {
        return `${limited.slice(0, 4)} ${limited.slice(4)}`;
      }
      return limited;
    } else if (country.code === 'JP') {
      // Japan: 90 1234 5678
      if (limited.length > 6) {
        return `${limited.slice(0, 2)} ${limited.slice(2, 6)} ${limited.slice(6)}`;
      } else if (limited.length > 2) {
        return `${limited.slice(0, 2)} ${limited.slice(2)}`;
      }
      return limited;
    }
    
    // Default formatting
    return limited;
  };

  const validateContactNumber = (contact: string, country: CountryData): boolean => {
    const digitsOnly = contact.replace(/\D/g, '');
    return digitsOnly.length >= country.minLength && digitsOnly.length <= country.maxLength;
  };

  const handleContactChange = (text: string) => {
    const formatted = formatPhoneNumber(text, selectedCountry);
    setContactNumber(formatted);
    if (contactError) setContactError('');
  };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setContactNumber(''); // Clear contact number when country changes
    setContactError('');
    setShowCountryPicker(false);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    setNameError('');
    setEmailError('');
    setContactError('');
    setWhyHireYouError('');

    if (!name.trim()) {
      setNameError('Required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid format');
      isValid = false;
    }

    if (!contactNumber.trim()) {
      setContactError('Required');
      isValid = false;
    } else if (!validateContactNumber(contactNumber, selectedCountry)) {
      const digitsOnly = contactNumber.replace(/\D/g, '');
      if (digitsOnly.length < selectedCountry.minLength) {
        setContactError(`Minimum ${selectedCountry.minLength} digits required`);
      } else {
        setContactError(`Maximum ${selectedCountry.maxLength} digits allowed`);
      }
      isValid = false;
    }

    if (!whyHireYou.trim()) {
      setWhyHireYouError('Required');
      isValid = false;
    } else if (whyHireYou.trim().length < 20) {
      setWhyHireYouError('Minimum 20 characters');
      isValid = false;
    }

    return isValid;
  };

  const clearForm = () => {
    setName('');
    setEmail('');
    setContactNumber('');
    setWhyHireYou('');
    setNameError('');
    setEmailError('');
    setContactError('');
    setWhyHireYouError('');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const fullPhone = `${selectedCountry.dialCode} ${contactNumber}`;
      Alert.alert(
        'Submit Application',
        `Are you sure you want to submit?\n\nName: ${name}\nEmail: ${email}\nContact: ${fullPhone}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              Alert.alert(
                'Application Submitted',
                'Your application has been submitted successfully. We will get back to you soon!',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      clearForm();
                      goBack();
                    },
                  },
                ]
              );
            },
          },
        ]
      );
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.', [{ text: 'OK' }]);
    }
  };

  const handleCancel = () => {
    const hasInput = name.trim() || email.trim() || contactNumber.trim() || whyHireYou.trim();

    if (hasInput) {
      Alert.alert(
        'Cancel Application',
        'Are you sure you want to cancel? All entered information will be lost.',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Cancel & Return', style: 'destructive', onPress: goBack },
        ]
      );
    } else {
      goBack();
    }
  };

  const scrollToInput = (yOffset: number) => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
    }, 100);
  };

  const renderField = (
    label: string,
    error: string,
    input: React.ReactNode
  ) => (
    <View style={styles.formGroup}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {error ? <Text style={[styles.errorInline, { color: colors.textSecondary }]}>{error}</Text> : null}
      </View>
      {input}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* NAV */}
      <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={handleCancel}
          style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}>
          <Feather name="chevron-left" size={22} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Application Form</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={[styles.keyboardAvoidingView, { backgroundColor: colors.background }]}
        keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Personal Information */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Personal Information</Text>

          {renderField('Full Name', nameError,
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: nameError ? colors.text : colors.border }]}
              placeholder="John Doe"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={(text) => { setName(text); if (nameError) setNameError(''); }}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              onFocus={() => scrollToInput(0)}
            />
          )}

          {renderField('Email Address', emailError,
            <TextInput
              ref={emailInputRef}
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: emailError ? colors.text : colors.border }]}
              placeholder="john@example.com"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={(text) => { setEmail(text); if (emailError) setEmailError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => contactInputRef.current?.focus()}
              onFocus={() => scrollToInput(120)}
            />
          )}

          {renderField('Contact Number', contactError,
            <View>
              {/* Country Picker Button */}
              <Pressable 
                onPress={() => setShowCountryPicker(true)}
                style={[styles.countryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.countryButtonContent}>
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={[styles.countryButtonText, { color: colors.text }]}>
                    {selectedCountry.code} {selectedCountry.dialCode}
                  </Text>
                </View>
                <Feather name="chevron-down" size={18} color={colors.text} />
              </Pressable>

              {/* Phone Number Input */}
              <TextInput
                ref={contactInputRef}
                style={[styles.input, styles.phoneInput, { backgroundColor: colors.surface, color: colors.text, borderColor: contactError ? colors.text : colors.border }]}
                placeholder={selectedCountry.placeholder}
                placeholderTextColor={colors.placeholder}
                value={contactNumber}
                onChangeText={handleContactChange}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={() => whyHireYouInputRef.current?.focus()}
                onFocus={() => scrollToInput(240)}
              />
              
              {/* Helper text */}
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                {selectedCountry.minLength === selectedCountry.maxLength 
                  ? `${selectedCountry.minLength} digits required`
                  : `${selectedCountry.minLength}-${selectedCountry.maxLength} digits required`
                }
              </Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Application Details */}
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Application Details</Text>

          {renderField('Why should we hire you?', whyHireYouError,
            <>
              <TextInput
                ref={whyHireYouInputRef}
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: whyHireYouError ? colors.text : colors.border }]}
                placeholder="Tell us about your skills and experience..."
                placeholderTextColor={colors.placeholder}
                value={whyHireYou}
                onChangeText={(text) => { setWhyHireYou(text); if (whyHireYouError) setWhyHireYouError(''); }}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => scrollToInput(500)}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {whyHireYou.length} / 20 minimum
              </Text>
            </>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.submitBtn, { backgroundColor: colors.text, opacity: pressed ? 0.6 : 1 }]}
              onPress={handleSubmit}>
              <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submit Application</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn, 
                { 
                  backgroundColor: colors.surface, 
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1 
                }
              ]}
              onPress={handleCancel}>
              <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCountryPicker(false)}>
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowCountryPicker(false)}>
          <Pressable 
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
              <Pressable onPress={() => setShowCountryPicker(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </Pressable>
            </View>
            <ScrollView style={styles.countryList}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.code}
                  style={[
                    styles.countryItem,
                    { borderBottomColor: colors.border },
                    selectedCountry.code === country.code && { backgroundColor: colors.background }
                  ]}
                  onPress={() => handleCountrySelect(country)}>
                  <View style={styles.countryItemContent}>
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <View style={styles.countryInfo}>
                      <Text style={[styles.countryName, { color: colors.text }]}>
                        {country.name}
                      </Text>
                      <Text style={[styles.countryDetails, { color: colors.textSecondary }]}>
                        {country.code} {country.dialCode} • {country.minLength === country.maxLength ? `${country.minLength} digits` : `${country.minLength}-${country.maxLength} digits`}
                      </Text>
                    </View>
                  </View>
                  {selectedCountry.code === country.code && (
                    <Feather name="check" size={20} color={colors.text} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // NAV
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 80,
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  navSpacer: {
    width: 80,
  },
  // FORM
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorInline: {
    fontSize: 12,
    fontWeight: '500',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  countryButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  phoneInput: {
    marginTop: 0,
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  charCount: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  submitBtn: {
    height: 52,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cancelBtn: {
    height: 52,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  countryList: {
    maxHeight: 500,
  },
  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  countryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  countryDetails: {
    fontSize: 13,
  },
});

export default ApplicationFormScreen;