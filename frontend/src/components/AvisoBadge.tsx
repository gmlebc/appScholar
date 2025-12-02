import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import api from "../services/api";

interface AvisoBadgeProps {
  visible?: boolean;
}

export default function AvisoBadge({ visible = true }: AvisoBadgeProps) {
  const [count, setCount] = useState(0);

  const carregarContador = async () => {
    try {
      const res = await api.get("/avisos/nao-lidos/count");
      if (res.data && typeof res.data.count === 'number') {
        setCount(res.data.count);
      }
    } catch (error: any) {
      console.error("Erro ao carregar contador de avisos:", error);
      // Se for erro 404, o endpoint pode não existir ainda
      if (error.response?.status === 404) {
        console.warn("Endpoint de contador não encontrado. Verifique se o backend está atualizado.");
      }
      setCount(0);
    }
  };

  useEffect(() => {
    if (visible) {
      carregarContador();
      
      // Atualizar a cada 30 segundos
      const interval = setInterval(carregarContador, 30000);
      
      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible || count === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Badge size={20} style={styles.badge}>
        {count > 99 ? "99+" : count}
      </Badge>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -5,
    right: -5,
  },
  badge: {
    backgroundColor: "#F44336",
  },
});
