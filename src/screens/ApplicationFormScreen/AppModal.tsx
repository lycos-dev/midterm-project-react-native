import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./styles";

export type ModalConfig = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type Props = {
  modal: ModalConfig | null;
  colors: any;
};

const AppModal: React.FC<Props> = ({ modal, colors }) => (
  <Modal
    visible={!!modal}
    transparent
    animationType="fade"
    onRequestClose={() =>
      modal?.onCancel ? modal.onCancel() : modal?.onConfirm()
    }
  >
    <Pressable
      style={styles.modalOverlay}
      onPress={() => (modal?.onCancel ? modal.onCancel() : null)}
    >
      <Pressable
        style={[
          styles.modalCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={(e) => e.stopPropagation()}
      >
        <View
          style={[
            styles.modalIconWrap,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Feather
            name={modal?.icon ?? "info"}
            size={28}
            color={colors.text}
          />
        </View>

        <Text style={[styles.modalTitle, { color: colors.text }]}>
          {modal?.title}
        </Text>
        <Text
          style={[styles.modalMessage, { color: colors.textSecondary }]}
        >
          {modal?.message}
        </Text>

        <View style={styles.modalActions}>
          {modal?.cancelLabel && (
            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.5 : 1,
                },
              ]}
              onPress={modal.onCancel}
            >
              <Text style={[styles.modalBtnText, { color: colors.text }]}>
                {modal.cancelLabel}
              </Text>
            </Pressable>
          )}
          <Pressable
            style={({ pressed }) => [
              styles.modalBtn,
              styles.modalBtnPrimary,
              { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={modal?.onConfirm}
          >
            <Text style={[styles.modalBtnText, { color: colors.surface }]}>
              {modal?.confirmLabel}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  </Modal>
);

export default AppModal;