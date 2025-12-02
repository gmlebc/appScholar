
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DataTable, Card, Text, ActivityIndicator } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";

export default function ListaDisciplinasScreen({ navigation }: any) {
  const [disciplinas, setDisciplinas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const carregarDisciplinas = async () => {
    try {
      const res = await api.get("/disciplinas");
      setDisciplinas(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Erro ao carregar lista de disciplinas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Lista de Disciplinas" 
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
              Disciplinas Cadastradas ({disciplinas.length})
            </Text>

            {loading ? (
              <ActivityIndicator size="large" style={styles.loading} />
            ) : (
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.columnNome}>Nome da Disciplina</DataTable.Title>
                  <DataTable.Title style={styles.columnCarga}>Carga Horária</DataTable.Title>
                </DataTable.Header>

                {disciplinas.map((disciplina) => (
                  <DataTable.Row key={disciplina.id}>
                    <DataTable.Cell style={styles.columnNome}>
                      {disciplina.nome}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnCarga}>
                      {disciplina.carga_horaria || disciplina.cargaHoraria} horas
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

                {disciplinas.length === 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={styles.emptyText}>
                        Nenhuma disciplina cadastrada
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
  columnCarga: {
    flex: 1,
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