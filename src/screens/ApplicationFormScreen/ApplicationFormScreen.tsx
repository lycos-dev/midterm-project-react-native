import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import { COUNTRIES, CountryData } from '../../constants/countries';
import { formatPhoneNumber, validateContactNumber } from '../../utils/phoneUtils';
import CountryPickerModal from './CountryPickerModal';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ApplicationForm'>;
  route: RouteProp<RootStackParamList, 'ApplicationForm'>;
};

const ApplicationFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whyHireYou, setWhyHireYou] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(COUNTRIES[0]);
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
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: fromScreen }] }));
  };

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleContactChange = (text: string) => {
    setContactNumber(formatPhoneNumber(text, selectedCountry));
    if (contactError) setContactError('');
  };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setContactNumber('');
    setContactError('');
    setShowCountryPicker(false);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError(''); setEmailError(''); setContactError(''); setWhyHireYouError('');

    if (!name.trim()) { setNameError('Required'); isValid = false; }
    if (!email.trim()) { setEmailError('Required'); isValid = false; }
    else if (!validateEmail(email)) { setEmailError('Invalid format'); isValid = false; }

    if (!contactNumber.trim()) {
      setContactError('Required'); isValid = false;
    } else if (!validateContactNumber(contactNumber, selectedCountry)) {
      const digits = contactNumber.replace(/\D/g, '');
      setContactError(
        digits.length < selectedCountry.minLength
          ? `Minimum ${selectedCountry.minLength} digits required`
          : `Maximum ${selectedCountry.maxLength} digits allowed`
      );
      isValid = false;
    }

    if (!whyHireYou.trim()) { setWhyHireYouError('Required'); isValid = false; }
    else if (whyHireYou.trim().length < 20) { setWhyHireYouError('Minimum 20 characters'); isValid = false; }

    return isValid;
  };

  const clearForm = () => {
    setName(''); setEmail(''); setContactNumber(''); setWhyHireYou('');
    setNameError(''); setEmailError(''); setContactError(''); setWhyHireYouError('');
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all fields correctly.');
      return;
    }
    const fullPhone = `${selectedCountry.dialCode} ${contactNumber}`;
    Alert.alert('Submit Application', `Are you sure?\n\nName: ${name}\nEmail: ${email}\nContact: ${fullPhone}`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: () =>
          Alert.alert('Application Submitted', 'Your application has been submitted successfully!', [
            { text: 'OK', onPress: () => { clearForm(); goBack(); } },
          ]),
      },
    ]);
  };

  const handleCancel = () => {
    const hasInput = name.trim() || email.trim() || contactNumber.trim() || whyHireYou.trim();
    if (hasInput) {
      Alert.alert('Cancel Application', 'All entered information will be lost.', [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel & Return', style: 'destructive', onPress: goBack },
      ]);
    } else {
      goBack();
    }
  };

  const scrollToInput = (yOffset: number) => {
    setTimeout(() => scrollViewRef.current?.scrollTo({ y: yOffset, animated: true }), 100);
  };

  const renderField = (label: string, error: string, input: React.ReactNode) => (
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
      <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable onPress={handleCancel} style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}>
          <Feather name="chevron-left" size={22} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>Application Form</Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView behavior="padding" style={[styles.keyboardAvoidingView, { backgroundColor: colors.background }]} keyboardVerticalOffset={0}>
        <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Personal Information</Text>

          {renderField('Full Name', nameError,
            <TextInput
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: nameError ? colors.text : colors.border }]}
              placeholder="John Doe"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={(t) => { setName(t); if (nameError) setNameError(''); }}
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
              onChangeText={(t) => { setEmail(t); if (emailError) setEmailError(''); }}
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
              <TextInput
                ref={contactInputRef}
                style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: contactError ? colors.text : colors.border }]}
                placeholder={selectedCountry.placeholder}
                placeholderTextColor={colors.placeholder}
                value={contactNumber}
                onChangeText={handleContactChange}
                keyboardType="phone-pad"
                returnKeyType="done"
                onSubmitEditing={() => whyHireYouInputRef.current?.focus()}
                onFocus={() => scrollToInput(240)}
              />
              <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                {selectedCountry.minLength === selectedCountry.maxLength
                  ? `${selectedCountry.minLength} digits required`
                  : `${selectedCountry.minLength}-${selectedCountry.maxLength} digits required`}
              </Text>
            </View>
          )}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Application Details</Text>

          {renderField('Why should we hire you?', whyHireYouError,
            <>
              <TextInput
                ref={whyHireYouInputRef}
                style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.text, borderColor: whyHireYouError ? colors.text : colors.border }]}
                placeholder="Tell us about your skills and experience..."
                placeholderTextColor={colors.placeholder}
                value={whyHireYou}
                onChangeText={(t) => { setWhyHireYou(t); if (whyHireYouError) setWhyHireYouError(''); }}
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

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [styles.submitBtn, { backgroundColor: colors.text, opacity: pressed ? 0.6 : 1 }]}
              onPress={handleSubmit}>
              <Text style={[styles.submitBtnText, { color: colors.surface }]}>Submit Application</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.cancelBtn, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
              onPress={handleCancel}>
              <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CountryPickerModal
        visible={showCountryPicker}
        selectedCountry={selectedCountry}
        colors={colors}
        onSelect={handleCountrySelect}
        onClose={() => setShowCountryPicker(false)}
      />
    </SafeAreaView>
  );
};

export default ApplicationFormScreen;
