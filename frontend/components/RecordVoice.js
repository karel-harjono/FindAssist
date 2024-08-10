import React, { useState, useEffect, useRef} from 'react';
import { View, Text, Button, StyleSheet,  TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
//import playSound from './playSound';
import constants from "../constants";
import { Icon } from "react-native-elements";
import { recordingOptions } from '../audioconstants;';
import handleGoogleAPI from './handleGoogleApi';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';

import { Asset } from 'expo-asset';

import audioFile from '../assets/ding.mp3';


const RecordVoice = ({turnOffRecording, onDataSend}) =>{
  const [recording, setRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState(null);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const [isRecordingBackground, setIsRecordingBackground] = useState(false);
  var interval1;
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (recording)
      Speech.speak("what would you like to search?");
  }, [recording]);


  const playSound = async ()=>{

    try{
      const asset = Asset.fromModule(audioFile);
      await asset.downloadAsync();
      console.log("dd");
  
      //check to see if the asset is correct
      if (asset.localUri) {
        const { sound } = await Audio.Sound.createAsync(
            { uri: asset.localUri }
        );
        sound.playAsync(); //comment this out after debugging and development is one.
        if (sound) {
            sound.unloadAsync();
        }
    } else {
    }
      return asset.localUri;
    }catch{
      console.error('Error loading asset:', error);
      throw error;
    }
  }

   async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status) => {
          console.log(status);
          if (status.durationMillis > 0) {
            console.log('Recording started');
            setRecording(true);
          }
        }
      );
      recordingRef.current = recording;
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      setRecordedUri(uri);
      setRecording(false);
      if(isSearching){
        setIsSearching(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function handleTranscript(uri) {
    try {
      // const { sound } = await Audio.Sound.createAsync({ uri });
      // soundRef.current = sound;
      // await sound.playAsync();

      const transcript = await handleGoogleAPI(recordingRef.current.getURI());
      console.log(transcript);
      // Speech.speak(transcript);
      setRecordedUri('');
      //if(transcript.split(' ')[0].toLowerCase() == "search"){
       // onDataSend(transcript.split(' ')[1]);
       onDataSend(transcript);
      //}
    } catch (err) {
      console.error('handleTranscript error:', err);
    }
  }
  const checkRecordingStatus = async () => {
    try {

      //await checkAudioFileSize(recordingRef.current.getURI());
      // const transcript = await handleGoogleAPI(recordingRef.current.getURI());
      if((transcript.includes("ok")||transcript.includes("okay"))&&transcript.includes("Bob")){
        stopRecording();
        clearInterval(interval1);
        setIsRecordingBackground(false);
        Speech.speak("what would you like to search?");
        setTimeout(() => {
          setIsSearching(true);
          startRecording();
          const timeout = setTimeout(() => {
            stopRecording();
            handleTranscript(recordedUri);
          }, 5000);
        }, 2500);
      }
      console.log("record transcript:"+transcript);
    }catch(err){
      console.log(err);
    }
  }

  const handlePress = async ()=>{
    // if(isRecordingBackground){
    //   setIsRecordingBackground(false);
    //   console.log("clear interval");
    //   clearInterval(interval1);
    //   stopRecording();
    //   startRecording();
    //   setIsSearching(true);
    // }else{
      if(recording){
        stopRecording();
        handleTranscript();
      }else{
        startRecording();
      }
    // }
  }

  // useEffect(()=>{
  //   startRecording();
  //   const interval = setInterval(() => {
  //     if(isRecordingBackground){
  //       checkRecordingStatus();
  //     }

  //   }, 3000);
  //   const timeout = setTimeout(() => {
  //     clearInterval(interval);
  //     console.log('Interval cleared after 10 seconds');
  //     if(recording &&isRecordingBackground){
  //       stopRecording();
  //       setIsRecordingBackground(false);
  //     }
  //   }, 10000);
  //   interval1 = interval;
  // },[]);

  // useEffect(()=>{
  //   if(turnOffRecording){
  //     clearInterval(interval1);
  //     stopRecording();
  //     setIsRecordingBackground(false);
  //   }
  // },[turnOffRecording])


  useEffect(() => {

    return soundRef.current
      ? () => {
          soundRef.current.unloadAsync();
        }
      : undefined;
  }, []);

    return(
    <View >
        <TouchableOpacity
            onPress={handlePress}
            style={styles.floatingButton}
        >
            <Icon name="mic" type="feather" color={recording ? "#0f0" : "#fff"}/>
        </TouchableOpacity>
        {/* {recordedUri && <TouchableOpacity style={styles.floatingButton2} title="Play Recording" onPress={() => handleTranscript(recordedUri)} />} */}
    </View>
    )
}

const styles = StyleSheet.create({
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
  floatingButton2: {
    position: "absolute",
    bottom: 220,
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

export default RecordVoice;


  // const checkAudioFileSize = async (recordingURI) => {
  //   try {
  //     const fileInfo = await FileSystem.getInfoAsync(recordingURI);
  //     if (!fileInfo.exists) {
  //       console.error('Audio file does not exist');
  //       return false;
  //     }

  //     // Read file as base64
  //     const audioData = await FileSystem.readAsStringAsync(recordingURI, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });

  //     // Simple silence detection (file size check)
  //     const fileSize = audioData.length;
  //     if(fileSize > 20000){
  //       stopRecording(); //prevent memory explosion.
  //     }

  //   } catch (error) {
  //     console.error('Failed to analyze audio', error);
  //     return false;
  //   }
  // };