import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { RootStackParamList } from "../../navigation/types";
import { useTheme } from "../../context/ThemeContext";
import { useSavedJobs } from "../../context/SavedJobsContext";
import { COUNTRIES, CountryData } from "../../constants/countries";
import {
  formatPhoneNumber,
  validateContactNumber,
  validateFirstDigit,
} from "../../utils/phoneUtils";
import CountryPickerModal from "./CountryPickerModal";
import { styles } from "./styles";
import AppModal, { ModalConfig } from "./AppModal";
import { NameField, EmailField, ContactField, WhyHireField } from "./FormFields";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ApplicationForm">;
  route: RouteProp<RootStackParamList, "ApplicationForm">;
};

const ApplicationFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [whyHireYou, setWhyHireYou] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(
    COUNTRIES[0],
  );
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [modal, setModal] = useState<ModalConfig | null>(null);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [whyHireYouError, setWhyHireYouError] = useState("");

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const contactInputRef = useRef<TextInput>(null);
  const whyHireYouInputRef = useRef<TextInput>(null);

  const { colors } = useTheme();
  const { markAsApplied } = useSavedJobs();
  const jobId = route.params?.jobId;
  const fromScreen = route.params?.fromScreen || "JobFinder";

  const goBack = () => {
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: fromScreen }] }),
    );
  };

  const showModal = (config: ModalConfig) => {
    Keyboard.dismiss();
    // Small delay so keyboard is fully gone before modal appears
    setTimeout(() => setModal(config), 100);
  };

  const handleContactChange = (text: string) => {
    setContactNumber(formatPhoneNumber(text, selectedCountry));
    if (contactError) setContactError("");
  };

  const handleCountrySelect = (country: CountryData) => {
    setSelectedCountry(country);
    setContactNumber("");
    setContactError("");
    setShowCountryPicker(false);
  };

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError("");
    setEmailError("");
    setContactError("");
    setWhyHireYouError("");

    if (!name.trim()) {
      setNameError("Required");
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setNameError("Letters only — no numbers or symbols");
      isValid = false;
    }

    if (!email.trim()) {
      setEmailError("Required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setEmailError("Invalid format");
      isValid = false;
    }

    if (!contactNumber.trim()) {
      setContactError("Required");
      isValid = false;
    } else if (!validateContactNumber(contactNumber, selectedCountry)) {
      const digits = contactNumber.replace(/\D/g, "");
      setContactError(
        digits.length < selectedCountry.minLength
          ? `Minimum ${selectedCountry.minLength} digits required`
          : `Maximum ${selectedCountry.maxLength} digits allowed`,
      );
      isValid = false;
    } else if (!validateFirstDigit(contactNumber, selectedCountry)) {
      setContactError(`Invalid number for ${selectedCountry.name}`);
      isValid = false;
    }

    if (!whyHireYou.trim()) {
      setWhyHireYouError("Required");
      isValid = false;
    } else if (whyHireYou.trim().length < 20) {
      setWhyHireYouError("Minimum 20 characters");
      isValid = false;
    } else if (whyHireYou.trim().length > 500) {
      setWhyHireYouError("Maximum 500 characters");
      isValid = false;
    }

    return isValid;
  };

  const clearForm = () => {
    setName("");
    setEmail("");
    setContactNumber("");
    setWhyHireYou("");
    setNameError("");
    setEmailError("");
    setContactError("");
    setWhyHireYouError("");
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showModal({
        icon: "alert-circle",
        title: "Incomplete Form",
        message: "Please fill in all fields correctly before submitting.",
        confirmLabel: "Got it",
        onConfirm: () => setModal(null),
      });
      return;
    }

    const fullPhone = `${selectedCountry.dialCode} ${contactNumber}`;
    showModal({
      icon: "send",
      title: "Submit Application?",
      message: `Name: ${name}\nEmail: ${email}\nContact: ${fullPhone}`,
      confirmLabel: "Submit",
      cancelLabel: "Cancel",
      onConfirm: () => {
        setModal(null);
        setTimeout(() => {
          setModal({
            icon: "check-circle",
            title: "Application Submitted!",
            message:
              "Your application has been submitted successfully. We will get back to you soon!",
            confirmLabel: "Okay",
            onConfirm: () => {
              setModal(null);
              if (jobId) markAsApplied(jobId);
              clearForm();
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: "JobFinder" }],
                }),
              );
            },
          });
        }, 300);
      },
      onCancel: () => setModal(null),
    });
  };

  const handleCancel = () => {
    const hasInput =
      name.trim() || email.trim() || contactNumber.trim() || whyHireYou.trim();
    if (hasInput) {
      showModal({
        icon: "x-circle",
        title: "Discard Changes?",
        message: "All entered information will be lost if you go back.",
        confirmLabel: "Discard",
        cancelLabel: "Keep Editing",
        onConfirm: () => {
          setModal(null);
          goBack();
        },
        onCancel: () => setModal(null),
      });
    } else {
      goBack();
    }
  };

  const scrollToInput = (yOffset: number) => {
    setTimeout(
      () => scrollViewRef.current?.scrollTo({ y: yOffset, animated: true }),
      100,
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "bottom"]}
    >
      <View
        style={[
          styles.nav,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable
          onPress={handleCancel}
          style={({ pressed }) => [
            styles.backBtn,
            { opacity: pressed ? 0.5 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={22} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back</Text>
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.text }]}>
          Application Form
        </Text>
        <View style={styles.navSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.keyboardAvoidingView,
          { backgroundColor: colors.background },
        ]}
        keyboardVerticalOffset={0}
        // Disable keyboard avoiding when modal is open so it doesn't fight the keyboard dismiss
        enabled={!modal}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Personal Information
          </Text>

          <NameField
            colors={colors}
            name={name}
            nameError={nameError}
            setName={setName}
            setNameError={setNameError}
            emailInputRef={emailInputRef}
            scrollToInput={scrollToInput}
          />

          <EmailField
            colors={colors}
            email={email}
            emailError={emailError}
            setEmail={setEmail}
            setEmailError={setEmailError}
            emailInputRef={emailInputRef}
            contactInputRef={contactInputRef}
            scrollToInput={scrollToInput}
          />

          <ContactField
            colors={colors}
            contactNumber={contactNumber}
            contactError={contactError}
            selectedCountry={selectedCountry}
            handleContactChange={handleContactChange}
            setShowCountryPicker={setShowCountryPicker}
            contactInputRef={contactInputRef}
            whyHireYouInputRef={whyHireYouInputRef}
            scrollToInput={scrollToInput}
          />

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Application Details
          </Text>

          <WhyHireField
            colors={colors}
            whyHireYou={whyHireYou}
            whyHireYouError={whyHireYouError}
            setWhyHireYou={setWhyHireYou}
            setWhyHireYouError={setWhyHireYouError}
            whyHireYouInputRef={whyHireYouInputRef}
            scrollToInput={scrollToInput}
          />

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.submitBtn,
                { backgroundColor: colors.text, opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={handleSubmit}
            >
              <Text style={[styles.submitBtnText, { color: colors.surface }]}>
                Submit Application
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.cancelBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
              onPress={handleCancel}
            >
              <Text style={[styles.cancelBtnText, { color: colors.text }]}>
                Cancel
              </Text>
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

      <AppModal modal={modal} colors={colors} />
    </SafeAreaView>
  );
};

export default ApplicationFormScreen;