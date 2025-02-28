import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import RNPickerSelect from "react-native-picker-select";
import * as ImagePicker from "expo-image-picker";
import { countries } from "@/data/countries"; // Assurez-vous que ce fichier contient une liste de pays
import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import * as schema from "@/db/schema";
import { DATABASE_NAME } from "../_layout";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import migrations from '@/drizzle/migrations';
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch } from "../store/hooks";
import { addBook } from "../store/slices/booksSlice";

// Importation de Redux

const bookSchema = yup.object().shape({
  title: yup.string().trim().required("Le titre est requis"),
  author: yup.string().trim().required("L'auteur est requis"),
  country: yup.string().trim().required("Le pays est requis"),
  language: yup.string().trim().required("La langue est requise"),
  link: yup.string().url("Lien invalide").trim().required("Le lien est requis"),
  pages: yup.number().positive().integer().required("Nombre de pages requis").typeError("Le nombre de pages doit être un nombre valide"),
  publishedDate: yup
    .number()
    .typeError("L'année doit être un nombre")
    .integer("L'année doit être un entier")
    .min(1000, "L'année doit être à quatre chiffres")
    .max(new Date().getFullYear(), `L'année ne doit pas dépasser ${new Date().getFullYear()}`)
    .required("Date de publication requise"),
  prix: yup.number().positive().required("Le prix est requis").typeError("Le prix doit être un nombre valide"),
  image: yup.string().trim().required("L'image est requise"),
});

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

export default function AddBook() {
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<Book>({
    resolver: yupResolver(bookSchema),
  });

  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();  // Hook Redux pour dispatcher les actions

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue("image", result.assets[0].uri); // Mettre à jour l'état de l'image dans le formulaire
    }
  };

  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);

  const onSubmit = async (data: Book) => {
    console.log("Données soumises :", data); // Vérifier les données envoyées
    try {
      // Insérer le livre dans la base de données SQLite
      const insertedBook = await db.insert(schema.books).values([{
        title: data.title,
        author: data.author,
        country: data.country,
        language: data.language,
        link: data.link,
        pages: data.pages,
        publishedDate: data.publishedDate,
        prix: data.prix,
        image: data.image,
      }]).returning({ id: schema.books.id });
  
      // Extraire l'ID du premier élément du tableau
      const bookId = insertedBook[0]?.id;
  
      if (!bookId) {
        throw new Error("L'ID du livre n'a pas été récupéré correctement.");
      }
  
      Alert.alert("Succès", "Le livre a été ajouté avec succès !");
      reset(); // Réinitialiser le formulaire après soumission réussie
      setImageUri(null); // Réinitialiser l'image après soumission réussie
  
      // Ajout du livre dans Redux après l'insertion dans SQLite
      dispatch(addBook({
        id: Number(bookId),
        ...data,
      }));
      
  
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      Alert.alert("Erreur", "Impossible d'ajouter le livre.");
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
            <Text style={styles.title}>Ajouter un Livre</Text>

            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Titre du livre"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

            <Controller
              control={control}
              name="author"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Auteur"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

            <Controller
              control={control}
              name="country"
              render={({ field }) => (
                <RNPickerSelect
                  onValueChange={field.onChange}
                  items={countries}
                  value={field.value}
                  placeholder={{ label: "Sélectionner un pays...", value: "" }}
                  style={pickerSelectStyles}
                />
              )}
            />
            {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}

            <Controller
              control={control}
              name="language"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Langue"
                  onChangeText={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

            <Controller
              control={control}
              name="link"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Lien"
                  onChangeText={field.onChange}
                  value={field.value}
                  keyboardType="url"
                />
              )}
            />
            {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}

            <Controller
              control={control}
              name="pages"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Nombre de pages"
                  onChangeText={(text) => field.onChange(Number(text))}
                  value={field.value?.toString()}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.pages && <Text style={styles.error}>{errors.pages.message}</Text>}

            <Controller
              control={control}
              name="publishedDate"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Année de publication"
                  onChangeText={(text) => field.onChange(Number(text))}
                  value={field.value?.toString()}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.publishedDate && <Text style={styles.error}>{errors.publishedDate.message}</Text>}

            <Controller
              control={control}
              name="prix"
              render={({ field }) => (
                <TextInput
                  {...field}
                  style={styles.input}
                  placeholder="Prix"
                  onChangeText={(text) => field.onChange(Number(text))}
                  value={field.value?.toString()}
                  keyboardType="numeric"
                />
              )}
            />
            {errors.prix && <Text style={styles.error}>{errors.prix.message}</Text>}

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>Sélectionner une image</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {errors.image && <Text style={styles.error}>{errors.image.message}</Text>}
          </View>

          <View style={styles.formContainer2}>
            <Button title="Ajouter" onPress={handleSubmit(onSubmit)} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 50,
  },
  formContainer2: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },
  imagePicker: {
    backgroundColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  imagePickerText: {
    color: "#ddddf",
    fontSize: 14,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
    borderRadius: 8,
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
});

const pickerSelectStyles = { inputIOS: styles.input, inputAndroid: styles.input };
