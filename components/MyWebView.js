import React, { useRef,useEffect  } from 'react';
import { WebView } from 'react-native-webview';
import {
    StyleSheet,
  } from "react-native";
const MyWebView = ({ url, scrollToPosition }) => {
  const webviewRef = useRef(null);

  const injectScrollScript = `
    setTimeout(() => {
      window.scrollTo(0, ${scrollToPosition});
    }, 200); // Adjust timeout as needed
  `;

//   const handleLoadEnd = () => {
//     if (webviewRef.current) {
//       webviewRef.current.injectJavaScript(injectScrollScript);
//     }
//   };
  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(injectScrollScript);
    }
  }, [scrollToPosition]);
  return (
    <WebView
      ref={webviewRef}
      style = {styles.webview}
      source={{ uri: url }}
    />
  );
};

const styles = StyleSheet.create({
    webview: {
      flex: 1,
    },
});

export default MyWebView;