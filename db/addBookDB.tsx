import { Book, books, carts } from "@/db/schema";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite"; 
import AsyncStorage from "expo-sqlite/kv-store";

// Cette fonction ajoute des données fictives dans la base de données
export const addBooksDB = async (db: ExpoSQLiteDatabase, booksValues: []) => {
const value = AsyncStorage.getItemSync("dbInitialized");
if (value) return;
console.log("Inserting list of books");

await db.insert(books).values(booksValues);

AsyncStorage.setItemSync("dbInitialized", "true");

console.log("Books data inserted");

};

export const addOneBookDB = async (db: ExpoSQLiteDatabase, bookValue: Book) => {
    const value = AsyncStorage.getItemSync("dbInitialized");
    if (value) return;
    console.log("Inserting a book");
    
    await db.insert(books).values([bookValue]);
    
    AsyncStorage.setItemSync("dbInitialized", "true");
    
    console.log("Book data inserted");
    
    };

    export const getImage = (image: string) => {
      // Liste des images locales dans "assets/images"
      const images: { [key: string]: any } = {
        "things-fall-apart.jpg": require("../assets/images/things-fall-apart.jpg"),
        "fairy-tales.jpg": require("../assets/images/fairy-tales.jpg"),
        "the-divine-comedy.jpg": require("../assets/images/the-divine-comedy.jpg"),
        "the-epic-of-gilgamesh.jpg": require("../assets/images/the-epic-of-gilgamesh.jpg"),
        "the-book-of-job.jpg": require("../assets/images/the-book-of-job.jpg"),
        "one-thousand-and-one-nights.jpg": require("../assets/images/one-thousand-and-one-nights.jpg"),
        "njals-saga.jpg": require("../assets/images/njals-saga.jpg"),
        "pride-and-prejudice.jpg": require("../assets/images/pride-and-prejudice.jpg"),
        "le-pere-goriot.jpg": require("../assets/images/le-pere-goriot.jpg"),
        "molloy-malone-dies-the-unnamable.jpg": require("../assets/images/molloy-malone-dies-the-unnamable.jpg"),
        "pedro-paramo.jpg": require("../assets/images/pedro-paramo.jpg"),
        "the-masnavi.jpg": require("../assets/images/the-masnavi.jpg"),
        "midnights-children.jpg": require("../assets/images/midnights-children.jpg"),
        "bostan.jpg": require("../assets/images/bostan.jpg"),
        "season-of-migration-to-the-north.jpg": require("../assets/images/season-of-migration-to-the-north.jpg")
      };
    
      // Vérifier si l"image est locale (assets/)
      if (images[image]) {
        return images[image];
      }
    
      // Vérifier si l"image est un chemin ou une URL externe
      if (image.startsWith("http") || image.startsWith("file://") || image.startsWith("data:")) {
        return { uri: image };
      }
    
      // Image par défaut si aucune correspondance
      return require("../assets/images/defultBook.jpg");
    };
    