import * as FileSystem from 'expo-file-system';

const fileExists = async (fileUri) => {
  try {
    console.log("fileExistrs");
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      return fileInfo.exists;
  } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
  }
};

export default fileExists;