import React, { useState, useEffect, useRef} from 'react';
import { View, Text, Button, StyleSheet,  TouchableOpacity } from 'react-native';
import handleGoogleAPI from './handleGoogleApi';
import constants from "../constants";
import RecordVoice from "./RecordVoice";
import ContinuousSpeechRecognition from "./ContinuousSpeechRecognition";
const SpeechComponent = () => {


useEffect(()=>{
  //handleGoogleAPI();
},[]);
//      
  return (
    <View >
      <RecordVoice/>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 150,
    right: 40,
    backgroundColor: constants.THEME.PRIMARY_COLOR,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
})
export default SpeechComponent;