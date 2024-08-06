import { useEffect, useState } from 'react';
import { Audio } from 'expo-av';

const playSound = (asset) =>{

    var sound;

    async function playSound() {
      console.log('Loading Sound');
      const { sounds } = await Audio.Sound.createAsync( { uri: asset.localUri });
      sound = sounds;
  
      console.log('Playing Sound');
      await sound.playAsync();
    }
  
    playSound();
    if(sound){
        console.log('Unloading Sound');
        sound.unloadAsync();
    }
    
}

export default playSound;