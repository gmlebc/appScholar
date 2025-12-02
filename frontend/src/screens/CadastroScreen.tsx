// screens/CadastroScreen.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Card, RadioButton } from "react-native-paper";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationBanner from "../components/Notification";

export default function CadastroScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("aluno");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      setMessage("Preencha todos os campos!");
      return;
    }

    if (senha.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", {
        nome,
        email,
        senha,
        perfil,
      });

      setMessage("Usuário cadastrado com sucesso!");
      
      // Login automático após cadastro
      setTimeout(async () => {
        try {
          const loginRes = await api.post("/auth/login", { email, senha });
          await AsyncStorage.setItem("token", loginRes.data.token);
          navigation.replace("Home", { perfil: loginRes.data.perfil });
        } catch (loginError) {
          navigation.navigate("Login");
        }
      }, 1500);

    } catch (err: any) {
      setMessage(err.response?.data?.erro || "Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  const getPerfilDescription = () => {
    switch (perfil) {
      case "admin":
        return "Acesso completo ao sistema";
      case "professor":
        return "Pode adicionar e gerenciar notas";
      case "aluno":
        return "Pode visualizar notas e situação acadêmica";
      default:
        return "";
    }
  };

  return (
    <View style={styles.container}>
      <NotificationBanner
        visible={!!message}
        message={message}
        onDismiss={() => setMessage("")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Title title="Criar Nova Conta" titleStyle={styles.title} />
          <Card.Content>
            <TextInput
              label="Nome Completo"
              mode="outlined"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />

            <TextInput
              label="E-mail"
              mode="outlined"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              label="Senha"
              mode="outlined"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
            />

            <Text style={styles.perfilLabel}>Tipo de Perfil</Text>
            
            <RadioButton.Group onValueChange={setPerfil} value={perfil}>
              <View style={styles.radioContainer}>
                <RadioButton.Item 
                  label="Aluno" 
                  value="aluno" 
                  position="leading"
                  style={styles.radioItem}
                />
                <RadioButton.Item 
                  label="Professor" 
                  value="professor" 
                  position="leading"
                  style={styles.radioItem}
                />
                <RadioButton.Item 
                  label="Administrador" 
                  value="admin" 
                  position="leading"
                  style={styles.radioItem}
                />
              </View>
            </RadioButton.Group>

            <Text style={styles.perfilDescription}>
              {getPerfilDescription()}
            </Text>

            <Button
              mode="contained"
              onPress={handleCadastro}
              loading={loading}
              style={styles.button}
            >
              Cadastrar
            </Button>

            <Button 
              mode="text" 
              onPress={() => navigation.navigate("Login")}
              style={styles.linkButton}
            >
              Já tem conta? Faça login
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    position: "absolute",
    top: 40,
    right: 15,
    zIndex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    padding: 10,
    borderRadius: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
  },
  perfilLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  radioContainer: {
    marginBottom: 10,
  },
  radioItem: {
    paddingVertical: 5,
  },
  perfilDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  button: {
    marginTop: 15,
  },
  linkButton: {
    marginTop: 10,
  },
});