// screens/HomeScreen.tsx
import React, { useState } from "react";
import { Text, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import CustomHeader from "../components/Header";
import MenuCard from "../components/MenuCard";
import NotificationBanner from "../components/Notification";

export default function HomeScreen({ navigation, toggleTheme }: any) {
  const [showBanner, setShowBanner] = useState(true);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace("Login");
  };

  const canAccess = (perfis: string[]) => {
    return user && perfis.includes(user.perfil);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CustomHeader 
        title="AppScholar" 
        showLogout={true}
        onLogout={handleLogout}
      />
      
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>Bem-vindo, {user?.nome}!</Text>
        <Text style={styles.perfil}>Perfil: {user?.perfil}</Text>

        {/* Menu baseado no perfil */}
        {canAccess(["admin", "professor"]) && (
          <MenuCard
            title="Gerenciar Alunos"
            subtitle="Cadastrar e visualizar alunos"
            icon="account-group"
            onPress={() => navigation.navigate("AlunoScreen")}
            color="#4CAF50" // Verde
          />
        )}

        {canAccess(["admin"]) && (
          <MenuCard
            title="Gerenciar Professores"
            subtitle="Cadastrar e visualizar professores"
            icon="school"
            onPress={() => navigation.navigate("ProfessorScreen")}
            color="#FF9800" // Laranja
          />
        )}

        {canAccess(["admin"]) && (
          <MenuCard
            title="Gerenciar Disciplinas"
            subtitle="Cadastrar e visualizar disciplinas"
            icon="book-open-page-variant"
            onPress={() => navigation.navigate("DisciplinaScreen")}
            color="#2196F3" // Azul
          />
        )}

        <MenuCard
          title="Ver Boletim"
          subtitle="Consultar notas e situação acadêmica"
          icon="file-document-outline"
          onPress={() => navigation.navigate("BoletimScreen")}
          color="#9C27B0" // Roxo
        />

        <MenuCard
          title="Avisos Acadêmicos"
          subtitle="Ver avisos e comunicados importantes"
          icon="bell-alert"
          onPress={() => navigation.navigate("ListaAvisos")}
          color="#FF5722" // Vermelho-Laranja
          showBadge={true}
        />

        <NotificationBanner
          visible={showBanner}
          message="Bem-vindo de volta! Há atualizações recentes no sistema."
          onDismiss={() => setShowBanner(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    padding: 20,
  },
  welcome: {
    fontSize: 22,
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  perfil: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
});