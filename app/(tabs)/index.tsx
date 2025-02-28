import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as schema from "@/db/schema";
import { StatusBar } from "expo-status-bar";
import { eq } from "drizzle-orm";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { addBook, addBooks, removeBook } from "../store/slices/booksSlice";
import { getImage } from "@/db/addBookDB";
import { number } from "yup";

export default function Index() {
  const [books, setBooks] = useState<schema.Book[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const router = useRouter();

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // Récupérer les livres depuis Redux
  const booksFromRedux = useSelector((state: RootState) => state.books.list);

  // Charger les livres depuis SQLite et les ajouter à Redux si nécessaire
  const loadBooks = async () => {
    const booksList = await drizzleDb.query.books.findMany();

    // Si Redux ne contient pas de livres, les ajouter
    if (booksFromRedux.length === 0) {
      dispatch(addBooks(booksList)); // Ajout des livres dans Redu
      
    }

    setBooks(booksList); // Mettre à jour l'état local avec les livres récupérés
  };

  useEffect(() => {
    if (isFocused) loadBooks();
  }, [isFocused]);

  const deleteBook = async (id: number) => {
    Alert.alert("Confirmer", "Voulez-vous vraiment supprimer ce livre ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          // Suppression de la base de données SQLite
          await drizzleDb.delete(schema.books).where(eq(schema.books.id, id));

          // Suppression du livre dans Redux
          dispatch(removeBook(id));

          // Recharge la liste des livres
          loadBooks();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>📚 Livres dans la base</Text>

      <FlatList
        data={booksFromRedux} // Utiliser les livres depuis Redux
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <TouchableOpacity
              style={styles.bookDetails}
              onPress={() => router.push({ pathname: "/Details", params: { bookId: item.id.toString() } })}
            >
              <Image source={getImage(item.image)} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>✍️ {item.author}</Text>
                <Text style={styles.bookPages}>📖 {item.pages} pages</Text>
                <Text style={styles.bookDate}>📅 {item.publishedDate}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.actionButtons}>
              {/* Edit */}
              <TouchableOpacity onPress={() => router.push({ pathname: "/editBook", params: { book: JSON.stringify(item) } })}>
                <Image source={require("../../assets/icons/update.png")} style={styles.iconAction} />
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity onPress={() => deleteBook(item.id)}>
                <Image source={require("../../assets/icons/deleteicon.png")} style={styles.iconAction} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
 
      <TouchableOpacity style={styles.floatingButton2} onPress={() => loadBooks()}>
        <Ionicons name="add" size={50} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.floatingButton} onPress={() => router.push("/addBook")}>
        <Ionicons name="add" size={50} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 15 },

  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginVertical: 15, color: "#333" },
  bookCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bookImage: { width: 80, height: 120, borderRadius: 8, resizeMode: "cover" },
  bookInfo: { marginLeft: 10, flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bookAuthor: { fontSize: 14, color: "#555" },
  bookPages: { fontSize: 12, color: "#777" },
  bookDate: { fontSize: 12, color: "#999" },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 30,
    backgroundColor: "#007bff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  floatingButton2: {
    position: "absolute",
    bottom: 20,
    left: 20,
    borderRadius: 30,
    backgroundColor: "#007bff",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  actionButtons: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconAction: { width: 30, height: 30, tintColor: "#007bff" },
  bookDetails: { flexDirection: "row", flex: 1, alignItems: "center" },
});
