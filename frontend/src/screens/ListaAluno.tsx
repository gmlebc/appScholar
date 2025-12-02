
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DataTable, Card, Text, ActivityIndicator } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";

export default function ListaAlunosScreen({ navigation }: any) {
  const [alunos, setAlunos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const carregarAlunos = async () => {
    try {
      const res = await api.get("/alunos");
      setAlunos(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Erro ao carregar lista de alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Lista de Alunos" 
        showLogout={false}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />

      <NotificationBanner
        visible={!!message}
        message={message}
        onDismiss={() => setMessage("")}
      />

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              Alunos Cadastrados ({alunos.length})
            </Text>

            {loading ? (
              <ActivityIndicator size="large" style={styles.loading} />
            ) : (
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.columnNome}>Nome</DataTable.Title>
                  <DataTable.Title style={styles.columnMatricula}>Matrícula</DataTable.Title>
                  <DataTable.Title style={styles.columnCurso}>Curso</DataTable.Title>
                </DataTable.Header>

                {alunos.map((aluno) => (
                  <DataTable.Row key={aluno.id}>
                    <DataTable.Cell style={styles.columnNome}>
                      {aluno.nome}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnMatricula}>
                      {aluno.matricula}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnCurso}>
                      {aluno.curso}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

                {alunos.length === 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={styles.emptyText}>
                        Nenhum aluno cadastrado
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              </DataTable>
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
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  table: {
    marginHorizontal: -8,
  },
  columnNome: {
    flex: 2,
  },
  columnMatricula: {
    flex: 1.5,
  },
  columnCurso: {
    flex: 1.5,
  },
  loading: {
    marginVertical: 20,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    padding: 20,
  },
});