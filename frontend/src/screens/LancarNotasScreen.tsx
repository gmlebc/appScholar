// screens/LancarNotasDisciplinaScreen.tsx - CORRIGIDO
import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import {
  Card,
  Text,
  Button,
  TextInput,
  DataTable,
  ActivityIndicator,
} from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import { NotasState, NotaInput } from "../types/notas"; // Importe os tipos

export default function LancarNotasDisciplinaScreen({
  route,
  navigation,
}: any) {
  const { disciplinaId, disciplinaNome } = route.params;

  const [alunos, setAlunos] = useState<any[]>([]);
  const [notas, setNotas] = useState<NotasState>({}); // Tipo correto aqui
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const carregarAlunos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/alunos");
      setAlunos(res.data);
      setMessage("");
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
      setMessage("Erro ao carregar lista de alunos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  const atualizarNota = (
    alunoId: number,
    campo: keyof NotaInput,
    valor: string
  ) => {
    setNotas((prev) => ({
      ...prev,
      [alunoId]: {
        ...prev[alunoId],
        [campo]: valor === "" ? undefined : parseFloat(valor),
      },
    }));
  };

  // FUNÇÃO CORRIGIDA - Agora com tipagem adequada
  const validarNotas = (): boolean => {
    for (const aluno of alunos) {
      const alunoNotas = notas[aluno.id];
      if (alunoNotas) {
        // Converter objeto em array de valores numéricos
        const valoresNotas: number[] = [
          alunoNotas.nota1,
          alunoNotas.nota2,
          alunoNotas.nota3,
          alunoNotas.nota4,
          alunoNotas.nota5,
        ].filter(
          (nota): nota is number =>
            nota !== undefined &&
            nota !== null &&
            !isNaN(nota) &&
            nota >= 0 &&
            nota <= 10
        );

        if (valoresNotas.length > 0) return true;
      }
    }
    return false;
  };

  const calcularMedia = (alunoId: number): number => {
    const alunoNotas = notas[alunoId];
    if (!alunoNotas) return 0;

    // Usar a mesma lógica de filtragem tipada
    const notasValidas: number[] = [
      alunoNotas.nota1,
      alunoNotas.nota2,
      alunoNotas.nota3,
      alunoNotas.nota4,
      alunoNotas.nota5,
    ].filter(
      (nota): nota is number =>
        nota !== undefined && nota !== null && !isNaN(nota) && nota >= 0
    );

    if (notasValidas.length === 0) return 0;

    const soma = notasValidas.reduce((acc, nota) => acc + nota, 0);
    return parseFloat((soma / notasValidas.length).toFixed(2));
  };

  const getSituacao = (media: number) => {
    if (media >= 7.0) return { texto: "Aprovado", cor: "#4CAF50" };
    if (media >= 5.0) return { texto: "Recuperação", cor: "#FF9800" };
    return { texto: "Reprovado", cor: "#F44336" };
  };

  const lancarNotas = async () => {
    if (!validarNotas()) {
      setMessage("Informe pelo menos uma nota válida para algum aluno");
      return;
    }

    setSubmitting(true);
    try {
      let sucessos = 0;
      let erros = 0;

      for (const aluno of alunos) {
        const alunoNotas = notas[aluno.id];
        if (alunoNotas && Object.keys(alunoNotas).length > 0) {
          try {
            await api.post("/nota", {
              alunoMatricula: aluno.matricula,
              disciplinaId: disciplinaId,
              nota1: alunoNotas.nota1 || null,
              nota2: alunoNotas.nota2 || null,
              nota3: alunoNotas.nota3 || null,
              nota4: alunoNotas.nota4 || null,
              nota5: alunoNotas.nota5 || null,
            });
            sucessos++;
          } catch (error) {
            console.error(
              `Erro ao lançar notas do aluno ${aluno.nome}:`,
              error
            );
            erros++;
          }
        }
      }

      setMessage(`Notas lançadas! ${sucessos} sucesso(s), ${erros} erro(s)`);

      if (erros === 0) {
        setTimeout(() => navigation.goBack(), 2000);
      }
    } catch (error) {
      console.error("Erro geral ao lançar notas:", error);
      setMessage("Erro ao lançar notas");
    } finally {
      setSubmitting(false);
    }
  };

  // Resto do componente permanece igual...
  return (
    <View style={styles.container}>
      <CustomHeader
        title={`Lançar Notas - ${disciplinaNome}`}
        showLogout={false}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />

      <NotificationBanner
        visible={!!message}
        message={message}
        onDismiss={() => setMessage("")}
      />

      <ScrollView style={styles.scrollView} horizontal={true}>
        <ScrollView style={styles.horizontalScroll}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.title}>Lançar Notas - {disciplinaNome}</Text>
              <Text style={styles.subtitle}>
                {alunos.length} alunos encontrados
              </Text>

              {loading ? (
                <ActivityIndicator size="large" style={styles.loading} />
              ) : (
                <>
                  <DataTable style={styles.table}>
                    <DataTable.Header>
                      <DataTable.Title style={styles.colAluno}>
                        <Text style={styles.headerText}>Aluno</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colNota}>
                        <Text style={styles.headerText}>N1</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colNota}>
                        <Text style={styles.headerText}>N2</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colNota}>
                        <Text style={styles.headerText}>N3</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colNota}>
                        <Text style={styles.headerText}>N4</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colNota}>
                        <Text style={styles.headerText}>N5</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colMedia}>
                        <Text style={styles.headerText}>Média</Text>
                      </DataTable.Title>
                      <DataTable.Title style={styles.colSituacao}>
                        <Text style={styles.headerText}>Situação</Text>
                      </DataTable.Title>
                    </DataTable.Header>

                    {alunos.map((aluno) => {
                      const media = calcularMedia(aluno.id);
                      const situacao = getSituacao(media);

                      return (
                        <DataTable.Row key={aluno.id}>
                          <DataTable.Cell style={styles.colAluno}>
                            <Text style={styles.alunoNome}>{aluno.nome}</Text>
                            <Text style={styles.alunoMatricula}>
                              {aluno.matricula}
                            </Text>
                          </DataTable.Cell>

                          {[1, 2, 3, 4, 5].map((num) => (
                            <DataTable.Cell key={num} style={styles.colNota}>
                              <TextInput
                                style={styles.notaInput}
                                keyboardType="numeric"
                                value={
                                  notas[aluno.id]?.[
                                    `nota${num}` as keyof NotaInput
                                  ]?.toString() || ""
                                }
                                onChangeText={(text) =>
                                  atualizarNota(
                                    aluno.id,
                                    `nota${num}` as keyof NotaInput,
                                    text
                                  )
                                }
                                maxLength={4}
                                dense
                              />
                            </DataTable.Cell>
                          ))}

                          <DataTable.Cell style={styles.colMedia}>
                            <Text
                              style={[
                                styles.mediaText,
                                { color: media > 0 ? "#333" : "#999" },
                              ]}
                            >
                              {media > 0 ? media : "-"}
                            </Text>
                          </DataTable.Cell>

                          <DataTable.Cell style={styles.colSituacao}>
                            <Text
                              style={[
                                styles.situacaoText,
                                { color: media > 0 ? situacao.cor : "#999" },
                              ]}
                            >
                              {media > 0 ? situacao.texto : "-"}
                            </Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}
                  </DataTable>

                  <Button
                    mode="contained"
                    onPress={lancarNotas}
                    loading={submitting}
                    disabled={submitting}
                    style={styles.submitButton}
                    icon="send"
                  >
                    Lançar Notas
                  </Button>

                  <Text style={styles.instructions}>
                    • Digite notas de 0 a 10{"\n"}• A média e situação são
                    calculadas automaticamente{"\n"}• Campos vazios serão
                    ignorados
                  </Text>
                </>
              )}
            </Card.Content>
          </Card>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

// Estilos permanecem os mesmos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  horizontalScroll: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
    minWidth: 800,
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
    minWidth: 700,
  },
  colAluno: {
    width: 150,
    minWidth: 150,
  },
  colNota: {
    width: 70,
    minWidth: 70,
  },
  colMedia: {
    width: 60,
    minWidth: 60,
  },
  colSituacao: {
    width: 100,
    minWidth: 100,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  alunoNome: {
    fontWeight: "500",
    fontSize: 12,
  },
  alunoMatricula: {
    fontSize: 10,
    color: "#666",
  },
  notaInput: {
    height: 35,
    fontSize: 12,
    textAlign: "center",
    backgroundColor: "#f5f5f5",
  },
  mediaText: {
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
  situacaoText: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  instructions: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 16,
  },
  loading: {
    marginVertical: 20,
  },
});
