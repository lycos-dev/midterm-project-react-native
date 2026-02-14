import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
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
    } else if (!validateContactNumber(contactNumber)) {
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
      console.log('Submitted from:', fromScreen);

      Alert.alert(
        '✅ Application Submitted!',
        'Your application has been submitted successfully. We will get back to you soon!',
        [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
              // Redirect based on where form was opened from
              if (fromScreen === 'SavedJobs') {
                navigateToJobFinder();
              } else {
                navigation.goBack();
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        '⚠️ Validation Error',
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
        
        {/* Header */}
        <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={navigateToJobFinder}>
            <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
            <Text style={[styles.backText, { color: colors.primary }]}>Back to Job Finder</Text>
          </Pressable>
          
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>📝 Job Application</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
              Fill in your details carefully
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Name Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              👤 Full Name <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: nameError ? colors.error : colors.border },
                nameError && styles.inputError,
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
              <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {nameError}</Text>
            ) : null}
          </View>

          {/* Email Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              ✉️ Email Address <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={emailInputRef}
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: emailError ? colors.error : colors.border },
                emailError && styles.inputError,
              ]}
              placeholder="your.email@example.com"
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
              <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {emailError}</Text>
            ) : null}
          </View>

          {/* Contact Number Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              📱 Contact Number <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={contactInputRef}
              style={[
                styles.input,
                { backgroundColor: colors.surface, color: colors.text, borderColor: contactError ? colors.error : colors.border },
                contactError && styles.inputError,
              ]}
              placeholder="+1 (555) 123-4567"
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
              <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {contactError}</Text>
            ) : null}
          </View>

          {/* Why Should We Hire You Field */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              💼 Why should we hire you? <Text style={[styles.required, { color: colors.error }]}>*</Text>
            </Text>
            <TextInput
              ref={whyHireYouInputRef}
              style={[
                styles.input,
                styles.textArea,
                { backgroundColor: colors.surface, color: colors.text, borderColor: whyHireYouError ? colors.error : colors.border },
                whyHireYouError && styles.inputError,
              ]}
              placeholder="Tell us about your skills, experience, and what makes you the perfect fit... (minimum 20 characters)"
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
            <Text style={[styles.charCount, { color: colors.textSecondary }]}>
              {whyHireYou.length}/20 characters minimum
            </Text>
            {whyHireYouError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>⚠️ {whyHireYouError}</Text>
            ) : null}
          </View>

          {/* Info Box */}
          <View style={[styles.infoBox, { backgroundColor: colors.primary + '15', borderColor: colors.primary }]}>
            <Text style={[styles.infoText, { color: colors.primary }]}>
              💡 Make sure all information is accurate. We'll review your application and contact you soon!
            </Text>
          </View>

          {/* Submit Button */}
          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>✉️ Submit Application</Text>
          </Pressable>

          {/* Cancel Button */}
          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={navigateToJobFinder}>
            <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>✕ Cancel</Text>
          </Pressable>
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
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: '700',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  required: {
    fontWeight: '700',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderWidth: 2,
  },
  textArea: {
    height: 140,
    paddingTop: 16,
  },
  charCount: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
  infoBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  cancelButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ApplicationFormScreen;