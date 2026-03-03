import React from 'react';
import {
  Modal,
  Pressable,
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemeColors } from '../../constants/theme';
import { CountryData, COUNTRIES } from '../../constants/countries';

interface Props {
  visible: boolean;
  selectedCountry: CountryData;
  colors: ThemeColors;
  onSelect: (country: CountryData) => void;
  onClose: () => void;
}

const CountryPickerModal: React.FC<Props> = ({ visible, selectedCountry, colors, onSelect, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={(e) => e.stopPropagation()}>

        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>Select Country</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.5 : 1 }]}>
            <Feather name="x" size={18} color={colors.text} />
          </Pressable>
        </View>

        {/* List */}
        <FlatList
          data={COUNTRIES}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = selectedCountry.code === item.code;
            return (
              <Pressable
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: colors.border },
                  isSelected && { backgroundColor: colors.surface },
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => onSelect(item)}>
                <Text style={styles.flag}>{item.flag}</Text>
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.rowSub, { color: colors.textSecondary }]}>
                    {item.dialCode} · {item.minLength === item.maxLength ? `${item.minLength} digits` : `${item.minLength}–${item.maxLength} digits`}
                  </Text>
                </View>
                {isSelected && <Feather name="check" size={18} color={colors.text} />}
              </Pressable>
            );
          }}
        />

      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
  },
  flag: {
    fontSize: 26,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowSub: {
    fontSize: 12,
  },
});

export default CountryPickerModal;