import React from "react";
import { TextInput } from "react-native-paper";

export default function InputField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  icon,
  keyboardType,
}: any) {
  return (
    <TextInput
      label={label}
      value={value}
      mode="outlined"
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      left={icon ? <TextInput.Icon icon={icon} /> : undefined}
      keyboardType={keyboardType}
      style={{ marginBottom: 12 }}
    />
  );
}
