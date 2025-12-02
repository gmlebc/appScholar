
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { DataTable, Card, Text, ActivityIndicator } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";

export default function ListaProfessoresScreen({ navigation }: any) {
  const [professores, setProfessores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const carregarProfessores = async () => {
    try {
      const res = await api.get("/professores");
      setProfessores(res.data);
      setMessage("");
    } catch (error) {
      setMessage("Erro ao carregar lista de professores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProfessores();
  }, []);

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Lista de Professores"
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
              Professores Cadastrados ({professores.length})
            </Text>

            {loading ? (
              <ActivityIndicator size="large" style={styles.loading} />
            ) : (
              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.columnNome}>
                    Nome
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnTitulacao}>
                    Titulação
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnTempo}>
                    Tempo de Docência
                  </DataTable.Title>
                </DataTable.Header>

                {professores.map((professor) => (
                  <DataTable.Row key={professor.id}>
                    <DataTable.Cell style={styles.columnNome}>
                      {professor.nome}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnTitulacao}>
                      {professor.titulacao}
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.columnTempo}>
                      {professor.tempo_docencia || professor.tempoDocencia} anos
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}

                {professores.length === 0 && (
                  <DataTable.Row>
                    <DataTable.Cell>
                      <Text style={styles.emptyText}>
                        Nenhum professor cadastrado
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
  columnTitulacao: {
    flex: 1.5,
  },
  columnTempo: {
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
