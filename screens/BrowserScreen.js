// screens/BrowserScreen.js
import React, { useRef, useState, useEffect} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { Icon } from "react-native-elements"; //https://oblador.github.io/react-native-vector-icons/#Entypo
import constants from "../constants";
//import ExtractFromOtherWeb from "../server/ExtractFromOtherWeb";
import axios from 'axios';
import cheerio from 'cheerio';
import MyWebView from '../components/MyWebView';

const BrowserScreen = ({ route }) => {
  const { url } = route.params || { url: constants.URL.RECIPE };
  const webViewRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [textFromWebsite, setTextFromWebsite] = useState('');
  //const [loading, setLoading] = useState(false);
 // const [error, setError] = useState('');
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [currentSearchArray, setCurrentSearchArray] = useState([]);
  const [currentScrollPosition, setCurrentScrollPosition] = useState(0);

  useEffect(()=>{
    const ExtractFromOtherWeb = async ()=> {
      //setLoading(true);
      //setError('');
      try {
        const response = await axios.get(constants.URL.RECIPE);
        const loadedData = cheerio.load(response.data);
        //the first part of the article (maybe the header) is skipped. I mean the short abstract at the beginning. This is not intentional. If this has to be fixed, it should be fixed.
        let doc = loadedData('body').text().replace(/\s+/g, ' ').trim();
        setTextFromWebsite(doc);
      } catch (err) {
       // setError(err.message);
        console.log("error has occured: "+error);
        console.log(err);
      }
     // setLoading(false);
    };
    setTextFromWebsite(ExtractFromOtherWeb());
  },[]);

  const handleSearchToggle = () => {
    setSearchVisible(!searchVisible);
    setSearchQuery("");
  };

  const handleSearch = () => {
    if(currentSearchArray.length>0){
      if((currentSearchIndex+1)<currentSearchArray.length){
        setCurrentSearchIndex(currentSearchIndex+1);
        setCurrentScrollPosition(currentSearchArray[currentSearchIndex].index);
        console.log("current search position: " + currentScrollPosition);
      }
    }else{
      setCurrentSearchArray(findOccurrences(textFromWebsite,searchQuery));
      console.log(currentSearchArray);
      setCurrentScrollPosition(0);
    }
    // webViewRef.current.injectJavaScript(`
    // `);
  };

  const handleNext = () => {
    webViewRef.current.injectJavaScript(`
      // TODO: Implement handleNext
    `);
  };

  const handlePrevious = () => {
    webViewRef.current.injectJavaScript(`
      // TODO: Implement handlePrevious
    `);
  };

  const handleTextChange = (newText) => {
    setSearchQuery(newText);
    if(currentSearchArray.length >0 ){
      //set search and scroll states to its initial state
      setCurrentSearchArray([]);
      setCurrentScrollPosition(0);
      setCurrentSearchIndex(0);
    }
  };

  const findOccurrences = (text, word) => { 
    const regex = new RegExp(`${word}`, 'gi'); // Create a regex to match the word with word boundaries
    const matches = [];
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        word: match[0],
        index: match.index,
      });
    }
  
    return matches;
  }
//<WebView source={{ uri: url }} style={styles.webview} ref={webViewRef} originWhitelist={['*']} onLoadEnd={handleLoadEnd}/>
  return (
    <View style={styles.container}>
      <MyWebView url = {url} scrollToPosition={currentScrollPosition}/>
      {searchVisible && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handlePrevious} style={styles.iconButton}>
            <Icon name="arrow-left" type="font-awesome" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.iconButton}>
            <Icon name="arrow-right" type="font-awesome" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearchToggle}
            style={styles.iconButton}
          >
            <Icon name="close" type="font-awesome" color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSearch}
            style={styles.iconButton}
          >
            <Icon name="enter" type="antdesign" color="#fff" />
          </TouchableOpacity>
          
        </View>
      )}

      {!searchVisible && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleSearchToggle}
        >
          <Icon name="search" type="font-awesome" color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  floatingButton: {
    position: "absolute",
    bottom: 60,
    right: 40,
    backgroundColor: constants.THEME.PRIMARY_COLOR,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  searchBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#777",
    padding: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  iconButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default BrowserScreen;
