import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetalhesTrechoScreen } from './src/screens/DetalhesTrechoScreen';
import { NovaOcorrenciaScreen } from './src/screens/NovaOcorrenciaScreen';
import { PainelExecutivoScreen } from './src/screens/PainelExecutivoScreen';
import { cores } from './src/theme/cores';
import { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: cores.primaria },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Painel Viário SP-021 • Motiva' }}
          />
          <Stack.Screen
            name="DetalhesTrecho"
            component={DetalhesTrechoScreen}
            options={{ title: 'Inspeção e Telemetria do Trecho' }}
          />
          <Stack.Screen
            name="NovaOcorrencia"
            component={NovaOcorrenciaScreen}
            options={{ title: 'Registro Georreferenciado' }}
          />
          <Stack.Screen
            name="PainelExecutivo"
            component={PainelExecutivoScreen}
            options={{ title: 'Painel Executivo & ROI Motiva' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}