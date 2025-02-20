import React, { useEffect, useState } from "react";
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, Image, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, 
  TouchableWithoutFeedback, Keyboard 
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
import { useBookStore } from "@/db/StoreZustand";
import { Ionicons } from "@expo/vector-icons";

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
  const { book } = useLocalSearchParams(); 
  const bookData = book ? JSON.parse(book as string) : null;
  
  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<Book>({
    resolver: yupResolver(bookSchema),
    defaultValues: bookData
  });

  const [imageUri, setImageUri] = useState<string | null>(bookData?.image || null);
  const router = useRouter();

  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  useEffect(() => {
    if (bookData) {
      (Object.keys(bookData) as Array<keyof Book>).forEach((key) => {
        setValue(key, bookData[key]);
      });
    }
  }, [bookData, setValue]);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
    }
  };

  const onSubmit = async (data: typeof bookData) => {
    try {
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
          image: data.image,
        })
        .where(eq(schema.books.id, bookData.id)); 
      
        // Mettre à jour Zustand avec le livre modifié


      Alert.alert("Succès", "Le livre a été mis à jour avec succès !");
      router.push("/");

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

            <Controller control={control} name="title" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Titre du livre" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.title && <Text style={styles.error}>{errors.title.message}</Text>}

            <Controller control={control} name="author" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Auteur" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.author && <Text style={styles.error}>{errors.author.message}</Text>}

            <Controller control={control} name="country" render={({ field }) => (
              <RNPickerSelect onValueChange={field.onChange} items={countries} value={field.value} placeholder={{ label: "Sélectionner un pays...", value: "" }} style={pickerSelectStyles} />
            )} />
            {errors.country && <Text style={styles.error}>{errors.country.message}</Text>}

            <Controller control={control} name="language" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Langue" onChangeText={field.onChange} value={field.value} />
            )} />
            {errors.language && <Text style={styles.error}>{errors.language.message}</Text>}

            <Controller control={control} name="link" render={({ field }) => (
              <TextInput {...field} style={styles.input} placeholder="Lien" onChangeText={field.onChange} value={field.value} keyboardType="url" />
            )} />
            {errors.link && <Text style={styles.error}>{errors.link.message}</Text>}

            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>Sélectionner une image</Text>
            </TouchableOpacity>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            {errors.image && <Text style={styles.error}>{errors.image.message}</Text>}

            <Button title="Modifier" onPress={handleSubmit(onSubmit)} />
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
  image: { width: 100, height: 100, alignSelf: "center", marginBottom: 10, borderRadius: 8 },
  imagePickerText: { color: "#ddddf", fontSize: 14, fontWeight: "bold" },
  backButton: { position: "absolute", top: 30, left: 20, backgroundColor: "#007bff", padding: 10, borderRadius: 50, zIndex: 1 },

});

const pickerSelectStyles = { inputIOS: styles.input, inputAndroid: styles.input };





// Compare this snippet from app/%28tabs%29/editBook.tsx:
// import React, { useEffect, useState } from "react";
// import {
//   View, Text, TextInput, Button, StyleSheet, Alert, Image,
//   TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
//   TouchableWithoutFeedback, Keyboard
// } from "react-native";
// import { useForm, Controller } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import RNPickerSelect from "react-native-picker-select";
// import * as ImagePicker from "expo-image-picker";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import { drizzle } from "drizzle-orm/expo-sqlite";
// import { openDatabaseSync } from "expo-sqlite";
// import { countries } from "@/data/countries";
// import * as schema from "@/db/schema";
// import { DATABASE_NAME } from "../_layout";
//
// const bookSchema = yup.object().shape({
//   title: yup.string().required("Le titre est requis"),
