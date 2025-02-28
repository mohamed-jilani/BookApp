import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as schema from "@/db/schema";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

// Définir le type d'un livre
interface Book {
  id: number;
  title: string;
  author: string;
  country: string | null; 
  language: string | null;
  link: string | null;
  pages: number | null;
  publishedDate: number | null;
  prix: number | null;
  image: string;
}

  
interface BooksState {
  list: Book[];
}

const initialState: BooksState = {
  list: [],
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBooks: (state, action: PayloadAction<Book[]>) => {
      state.list = action.payload; // Remplacer la liste des livres par celle du payload (action)

    },
    addBook: (state, action: PayloadAction<Book>) => {
        state.list.push(action.payload); // Ajoute le nouveau livre sans écraser la liste existante
      },      
    removeBook: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((book) => book.id !== action.payload);
    },
  },
});

export const { addBooks, addBook, removeBook } = booksSlice.actions;
export default booksSlice.reducer;
