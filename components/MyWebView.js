import React, { useRef,useEffect,useState  } from 'react';
import { WebView } from 'react-native-webview';
import {View,
    StyleSheet
  } from "react-native";

const MyWebView = ({ url, scrollToPosition, searchedQuery, textFromWebsite }) => {
    const webViewRef = useRef(null);

    const highlightWord = (word) => `
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
        //this function is just copied from ChatGPT. I don't know what it does exactly.
        function highlightText(node, searchText) {
          if (node.nodeType === Node.TEXT_NODE) {
            const regex = new RegExp(searchText, 'gi');
            const replacement = '<span style="background-color: yellow;">'+searchText+'</span>';
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
        var cookieVal = getCookie('searchWord')
        if(cookieVal.length>0){
            var searchText =cookieVal;
            highlightText(document.body, searchText);
        }
      })();
    `;

    useEffect(()=>{ 
        if(webViewRef.current){
            webViewRef.current.injectJavaScript(highlightWord('highlightedWord'));
            webViewRef.current.reload();
        }
    },[searchedQuery])

    const handleLoadEnd = ()=>{
        webViewRef.current.injectJavaScript(highlightWord('highlightedWord'));
    }
    return(
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          style={styles.container}
          onLoadEnd={handleLoadEnd}
          source={{uri:url}}
        />
      </View>
    )
    /*

    const test = "<h1>testing</h1><p>test</p><p>test</p><p>test</p>";
        <RenderHtml source={{html:test}}/>
    */

}

export default MyWebView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});