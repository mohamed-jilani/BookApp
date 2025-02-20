import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
//--------------------
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData} from '@/db/addDummyData';
import DetailsScreen from './(tabs)/Details';
//--------------------

export const DATABASE_NAME = 'books';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      addDummyData(db);
    }
  }, [loaded]);


  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  useEffect (() => {
    if( success) {
      console.log('Migrations ran successfully');
      addDummyData(db);

      }
    }, []);  


  /*
  useEffect (() => {
    const load = async () => {
    const data = await drizzleDb.query.tasks.findMany();
    console.log('~load ~ data:', data);
    setData(data);
    };
    load();
    }, []);
    */

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
          <Stack>
            <Stack.Screen name="(tabs)" options={{  headerShown: true, title: '📚 Liste des livres'}} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen name="Details" options={{  title: '📚 Détails de livre'}}  />
            <Stack.Screen name="editBook" />
          </Stack>
            
        </SQLiteProvider>
      </Suspense>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
