import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

type ApplicationFormScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ApplicationForm'>;
};

const ApplicationFormScreen: React.FC<ApplicationFormScreenProps> = ({
  navigation,
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

  const navigateToJobFinder = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'JobFinder' }],
      })
    );
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    setNameError('');
    setEmailError('');
    setContactError('');
    setWhyHireYouError('');

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!contactNumber.trim()) {
      setContactError('Contact number is required');
      isValid = false;
    } else if (contactNumber.trim().length < 10) {
      setContactError('Contact number must be at least 10 digits');
      isValid = false;
    }

    if (!whyHireYou.trim()) {
      setWhyHireYouError('This field is required');
      isValid = false;
    } else if (whyHireYou.trim().length < 20) {
      setWhyHireYouError('Please provide at least 20 characters');
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
      console.log('Form Submitted Successfully:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Contact Number:', contactNumber);
      console.log('Why Hire You:', whyHireYou);

      Alert.alert(
        'Application Submitted! ✅',
        'Your application has been submitted successfully. We will get back to you soon!',
        [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
              navigateToJobFinder();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Validation Error',
        'Please fill in all required fields correctly.',
        [{ text: 'OK' }]
      );
    }
  };

  const scrollToInput = (yOffset: number) => {
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Job Application Form</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Fill in your details below
            </Text>
          </View>

          {/* Name Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Name <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: nameError ? colors.error : colors.border },
                nameError && { borderWidth: 2 },
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={colors.placeholder}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (nameError) setNameError('');
              }}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current?.focus()}
              onFocus={() => scrollToInput(0)}
            />
            {nameError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{nameError}</Text>
            ) : null}
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={emailInputRef}
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: emailError ? colors.error : colors.border },
                emailError && { borderWidth: 2 },
              ]}
              placeholder="Enter your email address"
              placeholderTextColor={colors.placeholder}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => contactInputRef.current?.focus()}
              onFocus={() => scrollToInput(100)}
            />
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{emailError}</Text>
            ) : null}
          </View>

          {/* Contact Number Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Contact Number <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={contactInputRef}
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: contactError ? colors.error : colors.border },
                contactError && { borderWidth: 2 },
              ]}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.placeholder}
              value={contactNumber}
              onChangeText={(text) => {
                setContactNumber(text);
                if (contactError) setContactError('');
              }}
              keyboardType="phone-pad"
              returnKeyType="next"
              onSubmitEditing={() => whyHireYouInputRef.current?.focus()}
              onFocus={() => scrollToInput(200)}
            />
            {contactError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{contactError}</Text>
            ) : null}
          </View>

          {/* Why Should We Hire You Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Why should we hire you? <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={whyHireYouInputRef}
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.surface, color: colors.text, borderColor: whyHireYouError ? colors.error : colors.border },
                whyHireYouError && { borderWidth: 2 },
              ]}
              placeholder="Tell us why you're the best fit for this position... (minimum 20 characters)"
              placeholderTextColor={colors.placeholder}
              value={whyHireYou}
              onChangeText={(text) => {
                setWhyHireYou(text);
                if (whyHireYouError) setWhyHireYouError('');
              }}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              onFocus={() => scrollToInput(300)}
            />
            {whyHireYouError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>{whyHireYouError}</Text>
            ) : null}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>Submit Application</Text>
          </TouchableOpacity>

          {/* Navigation Button */}
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={navigateToJobFinder}
            activeOpacity={0.7}>
            <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>Back to Job Finder</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    fontWeight: '700',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
    marginLeft: 4,
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  backButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApplicationFormScreen;