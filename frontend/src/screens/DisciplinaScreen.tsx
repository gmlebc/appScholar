import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Button, Card } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import MenuCard from "../components/MenuCard";

export default function DisciplinaScreen({ navigation }: any) {
  const [nome, setNome] = useState("");
  const [cargaHoraria, setCargaHoraria] = useState("");
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  const carregar = async () => {
    try {
      const res = await api.get("/disciplinas");
      setDisciplinas(res.data);
    } catch (error) {
      setMessage("Erro ao carregar disciplinas");
    }
  };

  const cadastrar = async () => {
    if (!nome || !cargaHoraria) {
      setMessage("Preencha todos os campos!");
      return;
    }
    try {
      await api.post("/disciplinas", {
        nome,
        cargaHoraria: Number(cargaHoraria),
      });
      setMessage("Disciplina cadastrada com sucesso!");
      setNome("");
      setCargaHoraria("");
      carregar();
    } catch (error) {
      setMessage("Erro ao cadastrar disciplina");
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Cadastro de Disciplinas" 
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
            <Text style={styles.sectionTitle}>Cadastrar Nova Disciplina</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome da Disciplina"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Carga Horária"
              keyboardType="numeric"
              value={cargaHoraria}
              onChangeText={setCargaHoraria}
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
            <Text style={styles.sectionTitle}>Disciplinas Cadastradas</Text>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate("ListaDisciplinas")}
              style={styles.listButton}
              icon="format-list-bulleted"
            >
              Ver Lista Completa de Disciplinas
            </Button>

            {disciplinas.slice(0, 3).map((d) => (
              <MenuCard
                key={d.id}
                title={d.nome}
                subtitle={`${d.carga_horaria || d.cargaHoraria} horas`}
                icon="book-open-page-variant"
                onPress={() => {}}
                color="#2196F3"
              />
            ))}
            
            {disciplinas.length > 3 && (
              <Text style={styles.moreItems}>
                +{disciplinas.length - 3} disciplinas cadastradas
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
