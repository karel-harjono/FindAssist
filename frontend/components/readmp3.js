import * as FileSystem from 'expo-file-system';

const readmp3 = async (fileUri) => {
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
export default readmp3;