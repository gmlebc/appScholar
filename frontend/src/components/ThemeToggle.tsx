import React from "react";
import { IconButton, useTheme } from "react-native-paper";

export default function ThemeToggle({ toggleTheme }: any) {
  const theme = useTheme();

  return (
    <IconButton
      icon={theme.dark ? "weather-sunny" : "moon-waxing-crescent"}
      size={26}
      onPress={toggleTheme}
      accessibilityLabel="Alternar tema"
    />
  );
}
