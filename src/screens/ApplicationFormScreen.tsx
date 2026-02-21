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

const ApplicationFormScreen: React.FC<ApplicationFormScreenProps> = ({
  navigation,
  route,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [whyHireYou, setWhyHireYou] = useState('');

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

  const validateContactNumber = (contact: string): boolean => {
    const digitsOnly = contact.replace(/\D/g, '');
    return digitsOnly.length >= 10;
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
    } else if (!validateContactNumber(contactNumber)) {
      setContactError('Minimum 10 digits');
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
      Alert.alert(
        'Submit Application',
        `Are you sure you want to submit?\n\nName: ${name}\nEmail: ${email}\nContact: ${contactNumber}`,
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
            <TextInput
              ref={contactInputRef}
              style={[styles.input, { backgroundColor: colors.surface, color: colors.text, borderColor: contactError ? colors.text : colors.border }]}
              placeholder="+63 123-4567-890"
              placeholderTextColor={colors.placeholder}
              value={contactNumber}
              onChangeText={(text) => { setContactNumber(text); if (contactError) setContactError(''); }}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => whyHireYouInputRef.current?.focus()}
              onFocus={() => scrollToInput(240)}
            />
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
              style={({ pressed }) => [styles.cancelBtn, { borderColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
              onPress={handleCancel}>
              <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
            </Pressable>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
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
    fontWeight: '500',
  },
});

export default ApplicationFormScreen;