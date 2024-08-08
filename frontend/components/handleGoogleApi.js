import * as FileSystem from 'expo-file-system';
//import fileExists from "./fileExists";




const handleGoogleAPI = async (audioURI)=>{
  var transcript1 = '';

    
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
            const response = await fetch('http://192.16.32.148:3001/speech/transcribe', {
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
    const convertAudio = async (fileUri) => {
        try {
            const audioContent = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return audioContent;
        } catch (error) {
            console.error('Error reading file:', error);
            throw error;
        }
    };

    const handleAudioUpload = async (audioURI) => {
      // Convert audio file to base64 or any required format
      try {
          //const filePath = await findMP3();
          //if(filePath != null){ //change this later
          if(audioURI !=null){  
            const audioContent = await convertAudio(audioURI);
            const transcript = await transcribeAudio(audioContent);
            return transcript;
          }else{
            return null;
          }
      } catch (error) {
          console.error('Error checking file existence:', error);
          return false;
      }
    };


    return handleAudioUpload(audioURI);
}

export default handleGoogleAPI;