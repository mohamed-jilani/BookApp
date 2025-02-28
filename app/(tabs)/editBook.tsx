import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { useRouter, useLocalSearchParams } from "expo-router";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { countries } from "@/data/countries"; 
import * as schema from "@/db/schema";
import { DATABASE_NAME } from "../_layout";
import { eq } from "drizzle-orm";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux"; // Ajouter useDispatch
import { addBook } from "../store/slices/booksSlice";


// Définir le type Book
type Book = {
  title: string;
  author: string;
  country: string;
  language: string;
  link: string;
  pages: number;
  publishedDate: number;
  prix: number;
  image: string;
};

const bookSchema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  author: yup.string().required("L'auteur est requis"),
  country: yup.string().required("Le pays est requis"),
  language: yup.string().required("La langue est requise"),
  link: yup.string().url("Lien invalide").required("Le lien est requis"),
  pages: yup.number().positive().integer().required("Nombre de pages requis"),
  publishedDate: yup
    .number()
    .integer("L'année doit être un entier")
    .min(1000, "L'année doit être à quatre chiffres")
    .max(new Date().getFullYear(), `L'année ne doit pas dépasser ${new Date().getFullYear()}`)
    .required("Date de publication requise"),
  prix: yup.number().positive().required("Le prix est requis"),
  image: yup.string().required("L'image est requise"),
});

export default function EditBook() {
  const dispatch = useDispatch();
  const { book } = useLocalSearchParams(); 
  const bookData = book ? JSON.parse(book as string) : null;

  // Initialiser le formulaire
  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Book>({
    resolver: yupResolver(bookSchema),
  });

  // État de l'image sélectionnée
  const [imageUri, setImageUri] = useState<string | null>(bookData?.image || null);
  const router = useRouter();

  // Initialiser la base de données
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  // Mettre à jour les valeurs du formulaire à partir des données du livre
  useEffect(() => {
    if (bookData) {
      // Utilisez setValue pour chaque champ spécifique
      setValue("title", bookData.title);
      setValue("author", bookData.author);
      setValue("country", bookData.country);
      setValue("language", bookData.language);
      setValue("link", bookData.link);
      setValue("pages", bookData.pages);
      setValue("publishedDate", bookData.publishedDate);
      setValue("prix", bookData.prix);
      setValue("image", bookData.image);  // Pré-remplir avec l'ancienne image
    }
  }, [bookData, setValue]);

  // Fonction pour choisir une image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue("image", result.assets[0].uri); // Mettre à jour l'image dans le formulaire
    }
  };
  
  // Fonction de soumission du formulaire
  const onSubmit = async (data: typeof bookData) => {
    try {
      if (!data.title || !data.author || !data.link) {
        Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
        return;
      }

      // Vérifier que l'image est présente dans les données
      const imageUriToSend = imageUri || data.image;

      // Mise à jour du livre dans la base de données
      if (!bookData?.id) {
        Alert.alert("Erreur", "Impossible de trouver l'ID du livre.");
        return;
      }

      console.log("Données du livre à mettre à jour :", data);
      console.log("ID :", bookData.id, 'title:', data.title, 'author:', data.author, 'country:', data.country, 'language:', data.language, 'link:', data.link, 'pages:', data.pages, 'publishedDate:', data.publishedDate, 'prix:', data.prix, 'image:', imageUriToSend);

      await db.update(schema.books)
        .set({
          title: data.title,
          author: data.author,
          country: data.country,
          language: data.language,
          link: data.link,
          pages: data.pages,
          publishedDate: data.publishedDate,
          prix: data.prix,
          image: imageUriToSend, // Utiliser l'image mise à jour ou l'image préexistante
        })
        .where(eq(schema.books.id, bookData.id))
        .returning();

      // Mettre à jour Redux avec le livre modifié
      dispatch(addBook({
        ...data,
        id: bookData.id, // Assurez-vous que l'ID correspond au livre que vous avez mis à jour
        image: imageUriToSend, // Utilisez l'image mise à jour si elle est présente
      }));

      Alert.alert("Succès", "Le livre a été mis à jour avec succès !");

      router.push("/"); // Retour à la page principale
 
    } catch (error) {
      console.error("Erreur lors de la modification :", error);
      Alert.alert("Erreur", "Impossible de modifier le livre.");
    }
  };
  

  return (

    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Modifier un Livre</Text>

            {/* Champ Titre */}
            <Controller control={control} name="title" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Titre du livre" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

            {/* Champ Auteur */}
            <Controller control={control} name="author" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Auteur" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

            {/* Sélecteur de pays */}
            <Controller control={control} name="country" render={({ field }) => (
              <RNPickerSelect onValueChange={field.onChange} items={countries} value={field.value} placeholder={{ label: "Sélectionner un pays...", value: "" }} style={pickerSelectStyles} />
            )} />
            {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}

            {/* Champ Langue */}
            <Controller control={control} name="language" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Langue" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

            {/* Champ Lien */}
            <Controller control={control} name="link" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Lien" onChangeText={field.onChange} value={field.value} keyboardType="url" />
            )} />
            {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}

            {/* Champ Nombre de pages */}
            <Controller control={control} name="pages" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Nombre de pages" onChangeText={field.onChange} value={field.value?.toString()} keyboardType="numeric" />
            )} />
            {errors.pages && <Text style={styles.error}>{errors.pages.message}</Text>}

            {/* Champ Date de publication */}
            <Controller control={control} name="publishedDate" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Date de publication" onChangeText={field.onChange} value={field.value?.toString()} keyboardType="numeric" />
            )} />
            {errors.publishedDate && <Text style={styles.error}>{errors.publishedDate.message}</Text>}

            {/* Champ Prix */}
            <Controller control={control} name="prix" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Prix" onChangeText={field.onChange} value={field.value?.toString()} keyboardType="numeric" />
            )} />
            {errors.prix && <Text style={styles.error}>{errors.prix.message}</Text>}

            {/* Image du livre */}
            <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text style={styles.imageText}>Choisir une image</Text>
              )}
            </TouchableOpacity>
            
            {/* Bouton de soumission */}
            <Button title="Enregistrer les modifications" onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f8f9fa", justifyContent: "center" },
  formContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#333" },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: "#ddd" },
  error: { color: "red", marginBottom: 10, fontSize: 14 },
  imagePicker: { backgroundColor: "#ddd", padding: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  imagePickerText: { fontSize: 16 },
  image: { width: 150, height: 150, resizeMode: "cover", marginTop: 12, alignSelf: "center" },
  backButton: { position: "absolute", top: 22, left: 10, zIndex: 10, flexDirection: "row", alignItems: "center", backgroundColor: "#007bff", padding: 10, borderRadius: 50 },
  imageText: {color: "#888", fontSize: 16},
  
});

// Styles pour le Picker Select
const pickerSelectStyles = {
  inputAndroid: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
};

