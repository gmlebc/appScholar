import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Card,
  Text,
  Button,
  DataTable,
  ActivityIndicator,
} from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import { useAuth } from "../hooks/useAuth";

export default function LancarNotasScreen({ navigation }: any) {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const carregarDisciplinasProfessor = async () => {
    try {
      setLoading(true);
      // Buscar disciplinas do professor logado
      const res = await api.get(`/disciplina/professor/${user?.id}`);
      setDisciplinas(res.data);
      setMessage("");
    } catch (error) {
      console.error("Erro ao carregar disciplinas:", error);
      setMessage("Erro ao carregar suas disciplinas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDisciplinasProfessor();
  }, []);

  const handleLancarNotas = (disciplinaId: number, disciplinaNome: string) => {
    navigation.navigate("LancarNotasDisciplinaScreen", {
      disciplinaId,
      disciplinaNome,
    });
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Lançar Notas"
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
              Minhas Disciplinas ({disciplinas.length})
            </Text>
            <Text style={styles.subtitle}>
              Selecione uma disciplina para lançar notas
            </Text>

            {loading ? (
              <ActivityIndicator size="large" style={styles.loading} />
            ) : (
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.columnDisciplina}>
                    Disciplina
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnCarga}>
                    Carga Horária
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnAcoes}>
                    Ações
                  </DataTable.Title>
                </DataTable.Header>

                {disciplinas.map((disciplina) => (
                  <DataTable.Row key={disciplina.id}>
                    <DataTable.Cell style={styles.columnDisciplina}>
                      <Text style={styles.disciplinaNome}>
                        {disciplina.nome}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnCarga}>
                      {disciplina.cargaHoraria || disciplina.carga_horaria} h
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnAcoes}>
                      <Button
                        mode="contained"
                        compact
                        onPress={() =>
                          handleLancarNotas(disciplina.id, disciplina.nome)
                        }
                        style={styles.button}
                        icon="note-plus"
                      >
                        Notas
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

                {disciplinas.length === 0 && !loading && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={styles.emptyText}>
                        Nenhuma disciplina atribuída a você
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
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  table: {
    marginHorizontal: -8,
  },
  columnDisciplina: {
    flex: 2,
  },
  columnCarga: {
    flex: 1,
  },
  columnAcoes: {
    flex: 1,
  },
  disciplinaNome: {
    fontWeight: "500",
  },
  button: {
    marginVertical: 2,
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
