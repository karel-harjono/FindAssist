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
    extension: '.amr',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_AMR,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 8000,
    numberOfChannels: 1,
    bitRate: 12200,
  },
};

// General recording options
const recordingOptions = {
  ...Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
  ...recordingOptionsAndroid,
  ...recordingOptionsIOS,
};

export { recordingOptions };