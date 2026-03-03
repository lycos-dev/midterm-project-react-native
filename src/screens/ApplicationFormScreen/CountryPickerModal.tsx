import React from 'react';
import { Modal, Pressable, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeColors } from '../../constants/theme';
import { CountryData, COUNTRIES } from '../../constants/countries';
import { styles } from './styles';

interface Props {
  visible: boolean;
  selectedCountry: CountryData;
  colors: ThemeColors;
  onSelect: (country: CountryData) => void;
  onClose: () => void;
}

const CountryPickerModal: React.FC<Props> = ({ visible, selectedCountry, colors, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <Pressable style={[styles.modalContent, { backgroundColor: colors.surface }]} onPress={(e) => e.stopPropagation()}>
        <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Select Country</Text>
          <Pressable onPress={onClose}>
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
                selectedCountry.code === country.code && { backgroundColor: colors.background },
              ]}
              onPress={() => onSelect(country)}>
              <View style={styles.countryItemContent}>
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={[styles.countryName, { color: colors.text }]}>{country.name}</Text>
                  <Text style={[styles.countryDetails, { color: colors.textSecondary }]}>
                    {country.code} {country.dialCode} •{' '}
                    {country.minLength === country.maxLength
                      ? `${country.minLength} digits`
                      : `${country.minLength}-${country.maxLength} digits`}
                  </Text>
                </View>
              </View>
              {selectedCountry.code === country.code && <Feather name="check" size={20} color={colors.text} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Pressable>
    </Pressable>
  </Modal>
);

export default CountryPickerModal;
