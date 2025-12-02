import React from "react";
import { Snackbar } from "react-native-paper";

export default function AlertMessage({ visible, onDismiss, message }: any) {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={3000}
      action={{ label: "Fechar", onPress: onDismiss }}
    >
      {message}
    </Snackbar>
  );
}
