// screens/BoletimScreen.tsx
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Card, DataTable } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";

export default function BoletimScreen({ navigation }: any) {
  const [idAluno, setIdAluno] = useState("");
  const [aluno, setAluno] = useState<any>(null);
  const [boletim, setBoletim] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const buscarBoletim = async () => {
    if (!idAluno) {
      setMessage("Informe o ID do aluno!");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/boletim/${idAluno}`);
      
      // Supondo que a API retorna { aluno: { ... }, disciplinas: [...] }
      if (res.data.aluno && res.data.disciplinas) {
        setAluno(res.data.aluno);
        setBoletim(res.data.disciplinas);
        setMessage("");
      } else {
        // Se a estrutura for diferente, ajuste conforme sua API
        setAluno({ nome: "Aluno", matricula: idAluno, curso: "Curso" });
        setBoletim(res.data);
        if (res.data.length === 0) {
          setMessage("Nenhum boletim encontrado para esse aluno.");
        } else {
          setMessage("");
        }
      }
    } catch (error) {
      setMessage("Erro ao buscar boletim do aluno.");
      setAluno(null);
      setBoletim([]);
    } finally {
      setLoading(false);
    }
  };

  const calcularMedia = (notas: number[]) => {
    if (!notas || notas.length === 0) return 0;
    const soma = notas.reduce((acc, nota) => acc + nota, 0);
    return parseFloat((soma / notas.length).toFixed(1)); // Corrigido: retorna número
  };

  const getSituacao = (media: number) => {
    return media >= 6 ? "Aprovado" : "Reprovado";
  };

  const getSituacaoColor = (media: number) => {
    return media >= 6 ? "#4CAF50" : "#F44336";
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Boletim Acadêmico" 
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
        {/* Card de Consulta */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Consultar Boletim</Text>
            
            <View style={styles.searchContainer}>
              <TextInput
                label="ID do Aluno"
                mode="outlined"
                value={idAluno}
                onChangeText={setIdAluno}
                style={styles.input}
                keyboardType="numeric"
              />
              <Button
                mode="contained"
                onPress={buscarBoletim}
                loading={loading}
                style={styles.searchButton}
                icon="magnify" // Ícone de lupa
                compact
              >
                {""} {/* Texto vazio para evitar erro de children */}
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Card com Resultados */}
        {aluno && boletim.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>
                Boletim de {aluno.nome || "Aluno"}
              </Text>
              
              {aluno.matricula && aluno.curso && (
                <Text style={styles.alunoInfo}>
                  Matrícula: {aluno.matricula} | Curso: {aluno.curso}
                </Text>
              )}

              <DataTable style={styles.table}>
                <DataTable.Header>
                  <DataTable.Title style={styles.columnDisciplina}>
                    Disciplina
                  </DataTable.Title>
                  <DataTable.Title numeric style={styles.columnNota}>
                    Notas
                  </DataTable.Title>
                  <DataTable.Title numeric style={styles.columnMedia}>
                    Média
                  </DataTable.Title>
                  <DataTable.Title style={styles.columnSituacao}>
                    Situação
                  </DataTable.Title>
                </DataTable.Header>

                {boletim.map((disciplina, index) => {
                  // Ajuste conforme a estrutura da sua API
                  const notas = disciplina.notas || [disciplina.nota1, disciplina.nota2, disciplina.nota3].filter((n: any) => n !== undefined && n !== null);
                  const media = calcularMedia(notas); // Já é número agora
                  const situacao = getSituacao(media);
                  const situacaoColor = getSituacaoColor(media);

                  return (
                    <DataTable.Row key={index}>
                      <DataTable.Cell style={styles.columnDisciplina}>
                        {disciplina.nome || disciplina.Disciplina?.nome || `Disciplina ${index + 1}`}
                      </DataTable.Cell>
                      <DataTable.Cell numeric style={styles.columnNota}>
                        {notas.length > 0 ? notas.join(", ") : "N/A"}
                      </DataTable.Cell>
                      <DataTable.Cell numeric style={styles.columnMedia}>
                        <Text style={styles.mediaText}>
                          {media}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={styles.columnSituacao}>
                        <Text style={[styles.situacaoText, { color: situacaoColor }]}>
                          {situacao}
                        </Text>
                      </DataTable.Cell>
                    </DataTable.Row>
                  );
                })}
              </DataTable>
            </Card.Content>
          </Card>
        )}

        {/* Mensagem quando não há dados */}
        {aluno && boletim.length === 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Disciplinas e Notas</Text>
              <Text style={styles.noData}>
                Nenhuma disciplina encontrada para este aluno.
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Card inicial quando não há busca */}
        {!aluno && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Disciplinas e Notas</Text>
              <Text style={styles.placeholderText}>
                Digite o ID do aluno e clique na lupa para consultar o boletim.
              </Text>
            </Card.Content>
          </Card>
        )}
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
  },
  searchButton: {
    minWidth: 60,
    height: 56, // mesma altura do TextInput
  },
  alunoInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    fontStyle: "italic",
  },
  table: {
    marginTop: 10,
  },
  columnDisciplina: {
    flex: 2,
  },
  columnNota: {
    flex: 1.5,
  },
  columnMedia: {
    flex: 1,
  },
  columnSituacao: {
    flex: 1,
  },
  mediaText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  situacaoText: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
    marginVertical: 20,
  },
  placeholderText: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginVertical: 20,
  },
});