import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import MenuCard from "../components/MenuCard";

export default function ProfessorScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [titulacao, setTitulacao] = useState("");
  const [tempo, setTempo] = useState("");
  const [professores, setProfessores] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const carregar = async () => {
    try {
      const res = await api.get("/professores");
      setProfessores(res.data);
    } catch (error) {
      setMessage("Erro ao carregar professores");
    }
  };

  const cadastrar = async () => {
    if (!nome || !titulacao || !tempo) {
      setMessage("Preencha todos os campos!");
      return;
    }

    try {
      await api.post("/professores", {
        nome,
        titulacao,
        tempoDocencia: Number(tempo),
      });
      setMessage("Professor cadastrado com sucesso!");
      setNome("");
      setTitulacao("");
      setTempo("");
      carregar();
    } catch (error) {
      setMessage("Erro ao cadastrar professor");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Cadastro de Professores"
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
            <Text style={styles.sectionTitle}>Cadastrar Novo Professor</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Titulação"
              value={titulacao}
              onChangeText={setTitulacao}
            />
            <TextInput
              style={styles.input}
              placeholder="Tempo de Docência (anos)"
              keyboardType="numeric"
              value={tempo}
              onChangeText={setTempo}
            />
            
            <Button 
              mode="contained" 
              onPress={cadastrar} 
              style={styles.button}
            >
              Cadastrar
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Professores Cadastrados</Text>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate("ListaProfessores")}
              style={styles.listButton}
              icon="format-list-bulleted"
            >
              Ver Lista Completa de Professores
            </Button>

            {professores.slice(0, 3).map((p) => (
              <MenuCard
                key={p.id}
                title={p.nome}
                subtitle={`${p.titulacao} • ${p.tempo_docencia || p.tempoDocencia} anos`}
                icon="school"
                onPress={() => {}}
                color="#FF9800"
              />
            ))}
            
            {professores.length > 3 && (
              <Text style={styles.moreItems}>
                +{professores.length - 3} professores cadastrados
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
    backgroundColor: "#fff",
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
