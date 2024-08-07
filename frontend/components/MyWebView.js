import React, { useRef,useEffect,useState  } from 'react';
import { WebView } from 'react-native-webview';
import {View,
    StyleSheet
  } from "react-native";

const MyWebView = ({ url, searchingNext, searchedQuery, isSearchOpen}) => {
    const webViewRef = useRef(null);
    const [highlightedArray, setHighlightedArray] = useState([{"top":0}]);
    const [curIndex, setCurIndex] = useState(0);
    const highlightWord = () => `
      (function() {
        //document.cookie = "searchWord=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; //delete the cookie
        document.cookie = "searchWord=${searchedQuery}"; 
        function getCookie(cname) {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
              c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
              }
          }
          return "";
        }
        //this function is just copied from ChatGPT. I don't know what it does exactly.
        function highlightText(node, searchText) {
          if (node.nodeType === Node.TEXT_NODE) {
            const regex = new RegExp(searchText, 'gi');
            const replacement = '<span class="scrollTo" style="background-color: yellow;">'+searchText+'</span>';
            const text = node.textContent;
            if (regex.test(text)) {
              const span = document.createElement('span');
              span.innerHTML = text.replace(regex, replacement);
              node.parentNode.replaceChild(span, node);
            }
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let i = 0; i < node.childNodes.length; i++) {
              highlightText(node.childNodes[i], searchText);
            }
          }
        }
          
        var cookieVal = getCookie('searchWord');
        if(cookieVal.length>0){
          var searchText =cookieVal;
          highlightText(document.body, searchText);
        }
      })();
    `;
    const scrollToView = ()=>`
      (function() {
        document.cookie = "scrollTo=${highlightedArray[curIndex].top}";
        function getCookie(cname) {
          let name = cname + "=";
          let decodedCookie = decodeURIComponent(document.cookie);
          let ca = decodedCookie.split(';');
          for(let i = 0; i <ca.length; i++) {
              let c = ca[i];
              while (c.charAt(0) == ' ') {
              c = c.substring(1);
              }
              if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
              }
          }
          return "";
        }
        var scrollCookieVal = parseInt(getCookie('scrollTo'));
        window.scrollTo({
            top: scrollCookieVal -200,
            left: 0,
            behavior: 'instant'
          });
        const resetScroll = ()=>{
          window.scrollTo(0,0);
        }
        window.addEventListener('beforeunload', resetScroll);
        //window.ReactNativeWebView.postMessage(scrollCookieVal);
      })();
    `
    const getAllWordIndices = () => `
      (function() {
          document.cookie = "searchWord=${searchedQuery}";
          function getCookie(cname) {
            let name = cname + "=";
            let decodedCookie = decodeURIComponent(document.cookie);
            let ca = decodedCookie.split(';');
            for(let i = 0; i <ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return "";
        }
        function getAllHighWords (word){
          const scrollCollection = document.querySelectorAll("span.scrollTo");
          const indices = [];
          const problems = [];
          for(let i = 0 ; i <scrollCollection.length;i++){
            if(scrollCollection[i].getBoundingClientRect().top != 0){ //unnecessary stuff happens to have top=0
              indices.push(scrollCollection[i].getBoundingClientRect());
            }
          }
          return indices;
        }

        var cookieVal = getCookie('searchWord')
        if(cookieVal.length>0){
          var searchText =cookieVal;
          let arr = getAllHighWords(searchText);
          window.ReactNativeWebView.postMessage(JSON.stringify(arr));
        }
      })();
    `
    useEffect(()=>{
      //when the user closes the search.
      if(!isSearchOpen){
        reset();
      }
    },[isSearchOpen])

    const reset = ()=>{
      setHighlightedArray([{"top":0}]);
      setCurIndex(0);
    }

    useEffect(()=>{
      if(searchingNext==0){
        //if a new Query has been made (or reset to null)
        if(webViewRef.current){
          webViewRef.current.injectJavaScript(highlightWord());
          webViewRef.current.injectJavaScript(getAllWordIndices());
          webViewRef.current.reload();
        }
      }
    },[searchedQuery])

    useEffect(()=>{ 
      //When the user wants to go to the next occurence of the search.
      if(searchingNext >0){  
        setCurIndex(curIndex+1);
        webViewRef.current.reload();
      }
    },[searchingNext])

    const handleLoadEnd = ()=>{
      webViewRef.current.injectJavaScript(highlightWord());
      webViewRef.current.injectJavaScript(scrollToView());
    }

    const handleMessage = (e)=>{
      const message = e.nativeEvent.data;
      try{
        const parsedMessage = JSON.parse(message); //stringfied array becomes an actual array
        if (Array.isArray(parsedMessage)) {
          setHighlightedArray(parsedMessage);
        } else {
          console.log("Message received from WebView:", parsedMessage);
        }
      }catch(error) {
        console.error("Failed to parse message:", message);
      }
    }

    return(
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          style={styles.container}
          onLoadEnd={handleLoadEnd}
          onMessage={handleMessage}
          source={{uri:url}}
        />
      </View>
    )

}

export default MyWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


 // const getAllWordIndices = () => `
    //   (function() {
    //       document.cookie = "searchWord=${searchedQuery}";
    //       function getCookie(cname) {
    //         let name = cname + "=";
    //         let decodedCookie = decodeURIComponent(document.cookie);
    //         let ca = decodedCookie.split(';');
    //         for(let i = 0; i <ca.length; i++) {
    //             let c = ca[i];
    //             while (c.charAt(0) == ' ') {
    //             c = c.substring(1);
    //             }
    //             if (c.indexOf(name) == 0) {
    //             return c.substring(name.length, c.length);
    //             }
    //         }
    //         return "";
    //     }
    //     function getAllWordIndices (word){
    //       const bodyText = document.body.innerText;
    //       const indices = [];
    //       let startIndex = 0;
    //       let wordIndex;
        
    //       while ((wordIndex = bodyText.indexOf(word, startIndex)) > -1) {
    //         indices.push(wordIndex);
    //         startIndex = wordIndex + word.length;
    //       }

    //       return indices;
    //     }
    //     //window.ReactNativeWebView.postMessage("hi");
    //     var cookieVal = getCookie('searchWord')
    //     if(cookieVal.length>0){
    //       var searchText =cookieVal;
    //       let arr = getAllWordIndices(searchText);
    //       window.ReactNativeWebView.postMessage(JSON.stringify(arr));
    //     }
    //   })();
    // `