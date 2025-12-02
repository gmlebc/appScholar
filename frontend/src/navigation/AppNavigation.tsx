import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import AlunoScreen from "../screens/AlunoScreen";
import ProfessorScreen from "../screens/ProfessorScreen";
import DisciplinaScreen from "../screens/DisciplinaScreen";
import BoletimScreen from "../screens/BoletimScreen";
import ProtectedRoute from "../components/ProtectedRoute";
import CadastroScreen from "../screens/CadastroScreen";
import ListaAlunosScreen from "../screens/ListaAluno";
import ListaProfessoresScreen from "../screens/ListaProfessor";
import ListaDisciplinasScreen from "../screens/ListaDisciplina";
import LancarNotasScreen from "../screens/NotaScreen";
import NotarNotasDisciplinaScreen from "../screens/LancarNotasScreen";
import LancarNotasDisciplinaScreen from "../screens/LancarNotasScreen";
import ListaAvisosScreen from "../screens/ListaAvisosScreen";
import CriarAvisoScreen from "../screens/CriarAvisoScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator({
  toggleTheme,
}: {
  toggleTheme: () => void;
}) {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {({ navigation }) => (
            <LoginScreen navigation={navigation} toggleTheme={toggleTheme} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CadastroScreen"
          options={{ title: "Cadastro", headerShown: false }}
        >
          {({ navigation }) => (
            <CadastroScreen navigation={navigation} toggleTheme={toggleTheme} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Home" options={{ title: "Início" }}>
          {({ navigation }) => (
            <ProtectedRoute navigation={navigation}>
              <HomeScreen navigation={navigation} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen
          name="AlunoScreen"
          options={{ title: "Gerenciar Alunos" }}
        >
          {({ navigation }) => (
            <AlunoScreen navigation={navigation} toggleTheme={toggleTheme} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ProfessorScreen"
          options={{ title: "Gerenciar Professores" }}
        >
          {({ navigation }) => (
            <ProfessorScreen
              navigation={navigation}
              toggleTheme={toggleTheme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="DisciplinaScreen"
          options={{ title: "Gerenciar Disciplinas" }}
        >
          {({ navigation }) => (
            <DisciplinaScreen
              navigation={navigation}
              toggleTheme={toggleTheme}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="BoletimScreen"
          options={{ title: "Boletim Acadêmico" }}
        >
          {({ navigation }) => (
            <BoletimScreen navigation={navigation} toggleTheme={toggleTheme} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ListaAlunos"
          options={{ title: "Lista de Alunos", headerShown: false }}
        >
          {({ navigation }) => <ListaAlunosScreen navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen
          name="ListaProfessores"
          options={{ title: "Lista de Professores", headerShown: false }}
        >
          {({ navigation }) => (
            <ListaProfessoresScreen navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ListaDisciplinas"
          options={{ title: "Lista de Disciplinas", headerShown: false }}
        >
          {({ navigation }) => (
            <ListaDisciplinasScreen navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="LancarNotasScreen"
          options={{ title: "Lançar Notas" }}
        >
          {({ navigation }) => <LancarNotasScreen navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen
          name="LancarNotasDisciplinaScreen"
          options={{ title: "Lançar Notas da Disciplina" }}
        >
          {({ navigation }) => (
            <LancarNotasDisciplinaScreen navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="ListaAvisos"
          options={{ title: "Avisos Acadêmicos", headerShown: false }}
        >
          {({ navigation }) => (
            <ListaAvisosScreen navigation={navigation} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CriarAviso"
          options={{ title: "Criar Aviso", headerShown: false }}
        >
          {({ navigation }) => (
            <CriarAvisoScreen navigation={navigation} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
