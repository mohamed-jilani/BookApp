
import { SectionList, Text, View, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { eq, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { carts, Book, Cart, books } from "@/db/schema";
import { useEffect, useState } from "react";
import * as schema from "@/db/schema";
export default function Index() {
  //const [data, setData] = useState<Cart[]>([]);
  const [data, setData] = useState<Book[]>([]);

  const db = useSQLiteContext();
  const drizzleDb = drizzle(db, { schema });

  useEffect(() => {
    const load = async () => {
      const data = await drizzleDb.query.books.findMany();
      //const data = await drizzleDb.query.carts.findMany();
      //const data = await drizzleDb.select().from(tasks).toSQL();
      console.log("~ load ~ data:", data);
      setData(data);
    };
    load();
  }, []);
  
  return (

    <View style={styles.container1}>
      <Text style={styles.title}>Books</Text>

      {data?.map((item) => (  
        <TouchableOpacity style={styles.container}> 
          <View style={styles.info} key={item.id}>
            {/* 
            <Text style={styles.date} key={item.id}>{item.quantite}</Text>
            <Text style={styles.date} key={item.id}>{item.book_id}</Text>
            */}
            <Text style={styles.title} >{item.title}</Text>
            <Text style={styles.author} >{item.author}</Text>
            <Text style={styles.date} >{item.publishedDate}</Text>
          </View>
        </TouchableOpacity>
      ))}
      
    </View>

    
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 10,
  },
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 50,
    height: 70,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});