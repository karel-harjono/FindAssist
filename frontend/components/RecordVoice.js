import React, { useState, useEffect, useRef} from 'react';
import { View, Text, Button, StyleSheet,  TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import playSound from './playSound';
import constants from "../constants";
import { Icon } from "react-native-elements";
import { recordingOptions } from '../audioconstants;';
import handleGoogleAPI from './handleGoogleApi';
import * as FileSystem from 'expo-file-system';

const audioSizeLimit = 20000;


const RecordVoice = () =>{
  const [recording, setRecording] = useState(null);
  const [recordedUri, setRecordedUri] = useState(null);
  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  var interval1;
   async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        recordingOptions,
        (status) => console.log(status)
      );
      setIsRecording(true);
      setRecording(recording);
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
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  }

  async function playSound(uri) {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      await sound.playAsync();

      handleGoogleAPI(recordingRef.current.getURI());

    } catch (err) {
      console.error('Failed to play sound', err);
    }
  }
  const checkRecordingStatus = async () => {
    try {

      await checkAudioFileSize(recordingRef.current.getURI());
      const transcript = await handleGoogleAPI(recordingRef.current.getURI());
      if((transcript.includes("ok")||transcript.includes("okay"))&&transcript.includes("Bob")){
        stopRecording();
        clearInterval(interval1);
      }
      console.log("record transcript:"+transcript);
    }catch(err){
      console.log(err);
    }
  }

  const checkAudioFileSize = async (recordingURI) => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(recordingURI);
      if (!fileInfo.exists) {
        console.error('Audio file does not exist');
        return false;
      }

      // Read file as base64
      const audioData = await FileSystem.readAsStringAsync(recordingURI, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Simple silence detection (file size check)
      const fileSize = audioData.length;
      if(fileSize > 20000){
        stopRecording(); //prevent memory explosion.
      }

    } catch (error) {
      console.error('Failed to analyze audio', error);
      return false;
    }
  };
  useEffect(()=>{
    startRecording();
    const interval = setInterval(() => {
        checkRecordingStatus()
    }, 3000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      console.log('Interval cleared after 10 seconds');
      if(recording)stopRecording();
    }, 10000);
    interval1 = interval;
  },[]);



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
            onPress={recording ? stopRecording : startRecording}
            style={styles.floatingButton}
        >
            <Icon name="mic" type="feather" color="#fff" />
        </TouchableOpacity>
        {recordedUri && <TouchableOpacity style={styles.floatingButton2} title="Play Recording" onPress={() => playSound(recordedUri)} />}
    </View>
    )
}

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