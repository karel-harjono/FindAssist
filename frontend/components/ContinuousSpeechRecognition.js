import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { Audio } from 'expo-av';
import { recordingOptions } from '../audioconstants;';
import handleGoogleAPI from './handleGoogleApi';

const SILENCE_THRESHOLD = 0.05; // Adjust this value based on your needs

const ContinuousSpeechRecognition = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recording = useRef(null);
  
    useEffect(() => {
      startListening();
  
      const interval = setInterval(() => {
        if (isRecording) {
          checkRecordingStatus();
        }
      }, 3000);
  
      return () => {
        clearInterval(interval);
        stopRecordingIfNecessary();
      };
    }, [isRecording]);
  
    const stopRecordingIfNecessary = async () => {
      if (recording.current) {
        try {
          const status = await recording.current.getStatusAsync();
          if (status.isRecording) {
            await recording.current.stopAndUnloadAsync();
          }
        } catch (error) {
          console.error('Failed to stop and unload recording', error);
        }
      }
    };
  
    const startListening = async () => {
      try {
        console.log('Requesting permissions...');
        const response = await Audio.requestPermissionsAsync();
        if (response.granted) {
          console.log('Permissions granted');
          await prepareRecording();
        }
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    };
  
    const prepareRecording = async () => {
      try {
        await stopRecordingIfNecessary();
        recording.current = new Audio.Recording();
        await recording.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.current.startAsync();
        setIsRecording(true);
        console.log('Recording started');
      } catch (error) {
        console.error('Failed to prepare recording', error);
      }
    };
  
    const checkRecordingStatus = async () => {
      try {
        if (recording.current) {
          const status = await recording.current.getStatusAsync();
          if (status.isRecording) {
            console.log('Recording...');
            await recording.current.stopAndUnloadAsync();
            const isSilent = await isAudioSilent(recording.current);
            if (!isSilent) {
              await processAudio(recording.current);
            }
            await prepareRecording(); // Restart the listening process
          }
        }
      } catch (error) {
        console.error('Failed to get recording status', error);
      }
    };
  
    const isAudioSilent = async (recording) => {
      try {
        const { sound } = await recording.createNewLoadedSoundAsync();
        const audioData = await sound.getStatusAsync();
        const { uri } = audioData;
  
        const response = await fetch(uri);
        const buffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(buffer);
        const channelData = audioBuffer.getChannelData(0);
  
        let isSilent = true;
        for (let i = 0; i < channelData.length; i++) {
          if (Math.abs(channelData[i]) > SILENCE_THRESHOLD) {
            isSilent = false;
            break;
          }
        }
  
        await sound.unloadAsync();
        return isSilent;
      } catch (error) {
        console.error('Failed to analyze audio', error);
        return false;
      }
    };
  
  const processAudio = async (recording) => {
    try {
      const { sound, status } = await recording.createNewLoadedSoundAsync();
      const audioData = await sound.getStatusAsync();
      const { uri } = audioData;

      const response = await fetch(uri);
      const audioBlob = await response.blob();

      console.log("processing audio step!");
      //const result = await speechToText(audioBlob);
      //setTranscript(result);

      sound.unloadAsync();
    } catch (error) {
      console.error('Failed to process audio', error);
    }
  };

  return (
    <View>
    </View>
  );
};

export default ContinuousSpeechRecognition;