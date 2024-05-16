import { Platform, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StoreProvider } from '@/store';
import Routes from '@/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  return (
    <GestureHandlerRootView>
      <StoreProvider>
        <SafeAreaView style={style.app}>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </SafeAreaView>
      </StoreProvider>
    </GestureHandlerRootView>
  );
}

const style = StyleSheet.create({
  app: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
});
