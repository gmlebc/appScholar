import React, { useState } from "react";
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import AppNavigator from "./navigation/AppNavigation";

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const theme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <AppNavigator toggleTheme={() => setIsDark(!isDark)} />
    </PaperProvider>
  );
}