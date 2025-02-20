import { books, carts } from '@/db/schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import AsyncStorage from 'expo-sqlite/kv-store';


// Cette fonction ajoute des données fictives dans la base de données
export const addDummyData = async (db: ExpoSQLiteDatabase) => {
    const value = AsyncStorage.getItemSync('dbInitialized');
    if (value) return;
    console.log('Inserting lists');

    await db.insert(books).values([{
        author: "Chinua Achebe",
        country: "Nigeria",
        image: 'things-fall-apart.jpg',
        language: "English",
        link: "https://en.wikipedia.org/wiki/Things_Fall_Apart\n",
        pages: 209,
        title: "Things Fall Apart",
        publishedDate: 1958,
        prix: 150
    },
    {
        author: "Hans Christian Andersen",
        country: "Denmark",
        image: 'fairy-tales.jpg',
        language: "Danish",
        link: "https://en.wikipedia.org/wiki/Fairy_Tales_Told_for_Children._First_Collection.\n",
        pages: 784,
        title: "Fairy tales",
        publishedDate: 1836,
        prix: 150
    },
    {
        author: "Dante Alighieri",
        country: "Italy",
        image: 'the-divine-comedy.jpg',
        language: "Italian",
        link: "https://en.wikipedia.org/wiki/Divine_Comedy\n",
        pages: 928,
        title: "The Divine Comedy",
        publishedDate: 1315,
        prix: 150
    },
    {
        author: "Chinua Achebe",
        country: "Nigeria",
        image: 'things-fall-apart.jpg',
        language: "English",
        link: "https://en.wikipedia.org/wiki/Things_Fall_Apart\n",
        pages: 209,
        title: "Things Fall Apart",
        publishedDate: 1958,
        prix: 150
    },
    {
        author: "Hans Christian Andersen",
        country: "Denmark",
        image: 'fairy-tales.jpg',
        language: "Danish",
        link: "https://en.wikipedia.org/wiki/Fairy_Tales_Told_for_Children._First_Collection.\n",
        pages: 784,
        title: "Fairy tales",
        publishedDate: 1836,
        prix: 150
    },
    {
        author: "Dante Alighieri",
        country: "Italy",
        image: 'the-divine-comedy.jpg',
        language: "Italian",
        link: "https://en.wikipedia.org/wiki/Divine_Comedy\n",
        pages: 928,
        title: "The Divine Comedy",
        publishedDate: 1315,
        prix: 150
    },
    {
        author: "Unknown",
        country: "Sumer and Akkadian Empire",
        image: 'the-epic-of-gilgamesh.jpg',
        language: "Akkadian",
        link: "https://en.wikipedia.org/wiki/Epic_of_Gilgamesh\n",
        pages: 160,
        title: "The Epic Of Gilgamesh",
        publishedDate: 1700,
        prix: 150
    },
    {
        author: "Unknown",
        country: "Achaemenid Empire",
        image: 'the-book-of-job.jpg',
        language: "Hebrew",
        link: "https://en.wikipedia.org/wiki/Book_of_Job\n",
        pages: 176,
        title: "The Book Of Job",
        publishedDate: 1600,
        prix: 150
    },
    {
        author: "Unknown",
        country: "India/Iran/Iraq/Egypt/Tajikistan",
        image: 'one-thousand-and-one-nights.jpg',
        language: "Arabic",
        link: "https://en.wikipedia.org/wiki/One_Thousand_and_One_Nights\n",
        pages: 288,
        title: "One Thousand and One Nights",
        publishedDate: 1200,
        prix: 150
    },
    {
        author: "Unknown",
        country: "Iceland",
        image: 'njals-saga.jpg',
        language: "Old Norse",
        link: "https://en.wikipedia.org/wiki/Nj%C3%A1ls_saga\n",
        pages: 384,
        title: "Nj\u00e1l's Saga",
        publishedDate: 1350,
        prix: 150
    },
    {
        author: "Jane Austen",
        country: "United Kingdom",
        image: 'pride-and-prejudice.jpg',
        language: "English",
        link: "https://en.wikipedia.org/wiki/Pride_and_Prejudice\n",
        pages: 226,
        title: "Pride and Prejudice",
        publishedDate: 1813,
        prix: 150
    },
    {
        author: "Honor\u00e9 de Balzac",
        country: "France",
        image: 'le-pere-goriot.jpg',
        language: "French",
        link: "https://en.wikipedia.org/wiki/Le_P%C3%A8re_Goriot\n",
        pages: 443,
        title: "Le P\u00e8re Goriot",
        publishedDate: 1835,
        prix: 150
    },
    {
        author: "Samuel Beckett",
        country: "Republic of Ireland",
        image: 'molloy-malone-dies-the-unnamable.jpg',
        language: "French, English",
        link: "https://en.wikipedia.org/wiki/Molloy_(novel)\n",
        pages: 256,
        title: "Molloy, Malone Dies, The Unnamable, the trilogy",
        publishedDate: 1952,
        prix: 150
    },
    {
        author: "Juan Rulfo",
        country: "Mexico",
        image: 'pedro-paramo.jpg',
        language: "Spanish",
        link: "https://en.wikipedia.org/wiki/Pedro_P%C3%A1ramo\n",
        pages: 124,
        title: "Pedro P\u00e1ramo",
        publishedDate: 1955,
        prix: 150
    },
    {
        author: "Rumi",
        country: "Sultanate of Rum",
        image: 'the-masnavi.jpg',
        language: "Persian",
        link: "https://en.wikipedia.org/wiki/Masnavi\n",
        pages: 438,
        title: "The Masnavi",
        publishedDate: 1236,
        prix: 150
    },
    {
        author: "Salman Rushdie",
        country: "United Kingdom, India",
        image: 'midnights-children.jpg',
        language: "English",
        link: "https://en.wikipedia.org/wiki/Midnight%27s_Children\n",
        pages: 536,
        title: "Midnight's Children",
        publishedDate: 1981,
        prix: 150
    },
    {
        author: "Saadi",
        country: "Persia, Persian Empire",
        image: 'bostan.jpg',
        language: "Persian",
        link: "https://en.wikipedia.org/wiki/Bustan_(book)\n",
        pages: 298,
        title: "Bostan",
        publishedDate: 1257,
        prix: 150
    },
    {
        author: "Tayeb Salih",
        country: "Sudan",
        image: 'season-of-migration-to-the-north.jpg',
        language: "Arabic",
        link: "https://en.wikipedia.org/wiki/Season_of_Migration_to_the_North\n",
        pages: 139,
        title: "Season of Migration to the North",
        publishedDate: 1966,
        prix: 150
    },
    ]


    );

    await db.insert(carts).values([
        { quantite: 1, book_id: 1 },
        { quantite: 2, book_id: 2 },
        { quantite: 3, book_id: 3 },
    ]);

    AsyncStorage.setItemSync('dbInitialized', 'true');

    console.log('Dummy data inserted');

};


