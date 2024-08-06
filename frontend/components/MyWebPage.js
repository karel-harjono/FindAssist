import React from 'react';
import {
  View, Text, Image, StyleSheet,ScrollView } from  "react-native";
//import './MyWebPage.css';

const MyWebPage = ()=>{
    return (
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to My Cooking Page</Text>
      </View>
      <ScrollView contentContainerStyle={styles.main}>
        <View style={styles.intro}>
          <Text style={styles.title}>Introduction to Cooking</Text>
          <Text style={styles.text}>
            Cooking is the art, technology, science, and craft of preparing food for consumption. It encompasses a vast array of techniques and ingredients to create delicious meals.
          </Text>
        </View>
        <Text style={styles.title}>Cooking Gallery</Text>
        <ScrollView contentContainerStyle={styles.galleryContainer} horizontal>

          <View style={styles.imageGrid}>
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
            <Image source={{ uri: 'https://via.placeholder.com/200' }} style={styles.image} />
          </View>
        </ScrollView>
        <ScrollView contentContainerStyle={styles.galleryContainer} horizontal>
          <View style={styles.imageGrid}>
            
          </View>
        </ScrollView>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 My Cooking Page</Text>
      </View>
    </View>
      );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#282c34',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
  },
  main: {
    padding: 20,
    alignItems: 'center',
  },
  intro: {
    marginBottom: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  galleryContainer: {
    marginTop: 20,
    padding: 20,
    flexDirection: 'row',
  },
  imageGrid: {
    flexDirection: 'column',
  },
  image: {
    width: 200,
    height: 200,
    margin: 5,
  },
  footer: {
    padding: 10,
    backgroundColor: '#282c34',
    alignItems: 'center',
  },
  footerText: {
    color: 'white',
  },
});

export default MyWebPage;