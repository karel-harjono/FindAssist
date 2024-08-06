import React, { useState, useEffect, useRef} from 'react';
import readmp3 from "./readmp3";
import * as FileSystem from 'expo-file-system';
//import fileExists from "./fileExists";
import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import audioFile from '../assets/test1.wav'

const handleGoogleAPI = ()=>{
    const findMP3 = async ()=>{
        try{
          const asset = Asset.fromModule(audioFile);
          await asset.downloadAsync();
    
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
    
      // const transcribeAudio = async (audioContent) =>{
      //   fetch('http://10.0.0.253:3001/')
      //           .then(response => response.text())
      //           .then(data => {
      //               console.log(data);
      //           })
      //           .catch((error) => {
      //               console.error('Error:', error);
      //           });
      // }
    
      const transcribeAudio = async (audioContent) => {
        try {
          console.log("transcribing audio");
          //change the address according to your IP. 
            const response = await fetch('http://10.0.0.253:3001/speech/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ audioContent }),
            });
            const data = await response.json();
            console.log('Transcript:', data.transcript);
            return data.transcript;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    };
    
    const handleAudioUpload = async () => {
      // Convert audio file to base64 or any required format
      try {
          const filePath = await findMP3();
          if(filePath != null){ //change this later
            const audioContent = await readmp3(filePath);
            const transcript = await transcribeAudio(audioContent);
            console.log('Transcript:', transcript);
          }
      } catch (error) {
          console.error('Error checking file existence:', error);
          return false;
      }
    };


    handleAudioUpload();
      
}

export default handleGoogleAPI;