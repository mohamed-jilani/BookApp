import { configureStore } from "@reduxjs/toolkit";
import booksReducer from "./slices/booksSlice";

export const store = configureStore({
  reducer: {
    books: booksReducer, // Ajoute d'autres reducers ici si nécessaire
  },
});

// Typage du RootState et AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export type AppDispatch = typeof store.dispatch; // Ancienne version de la ligne ci-dessus
