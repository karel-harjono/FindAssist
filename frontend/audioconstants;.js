import { Audio } from 'expo-av';

// Android recording options
const recordingOptionsAndroid = {
  android: {
    extension: '.amr',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_NB,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_NB,
    sampleRate: 8000,
    numberOfChannels: 1,
    bitRate: 12200,
  },
};

// iOS recording options
const recordingOptionsIOS = {
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,  // Lowered quality
    sampleRate: 16000,  // Adequate for clear speech recognition
    numberOfChannels: 1,
    bitRate: 64000,  // Lowered bitrate
  },
};

// General recording options
const recordingOptions = {
  ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
  ...recordingOptionsAndroid,
  ...recordingOptionsIOS,
};

export { recordingOptions };