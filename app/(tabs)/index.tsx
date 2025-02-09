import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as schema from "@/db/schema";
import { Book } from "@/db/schema";

export default function Index() {
  const [data, setData] = useState<Book[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const router = useRouter();

  useEffect(() => {
    const loadBooks = async () => {
      const booksList = await drizzleDb.query.books.findMany();
      console.log("Livres chargés :", booksList);
      setData(booksList);
    };
    loadBooks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Liste des livres</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>{item.author}</Text>
          </View>
        )}
      />

      {/* Bouton flottant pour ajouter un livre */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("/addBook")}>
        <Image source={require("../../assets/icons/plus.png")} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookAuthor: {
    fontSize: 16,
    color: "gray",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
