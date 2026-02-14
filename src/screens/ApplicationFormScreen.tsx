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
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (!contactNumber.trim()) {
      setContactError('Contact number is required');
      isValid = false;
    } else if (!validateContactNumber(contactNumber)) {
      setContactError('Minimum 10 digits required');
      isValid = false;
    }

    if (!whyHireYou.trim()) {
      setWhyHireYouError('This field is required');
      isValid = false;
    } else if (whyHireYou.trim().length < 20) {
      setWhyHireYouError('Minimum 20 characters required');
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
        
        <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={navigateToJobFinder}>
            <Text style={[styles.backText, { color: colors.text }]}>← Back</Text>
          </Pressable>
          
          <Text style={[styles.headerTitle, { color: colors.text }]}>Application Form</Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.surface, 
                  color: colors.text, 
                  borderColor: nameError ? colors.text : colors.border 
                },
              ]}
              placeholder="Full name"
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
              <Text style={[styles.errorText, { color: colors.text }]}>{nameError}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Email <Text style={styles.required}>*</Text>
            </Text>
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
              placeholder="email@example.com"
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
              <Text style={[styles.errorText, { color: colors.text }]}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Contact Number <Text style={styles.required}>*</Text>
            </Text>
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
              placeholder="Phone number"
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
              <Text style={[styles.errorText, { color: colors.text }]}>{contactError}</Text>
            ) : null}
          </View>

          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Why should we hire you? <Text style={styles.required}>*</Text>
            </Text>
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
              placeholder="Tell us about yourself (minimum 20 characters)"
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
              <Text style={[styles.errorText, { color: colors.text }]}>{whyHireYouError}</Text>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={handleSubmit}>
            <Text style={[styles.submitButtonText, { color: colors.surface }]}>Submit</Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  required: {
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 6,
  },
  submitButton: {
    height: 48,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  cancelButton: {
    height: 48,
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