import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface BookItemProps {
  book: {
    id: string;
    title: string;
    author: string;
    publishedDate: number; // Utilise publishedDate
    image: any; // Type de l'image est 'any' car require renvoie un module
    prix: number;

  };
  onPress: () => void;
}

export const BookItem: React.FC<BookItemProps> = ({ book, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: book.image }}  style={styles.image} /> {/* Utilise book.image directement */}
      <View style={styles.info}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>{book.author}</Text>
        <Text style={styles.date}>{book.publishedDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

export default BookItem;