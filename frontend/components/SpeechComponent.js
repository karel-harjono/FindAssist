import React, { useState, useEffect, useRef} from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import handleGoogleAPI from './handleGoogleApi';

const SpeechComponent = () => {

useEffect(()=>{
  handleGoogleAPI();
},[]);

  return (
    <View >
    </View>
  );
};

export default SpeechComponent;