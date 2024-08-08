// screens/BrowserScreen.js
import React, { useRef, useState, useEffect} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import MyWebPage from "../components/MyWebPage";

import MyWebView from '../components/MyWebView';
import { Icon } from "react-native-elements"; //https://oblador.github.io/react-native-vector-icons/#Entypo
import constants from "../constants";
//import ExtractFromOtherWeb from "../server/ExtractFromOtherWeb";
import SpeechComponent from "../components/SpeechComponent";

const BrowserScreen = ({ route }) => {
  const { url } = route.params || { url: constants.URL.RECIPE };
  const webViewRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isInQuery, toggleIsInQuery] = useState(false);
  const [searchingNext, setSearchingNext] = useState(0);
  const [turnOffRecording, setTurnOffRecording] = useState(false);

  useEffect(()=>{

  },[]);
  const handleSearchToggle = () => {
    setTurnOffRecording(true);
    setSearchVisible(!searchVisible);
    setSearchQuery("");
    reset();
  };

  const handleSearch = () => {
    setSearchedQuery(searchQuery);
    if(searchQuery.length>0 && !isInQuery){
      toggleIsInQuery(true);
    }else if(searchQuery.length>0 && isInQuery){
      setSearchingNext(searchingNext+1);
    }
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
    reset();
  };

  const reset = ()=>{
    setSearchedQuery("");
    setSearchingNext(0);
    toggleIsInQuery(false);
  }

  const manualSearch = (query) =>{
    setSearchedQuery(query);
    if(searchQuery.length>0 && !isInQuery){
      toggleIsInQuery(true);
    }else if(searchQuery.length>0 && isInQuery){
      setSearchingNext(searchingNext+1);
    }
  }

  const handleDataFromChild = (query) => {
    console.log("browser screen: "+query);
    manualSearch(query);
  };

/*
<MyWebPage style={styles.test}/>
      <SpeechComponent/>
*/
  return (
    <View style={styles.container}>
      <MyWebView url = {url} searchingNext={searchingNext} searchedQuery = {searchedQuery} isSearchOpen={searchVisible}/>
      <SpeechComponent onDataSend={handleDataFromChild} turnOffRecording={turnOffRecording}/>
      {searchVisible && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
  test:{
    flex:1,
  },
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
    width: 60,
    height: 60,
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
