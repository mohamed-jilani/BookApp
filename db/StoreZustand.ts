import { create } from "zustand";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import * as schema from "@/db/schema";
import { eq } from "drizzle-orm";
import { useState } from "react";

// Type du livre
export type Book = {
  id: number;
  title: string;
  author: string;
  country: string;
  language: string;
  link: string;
  pages: number;
  publishedDate: string;
  prix: number;
  image: string;
};

// Type du store Zustand
type BookStore = {
  books: Book[];
  loadBooks: () => Promise<void>;
  addBook: (book: Book) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
};

export const useBookStore = create<BookStore>((set, get) => {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });



  return {
    books: [],

    // Charger les livres depuis SQLite
    loadBooks: async () => {
      const booksList = await drizzleDb.query.books.findMany();
      const cleanedBooks = booksList.map((book) => ({
        id: book.id,
        title: book.title,
        link: book.link ?? "", // Remplacer null par une chaîne vide
        author: book.author,
        country: book.country ?? "Inconnu", // Valeur par défaut
        language: book.language ?? "Non spécifié",
        pages: book.pages ?? 0,
        publishedDate: book.publishedDate ? String(book.publishedDate) : "Non spécifié",
        prix: book.prix ?? 0,
        image: book.image,
      }));
      set({ books: cleanedBooks });
    },

    // Ajouter un livre
    addBook: async (book) => {
    // Générer un ID unique

      set((state) => ({ books: [...state.books, book] }));
    },

    // Modifier un livre
    updateBook: async (book) => {
        set((state) => ({
        books: state.books.map((b) => (b.id === book.id ? book : b)),
      }));
    },

    // Supprimer un livre
    deleteBook: async (id) => {
      await drizzleDb.delete(schema.books).where(eq(schema.books.id, id));
      set((state) => ({
        books: state.books.filter((b) => b.id !== id),
      }));
    },
  };
});
