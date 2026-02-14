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
      console.log('Form Submitted:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Contact:', contactNumber);
      console.log('Why Hire You:', whyHireYou);
      console.log('From:', fromScreen);

      Alert.alert(
        'Application Submitted',
        'Your application has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              clearForm();
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
        'Validation Error',
        'Please fill in all fields correctly.',
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

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                {nameError ? (
                  <Text style={[styles.errorInline, { color: colors.text }]}>{nameError}</Text>
                ) : null}
              </View>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface, 
                    color: colors.text, 
                    borderColor: nameError ? colors.text : colors.border 
                  },
                ]}
                placeholder="John Doe"
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
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
                {emailError ? (
                  <Text style={[styles.errorInline, { color: colors.text }]}>{emailError}</Text>
                ) : null}
              </View>
              <TextInput
                ref={emailInputRef}
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface, 
                    color: colors.text, 
                    borderColor: emailError ? colors.text : colors.border 
                  },
                ]}
                placeholder="john@example.com"
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
            </View>

            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Contact Number</Text>
                {contactError ? (
                  <Text style={[styles.errorInline, { color: colors.text }]}>{contactError}</Text>
                ) : null}
              </View>
              <TextInput
                ref={contactInputRef}
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surface, 
                    color: colors.text, 
                    borderColor: contactError ? colors.text : colors.border 
                  },
                ]}
                placeholder="+1 (555) 000-0000"
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
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.formSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Application Details</Text>
            
            <View style={styles.formGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Why should we hire you?</Text>
                {whyHireYouError ? (
                  <Text style={[styles.errorInline, { color: colors.text }]}>{whyHireYouError}</Text>
                ) : null}
              </View>
              <TextInput
                ref={whyHireYouInputRef}
                style={[
                  styles.input,
                  styles.textArea,
                  { 
                    backgroundColor: colors.surface, 
                    color: colors.text, 
                    borderColor: whyHireYouError ? colors.text : colors.border 
                  },
                ]}
                placeholder="Tell us about your skills and experience..."
                placeholderTextColor={colors.placeholder}
                value={whyHireYou}
                onChangeText={(text) => {
                  setWhyHireYou(text);
                  if (whyHireYouError) setWhyHireYouError('');
                }}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                onFocus={() => scrollToInput(350)}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {whyHireYou.length}/20 minimum
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={handleSubmit}>
            <Text style={[styles.submitButtonText, { color: colors.surface }]}>Submit Application</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={navigateToJobFinder}>
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  formGroup: {
    marginBottom: 20,
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
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  submitButton: {
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  cancelButton: {
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ApplicationFormScreen;