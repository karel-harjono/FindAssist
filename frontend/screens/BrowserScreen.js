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
import WebView from "react-native-webview";
import axios from "axios";
import recipe1 from "./recipe1";
import recipe2 from "./recipe2";
import Stopwatch from "../components/Stopwatch";

const injectCSS = `
  const style = document.createElement('style');
  style.innerHTML = \`
    .highlight {
      background-color: yellow;
    }
    .current-highlight {
      background-color: orange;
    }
    highlight1 {
      background-color: red;
    }
  \`;
  document.head.appendChild(style);
`;

const BrowserScreen = ({ route }) => {
  const { url } = route.params || { url: constants.URL.RECIPE };
  const webViewRef = useRef(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedQuery, setSearchedQuery] = useState("");
  const [isInQuery, toggleIsInQuery] = useState(false);
  const [searchingNext, setSearchingNext] = useState(0);
  const [turnOffRecording, setTurnOffRecording] = useState(false);
  const [similarDocuments, setSimilarDocuments] = useState([]);
  const [searchIdx, setSearchIdx] = useState(0);
  const [isVoiceInterface, setIsVoiceInterface] = useState(false);
  const [recipe, setRecipe] = useState("");
  const [endVoice, setEndVoice] = useState(false);
  const [isTimeRunning, setIsTimeRunning] = useState(false);

  useEffect(()=>{

  },[]);
  const handleSearchToggle = () => {
    setIsTimeRunning(true);
    setTurnOffRecording(true);
    setSearchVisible(!searchVisible);
    setSearchQuery("");
    reset();
  };

  const fetchSimilarDocuments = async () => {
    const res = await axios.get(`http://${constants.LOCAL_IP}:3001/query?query=${searchQuery}&namespace=${constants.CURRENT_RECIPE}`);
    console.log('resonses', res.data);
    return res.data;
  };
  
  const handleSearch = async () => {
    if (searchQuery === "") {
      return;
    }
    if (isVoiceInterface) {
      console.log('handleSearch Voice Interface: ' + searchQuery);
      console.log("voiceinterface");
      const documents = await fetchSimilarDocuments();
      setSimilarDocuments(documents);
      const query = documents[searchIdx].metadata.textFromDocument || documents[searchIdx].pageContent;
      console.log('searchQuery: ', query);
      webViewRef.current.injectJavaScript(`
        {
          ${injectCSS}

          // remove highlighted text
          const highlightedElements = document.querySelectorAll('.highlight, .current-highlight');
          highlightedElements.forEach(element => {
            element.outerHTML = element.innerHTML;
          });

          const highlightOccurrences = (searchWord) => {
            // Regex to avoid matching text inside HTML tags
            const regex = new RegExp('(?<=>)[^<]*?(' + searchWord + ')[^<]*?(?=<)', 'gi');
            document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
              return match.replace(new RegExp(searchWord, 'gi'), highlighted => \`<span class='highlight'>\${highlighted}</span>\`);
            });
          };
          highlightOccurrences("${query}");
      
          const firstOccurrence = document.querySelector('.highlight');
          if (firstOccurrence) {
            firstOccurrence.classList.add('current-highlight');
            firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        `);
    } else {
    //   const query = searchQuery;
    //   webViewRef.current.injectJavaScript(`
    //     var highlighted;
    //     var i = 0;
    //     {
    //       ${injectCSS}
  
    //       // remove highlighted text
    //       const highlightedElements = document.querySelectorAll('.highlight, .current-highlight');
    //       highlightedElements.forEach(element => {
    //         element.outerHTML = element.innerHTML;
    //       });
  
    //       const highlightOccurrences = (searchWord) => {
    //         // Regex to avoid matching text inside HTML tags
    //         const regex = new RegExp('(?<=>)[^<]*?(' + searchWord + ')[^<]*?(?=<)', 'gi');
    //         document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
    //           return match.replace(new RegExp(searchWord, 'gi'), highlighted => \`<span class='highlight'>\${highlighted}</span>\`);
    //         });
    //       };
    //       highlightOccurrences("${query}");
    //       highlighted = document.querySelectorAll('.highlight');
      
    //       const firstOccurrence = document.querySelector('.highlight');
    //       if (firstOccurrence) {
    //         firstOccurrence.classList.add('current-highlight');
    //         firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
    //         window.ReactNativeWebView.postMessage('false');
    //       }
    //     }
    //   `);
    // }
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

  // const manualSearch = (query) =>{
  //   setSearchedQuery(query);
  //   if(searchQuery.length>0 && !isInQuery){
  //     toggleIsInQuery(true);
  //   }else if(searchQuery.length>0 && isInQuery){
  //     setSearchingNext(searchingNext+1);
  //   }
  // }

  const handleManualSearch = ()=>{
    const query = searchQuery;
      webViewRef.current.injectJavaScript(`
        var highlighted;
        var i = 0;
        {
          ${injectCSS}
  
          // remove highlighted text
          const highlightedElements = document.querySelectorAll('.highlight, .current-highlight');
          highlightedElements.forEach(element => {
            element.outerHTML = element.innerHTML;
          });
  
          const highlightOccurrences = (searchWord) => {
            // Regex to avoid matching text inside HTML tags
            const regex = new RegExp('(?<=>)[^<]*?(' + searchWord + ')[^<]*?(?=<)', 'gi');
            document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
              return match.replace(new RegExp(searchWord, 'gi'), highlighted => \`<span class='highlight'>\${highlighted}</span>\`);
            });
          };
          highlightOccurrences("${query}");
          highlighted = document.querySelectorAll('.highlight');
      
          const firstOccurrence = document.querySelector('.highlight');
          if (firstOccurrence) {
            firstOccurrence.classList.add('current-highlight');
            firstOccurrence.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.ReactNativeWebView.postMessage('false');
          }
        }
      `);
    }
  }

  const handleDataFromChild = (query) => {
    console.log("browser screen: "+query);
    manualSearch(query);
  };

  const handleMic = () =>{
    setEndVoice(true);
  }

  //COMMENT THIS USE EFFECT OUT WHEN DOING MANUAL TASK XD
  useEffect(()=>{
    handleSearch();
  },[searchQuery])

  const handleMessage = (event) =>{
    console.log("hi");
    if(event.nativeEvent.data=="false"){
      console.log("ddd");
      setIsTimeRunning(false);
    } else if (event.nativeEvent.data =="true"){
      setIsTimeRunning(true);
    }
  }

/*
<TextInput
            ref={input => input && input.focus()}
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
*/
  return (
    <View style={styles.container}>
      {!isVoiceInterface && <Stopwatch isTimeRunning={isTimeRunning} />}
      <WebView onMessage = {handleMessage} ref={webViewRef} source={{ html: recipe }} style={styles.webview} javaScriptEnabled={true} />
      {isVoiceInterface && <SpeechComponent endVoice={endVoice} onDataSend={handleDataFromChild} turnOffRecording={turnOffRecording}/>}
      {searchVisible && (
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleManualSearch}
            returnKeyType="done"
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
      <TouchableOpacity
          style={styles.floatingButton1}
          onPress={handleMic}
        >
          {
            isVoiceInterface ? <Icon name="mic" type="feather" color="#000" /> : <Icon name="search" type="font-awesome" color="#fff" />
          }
        </TouchableOpacity>
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
  floatingButton1: {
    position: "absolute",
    bottom: 130,
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
