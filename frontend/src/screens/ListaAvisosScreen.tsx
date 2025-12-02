import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Card, Text, ActivityIndicator, Button, Chip, FAB } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import { Aviso } from "../types/avisos";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ListaAvisosScreen({ navigation }: any) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState("");
  const [userPerfil, setUserPerfil] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);

  const carregarAvisos = async () => {
    try {
      const params: any = {};
      if (filtroTipo) {
        params.tipo = filtroTipo;
      }
      
      const res = await api.get("/avisos", { params });
      setAvisos(res.data);
      setMessage("");
    } catch (error: any) {
      console.error("Erro ao carregar avisos:", error);
      setMessage(error.response?.data?.error || "Erro ao carregar avisos");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const perfil = await AsyncStorage.getItem("userPerfil");
      if (perfil) {
        setUserPerfil(perfil);
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarAvisos();
  }, [filtroTipo]);

  useFocusEffect(
    useCallback(() => {
      loadUserProfile();
      carregarAvisos();
    }, [filtroTipo])
  );

  const formatarData = (data: string) => {
    const date = new Date(data);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCorTipo = (tipo: string) => {
    switch (tipo) {
      case "geral": return "#2196F3";
      case "lembrete": return "#FF9800";
      case "comunicado": return "#9C27B0";
      case "aviso": return "#F44336";
      default: return "#757575";
    }
  };

  const marcarComoLido = async (avisoId: number) => {
    try {
      await api.patch(`/avisos/${avisoId}/lido`);
      setAvisos(avisos.map(a => 
        a.id === avisoId ? { ...a, lido: true } : a
      ));
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  };

  const podeGerenciarAvisos = userPerfil === "professor" || userPerfil === "administrador";

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Avisos Acadêmicos" 
        showLogout={false}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />

      <NotificationBanner
        visible={!!message}
        message={message}
        onDismiss={() => setMessage("")}
      />

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Chip
              selected={filtroTipo === null}
              onPress={() => setFiltroTipo(null)}
              style={styles.chip}
            >
              Todos
            </Chip>
            <Chip
              selected={filtroTipo === "geral"}
              onPress={() => setFiltroTipo("geral")}
              style={styles.chip}
            >
              Geral
            </Chip>
            <Chip
              selected={filtroTipo === "lembrete"}
              onPress={() => setFiltroTipo("lembrete")}
              style={styles.chip}
            >
              Lembrete
            </Chip>
            <Chip
              selected={filtroTipo === "comunicado"}
              onPress={() => setFiltroTipo("comunicado")}
              style={styles.chip}
            >
              Comunicado
            </Chip>
            <Chip
              selected={filtroTipo === "aviso"}
              onPress={() => setFiltroTipo("aviso")}
              style={styles.chip}
            >
              Aviso
            </Chip>
          </ScrollView>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>
              {filtroTipo 
                ? `${filtroTipo.charAt(0).toUpperCase() + filtroTipo.slice(1)}s (${avisos.length})`
                : `Total de Avisos (${avisos.length})`
              }
            </Text>

            {loading ? (
              <ActivityIndicator size="large" style={styles.loading} />
            ) : avisos.length === 0 ? (
              <Text style={styles.emptyText}>
                Nenhum aviso encontrado
              </Text>
            ) : (
              avisos.map((aviso) => (
                <Card 
                  key={aviso.id} 
                  style={[
                    styles.avisoCard,
                    !aviso.lido && styles.avisoNaoLido
                  ]}
                  onPress={() => {
                    if (!aviso.lido) {
                      marcarComoLido(aviso.id);
                    }
                  }}
                >
                  <Card.Content>
                    <View style={styles.avisoHeader}>
                      <Chip 
                        style={[
                          styles.tipoChip,
                          { backgroundColor: getCorTipo(aviso.tipo) }
                        ]}
                        textStyle={styles.tipoChipText}
                      >
                        {aviso.tipo.toUpperCase()}
                      </Chip>
                      {!aviso.lido && (
                        <Chip 
                          style={styles.naoLidoChip}
                          textStyle={styles.naoLidoChipText}
                        >
                          NOVO
                        </Chip>
                      )}
                    </View>

                    <Text style={styles.avisoTitulo}>{aviso.titulo}</Text>
                    <Text style={styles.avisoMensagem}>{aviso.mensagem}</Text>

                    <View style={styles.avisoFooter}>
                      <Text style={styles.avisoAutor}>
                        Por: {aviso.autor?.nome || "Sistema"}
                      </Text>
                      <Text style={styles.avisoData}>
                        {formatarData(aviso.dataCriacao)}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Botão flutuante para criar novo aviso (apenas para professores/admins) */}
      {podeGerenciarAvisos && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate("CriarAviso")}
          label="Novo Aviso"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  filtrosContainer: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  loading: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    marginTop: 20,
  },
  avisoCard: {
    marginBottom: 12,
    elevation: 2,
  },
  avisoNaoLido: {
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  avisoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tipoChip: {
    height: 24,
  },
  tipoChipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  naoLidoChip: {
    height: 24,
    backgroundColor: "#4CAF50",
  },
  naoLidoChipText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  avisoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  avisoMensagem: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  avisoFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  avisoAutor: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  avisoData: {
    fontSize: 12,
    color: "#888",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#6200EE",
  },
});
