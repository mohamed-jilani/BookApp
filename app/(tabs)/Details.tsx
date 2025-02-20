import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking  } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getImage } from "../../db/addBookDB";


export default function DetailsScreen() {
  const router = useRouter();
  const { book } = useLocalSearchParams();
  //const bookData = book ? JSON.parse(book) : null; // Conversion JSON -> Objet
  const bookData = typeof book === "string" ? JSON.parse(book) : null; 
  const handleOpenLink = () => {
    Linking.openURL(bookData.link.trim());
  };

  if (!bookData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Aucune information disponible.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <Image
        source={getImage(bookData.image)}
        style={styles.image}
      />

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{bookData.title}</Text>
        <Text style={styles.author}>Auteur : ✍️ {bookData.author}</Text>
        <Text style={styles.author}>Pays : ✍️ {bookData.country}</Text>
        <Text style={styles.author}>Langue : ✍️ {bookData.language}</Text>
        <Text style={styles.pages}>Pages : 📖 {bookData.pages} pages</Text>
        <Text style={styles.publishedDate}>Date de publication : 📅 Publié en {bookData.publishedDate}</Text>
        <Text style={styles.publishedDate}>Prix :  📅  {bookData.prix}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
        <Text style={styles.buttonText}>En savoir plus</Text>
      </TouchableOpacity>
    </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", alignItems: "center", paddingTop: 40 },
  backButton: { position: "absolute", top: 30, left: 20, backgroundColor: "#007bff", padding: 10, borderRadius: 50, zIndex: 1 },
  image: { width: 200, height: 300, borderRadius: 10, marginTop: 60, elevation: 5, resizeMode: "cover" },
  infoContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginTop: 20, width: "90%", elevation: 4, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 10 },
  author: { fontSize: 16, color: "#555", marginBottom: 5 },
  pages: { fontSize: 14, color: "#555", marginBottom: 5 },
  publishedDate: { fontSize: 14, color: "#888" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
  buttonText: {fontSize: 16, color: '#FFFFFF', fontWeight: 'bold'},
  button: { marginTop: 20, backgroundColor: '#1E90FF', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center' },
});
