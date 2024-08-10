import express from 'express';

import { SpeechClient } from '@google-cloud/speech';
const router = express.Router();
//const app = express();
const port = 3001;

const client = new SpeechClient();

router.post('/transcribe', async (req, res) => {
    const audioContent = req.body.audioContent; // Audio content in base64
    const os = req.body.os; // Audio content in base64

    const config = os === 'ios' ? {
        encoding: 'LINEAR16',  // Or your audio file's encoding
        sampleRateHertz: 8000,  // Or your audio file's sample rate
        languageCode: 'en-US',
      } : {
        encoding: 'AMR', // Adjust based on your audio format
        sampleRateHertz: 8000, //FOR .amr files
        languageCode: 'en-US',
    };

    // const request = {
    //     audio: {
    //         content: audioContent,
    //     },
    //     config: {
    //         encoding: 'LINEAR16', // Adjust based on your audio format
    //         sampleRateHertz: 48000, // Adjust based on your audio format
    //         languageCode: 'en-US',
    //     },
    // };
    const request = {
        audio: {
            content: audioContent,
        },
        config
    };
    try {
        
        const [response] = await client.recognize(request);
        if (response.results.length === 0) {
            console.log('No transcription results found');
        } else {
            const transcript = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
            res.json({ transcript });
        }
        

    } catch (error) {
        console.error('Error transcribing audio:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;