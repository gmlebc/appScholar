import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import MenuCard from "../components/MenuCard";

export default function AlunoScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [curso, setCurso] = useState("");
  const [alunos, setAlunos] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const carregarAlunos = async () => {
    try {
      const res = await api.get("/alunos");
      setAlunos(res.data);
    } catch (error) {
      setMessage("Erro ao carregar alunos");
    }
  };

  const cadastrarAluno = async () => {
    if (!nome || !matricula || !curso) {
      setMessage("Preencha todos os campos!");
      return;
    }
    try {
      await api.post("/alunos", { nome, matricula, curso });
      setMessage("Aluno cadastrado com sucesso!");
      setNome("");
      setMatricula("");
      setCurso("");
      carregarAlunos();
    } catch (error) {
      setMessage("Erro ao cadastrar aluno");
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Cadastro de Alunos" 
        showLogout={false}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />

      <NotificationBanner
        visible={!!message}
        message={message}
        onDismiss={() => setMessage("")}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Cadastrar Novo Aluno</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Matrícula"
              value={matricula}
              onChangeText={setMatricula}
            />
            <TextInput
              style={styles.input}
              placeholder="Curso"
              value={curso}
              onChangeText={setCurso}
            />

            <Button 
              mode="contained" 
              onPress={cadastrarAluno}
              style={styles.button}
            >
              Cadastrar Aluno
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Alunos Cadastrados</Text>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate("ListaAlunos")}
              style={styles.listButton}
              icon="format-list-bulleted"
            >
              Ver Lista Completa de Alunos
            </Button>

            {alunos.slice(0, 3).map((aluno) => (
              <MenuCard
                key={aluno.id}
                title={aluno.nome}
                subtitle={`${aluno.curso} • ${aluno.matricula}`}
                icon="account"
                onPress={() => {}}
                color="#4CAF50"
              />
            ))}
            
            {alunos.length > 3 && (
              <Text style={styles.moreItems}>
                +{alunos.length - 3} alunos cadastrados
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  button: {
    marginTop: 10,
  },
  listButton: {
    marginBottom: 15,
  },
  moreItems: {
    textAlign: "center",
    color: "#2196F3",
    marginTop: 10,
    fontStyle: "italic",
  },
});