import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as schema from "@/db/schema";
import { Book } from "@/db/schema";
import { getImage } from "@/db/addBookDB";
import { StatusBar } from "expo-status-bar";
import { eq } from "drizzle-orm";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const [data, setData] = useState<Book[]>([]);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });
  const router = useRouter();

  const loadBooks = async () => {
    const booksList = await drizzleDb.query.books.findMany();
    console.log("Livres chargés :", booksList);
    setData(booksList);
  };
/*
  useEffect(() => {
    loadBooks();
  }, []);

*/
  const [books, setBooks] = useState<Book[]>([]);
  const isFocused = useIsFocused(); // Détecte si l'écran est actif

  useEffect(() => {
    if (isFocused) {
      fetchBooks();
    }
  }, [isFocused]);

  const fetchBooks = async () => {
    const booksFromDB = await drizzleDb.query.books.findMany();
    setBooks(booksFromDB);
  };


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
          await drizzleDb.delete(schema.books).where(eq(schema.books.id,id));
          fetchBooks();// Recharger la liste après suppression
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>📚 Livres dans la base</Text>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookCard}>
            <TouchableOpacity
              style={styles.bookDetails}
              onPress={() => router.push({ pathname: "/Details", params: { book: JSON.stringify(item) } })}
            >
              <Image source={getImage(item.image)} style={styles.bookImage} />
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>✍️ {item.author}</Text>
                <Text style={styles.bookPages}>📖 {item.pages} pages</Text>
                <Text style={styles.bookDate}>📅 {item.publishedDate}</Text>
              </View>
            </TouchableOpacity>

            {/* Icônes d'actions */}
            <View style={styles.actionButtons}>
              {/* Modifier */}
              <TouchableOpacity onPress={() => router.push({ pathname: "/editBook", params: { book: JSON.stringify(item) } })}>
                <Image source={require("../../assets/icons/update.png")} style={styles.iconAction} />
              </TouchableOpacity>

              {/* Supprimer */}
              <TouchableOpacity onPress={() => deleteBook(item.id)}>
                <Image source={require("../../assets/icons/deleteicon.png")} style={styles.iconAction} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Bouton flottant pour ajouter un livre */}
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
    position: "absolute", bottom: 20, right: 20, borderRadius: 30, backgroundColor: "#007bff", 
    padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 
  },
  floatingButton2: { 
    position: "absolute", bottom: 20, left: 20, borderRadius: 30, backgroundColor: "#007bff", 
    padding: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 
  },
  actionButtons: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconAction: { width: 30, height: 30, tintColor: "#007bff" },
  icon: { width: 50, height: 50, tintColor: "#fff" },

  bookDetails: { flexDirection: "row", flex: 1, alignItems: "center" },

});