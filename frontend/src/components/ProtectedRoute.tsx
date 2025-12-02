import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactNode;
  navigation: any;
  requiredPerfil?: string[];
}

export default function ProtectedRoute({ children, navigation, requiredPerfil }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        navigation.replace("Login");
        return;
      }

      // Verificar se o token é válido e decodificar
      const decoded: any = jwtDecode(token);
      
      // Verificar se o perfil é necessário para esta rota
      if (requiredPerfil && !requiredPerfil.includes(decoded.perfil)) {
        navigation.replace("Home");
        return;
      }

      setAuthorized(true);
    } catch (error) {
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Verificando autenticação...</Text>
      </View>
    );
  }

  return authorized ? <>{children}</> : null;
}