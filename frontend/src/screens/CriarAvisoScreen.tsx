import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Text, Button, TextInput, ActivityIndicator, SegmentedButtons } from "react-native-paper";
import api from "../services/api";
import CustomHeader from "../components/Header";
import NotificationBanner from "../components/Notification";
import { AvisoFormData } from "../types/avisos";

export default function CriarAvisoScreen({ navigation }: any) {
  const [formData, setFormData] = useState<AvisoFormData>({
    titulo: "",
    mensagem: "",
    tipo: "geral",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");

  const handleSubmit = async () => {
    // Validações
    if (!formData.titulo.trim()) {
      setMessageType("error");
      setMessage("Por favor, preencha o título do aviso");
      return;
    }

    if (!formData.mensagem.trim()) {
      setMessageType("error");
      setMessage("Por favor, preencha a mensagem do aviso");
      return;
    }

    if (formData.titulo.length < 5) {
      setMessageType("error");
      setMessage("O título deve ter pelo menos 5 caracteres");
      return;
    }

    if (formData.mensagem.length < 10) {
      setMessageType("error");
      setMessage("A mensagem deve ter pelo menos 10 caracteres");
      return;
    }

    setLoading(true);
    try {
      await api.post("/avisos", formData);
      setMessageType("success");
      setMessage("Aviso criado com sucesso!");
      
      // Limpar formulário
      setFormData({
        titulo: "",
        mensagem: "",
        tipo: "geral",
      });

      // Voltar para a lista após 1.5 segundos
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao criar aviso:", error);
      setMessageType("error");
      setMessage(error.response?.data?.error || "Erro ao criar aviso");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof AvisoFormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <View style={styles.container}>
      <CustomHeader 
        title="Criar Novo Aviso" 
        showLogout={false}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />

      <NotificationBanner
        visible={!!message}
        message={message}
        type={messageType}
        onDismiss={() => setMessage("")}
      />

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Informações do Aviso</Text>

            <TextInput
              label="Título *"
              value={formData.titulo}
              onChangeText={(text) => updateField("titulo", text)}
              mode="outlined"
              style={styles.input}
              maxLength={200}
              disabled={loading}
            />
            <Text style={styles.helperText}>
              {formData.titulo.length}/200 caracteres
            </Text>

            <TextInput
              label="Mensagem *"
              value={formData.mensagem}
              onChangeText={(text) => updateField("mensagem", text)}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={[styles.input, styles.textArea]}
              disabled={loading}
            />
            <Text style={styles.helperText}>
              {formData.mensagem.length} caracteres
            </Text>

            <Text style={styles.label}>Tipo de Aviso *</Text>
            <SegmentedButtons
              value={formData.tipo}
              onValueChange={(value) => updateField("tipo", value as AvisoFormData['tipo'])}
              buttons={[
                { value: 'geral', label: 'Geral' },
                { value: 'lembrete', label: 'Lembrete' },
                { value: 'comunicado', label: 'Comunicado' },
                { value: 'aviso', label: 'Aviso' },
              ]}
              style={styles.segmentedButtons}
            />

            <Text style={styles.helperText}>
              • <Text style={styles.bold}>Geral:</Text> Informações gerais para todos
              {"\n"}• <Text style={styles.bold}>Lembrete:</Text> Lembretes importantes
              {"\n"}• <Text style={styles.bold}>Comunicado:</Text> Comunicados oficiais
              {"\n"}• <Text style={styles.bold}>Aviso:</Text> Avisos urgentes
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={() => navigation.goBack()}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  "Publicar Aviso"
                )}
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    marginBottom: 4,
  },
  textArea: {
    minHeight: 120,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    color: "#333",
  },
  helperText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    lineHeight: 18,
  },
  bold: {
    fontWeight: "bold",
  },
  segmentedButtons: {
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#6200EE",
  },
});
