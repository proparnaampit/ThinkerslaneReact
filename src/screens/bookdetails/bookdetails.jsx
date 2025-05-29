import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const BookDetails = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Title</Text>
      <Text style={styles.author}>by Author Name</Text>
      <View style={styles.section}>
        <Text style={styles.heading}>Description</Text>
        <Text style={styles.description}>
          This is a placeholder for the book description. Add more details about
          the book here.
        </Text>
      </View>
      {/* Add more sections as needed */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    fontSize: 16,
    color: '#333',
  },
});

export default BookDetails;
