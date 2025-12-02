import React from "react";
import {View, StyleSheet, Text} from "react-native";
import { Button } from "react-native-paper";

interface CustomHeaderProps {
  title: string;
  showLogout?: boolean;
  onLogout?: () => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function CustomHeader({ 
  title, 
  showLogout = false, 
  onLogout,
  showBackButton = false,
  onBack 
}: CustomHeaderProps) {
  return (
    <View style={styles.header}>
      {/* Lado esquerdo - Botão Voltar */}
      <View style={styles.headerLeft}>
        {showBackButton && (
          <Button 
            icon="arrow-left" 
            onPress={onBack}
            mode="text"
            textColor="#007AFF"
          >
            Voltar
          </Button>
        )}
      </View>
      
      {/* Centro - Título */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Lado direito - Toggle de Tema e/ou Sair */}
      <View style={styles.headerRight}>
        {showLogout && (
          <Button 
            icon="logout" 
            onPress={onLogout}
            mode="text"
            textColor="#FF3B30"
            style={styles.logoutButton}
          >
            Sair
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerLeft: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerRight: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 2,
  },
  logoutButton: {
    marginLeft: 8,
  },
});
