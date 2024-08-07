import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import audioFile from '../assets/ding.mp3';

const playSound = async ()=>{
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
export default playSound;