import React from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CountryData } from "../../constants/countries";
import { styles } from "./styles";

type RenderFieldProps = {
  label: string;
  error: string;
  colors: any;
  input: React.ReactNode;
};

export const RenderField: React.FC<RenderFieldProps> = ({ label, error, colors, input }) => (
  <View style={styles.formGroup}>
    <View style={styles.labelRow}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      {error ? (
        <Text style={[styles.errorInline, { color: colors.textSecondary }]}>
          {error}
        </Text>
      ) : null}
    </View>
    {input}
  </View>
);

type NameFieldProps = {
  colors: any;
  name: string;
  nameError: string;
  setName: (v: string) => void;
  setNameError: (v: string) => void;
  emailInputRef: React.RefObject<TextInput | null>;
  scrollToInput: (y: number) => void;
};

export const NameField: React.FC<NameFieldProps> = ({
  colors, name, nameError, setName, setNameError, emailInputRef, scrollToInput,
}) => (
  <RenderField
    label="Full Name"
    error={nameError}
    colors={colors}
    input={
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: nameError ? colors.text : colors.border,
          },
        ]}
        placeholder="John Doe"
        placeholderTextColor={colors.placeholder}
        value={name}
        onChangeText={(t) => {
          const lettersOnly = t.replace(/[^a-zA-Z\s]/g, "");
          setName(lettersOnly);
          if (t !== lettersOnly) {
            setNameError("Letters only — no numbers or symbols");
          } else if (lettersOnly === "") {
            setNameError("");
          } else {
            setNameError("");
          }
        }}
        autoCapitalize="words"
        keyboardType="default"
        returnKeyType="next"
        onSubmitEditing={() => emailInputRef.current?.focus()}
        onFocus={() => scrollToInput(0)}
      />
    }
  />
);

type EmailFieldProps = {
  colors: any;
  email: string;
  emailError: string;
  setEmail: (v: string) => void;
  setEmailError: (v: string) => void;
  emailInputRef: React.RefObject<TextInput | null>;
  contactInputRef: React.RefObject<TextInput | null>;
  scrollToInput: (y: number) => void;
};

export const EmailField: React.FC<EmailFieldProps> = ({
  colors, email, emailError, setEmail, setEmailError,
  emailInputRef, contactInputRef, scrollToInput,
}) => (
  <RenderField
    label="Email Address"
    error={emailError}
    colors={colors}
    input={
      <TextInput
        ref={emailInputRef}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: emailError ? colors.text : colors.border,
          },
        ]}
        placeholder="john@example.com"
        placeholderTextColor={colors.placeholder}
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          if (emailError) setEmailError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
        onSubmitEditing={() => contactInputRef.current?.focus()}
        onFocus={() => scrollToInput(120)}
      />
    }
  />
);

type ContactFieldProps = {
  colors: any;
  contactNumber: string;
  contactError: string;
  selectedCountry: CountryData;
  handleContactChange: (text: string) => void;
  setShowCountryPicker: (v: boolean) => void;
  contactInputRef: React.RefObject<TextInput | null>;
  whyHireYouInputRef: React.RefObject<TextInput | null>;
  scrollToInput: (y: number) => void;
};

export const ContactField: React.FC<ContactFieldProps> = ({
  colors, contactNumber, contactError, selectedCountry,
  handleContactChange, setShowCountryPicker,
  contactInputRef, whyHireYouInputRef, scrollToInput,
}) => (
  <RenderField
    label="Contact Number"
    error={contactError}
    colors={colors}
    input={
      <View>
        <Pressable
          onPress={() => setShowCountryPicker(true)}
          style={[
            styles.countryButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
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
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: contactError ? colors.text : colors.border,
            },
          ]}
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
    }
  />
);

type WhyHireFieldProps = {
  colors: any;
  whyHireYou: string;
  whyHireYouError: string;
  setWhyHireYou: (v: string) => void;
  setWhyHireYouError: (v: string) => void;
  whyHireYouInputRef: React.RefObject<TextInput | null>;
  scrollToInput: (y: number) => void;
};

export const WhyHireField: React.FC<WhyHireFieldProps> = ({
  colors, whyHireYou, whyHireYouError, setWhyHireYou,
  setWhyHireYouError, whyHireYouInputRef, scrollToInput,
}) => (
  <RenderField
    label="Why should we hire you?"
    error={whyHireYouError}
    colors={colors}
    input={
      <>
        <TextInput
          ref={whyHireYouInputRef}
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: whyHireYouError ? colors.text : colors.border,
            },
          ]}
          placeholder="Tell us about your skills and experience..."
          placeholderTextColor={colors.placeholder}
          value={whyHireYou}
          onChangeText={(t) => {
            setWhyHireYou(t);
            if (t.trim().length > 500) {
              setWhyHireYouError("Maximum 500 characters reached");
            } else {
              setWhyHireYouError("");
            }
          }}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          onFocus={() => scrollToInput(500)}
        />
        <Text
          style={[
            styles.charCount,
            {
              color:
                whyHireYou.length < 20 && whyHireYou.length > 0
                  ? "#FF3B30"
                  : whyHireYou.length > 500
                    ? "#FF3B30"
                    : colors.textSecondary,
            },
          ]}
        >
          {whyHireYou.length} / 500
        </Text>
      </>
    }
  />
);