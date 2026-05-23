import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Helper function to create a local URI from a resource path
const getLocalUri = (resourcePath) => {
  const fileName = resourcePath.split('/').pop();
  return FileSystem.documentDirectory + fileName;
};

class ResourceLoader {
  constructor() {
    this.storage = getStorage();
  }

  /**
   * Parses raw string data into the specified format.
   * @param {string} data - The raw string data.
   * @param {string} dataType - The target data type.
   * @returns {any} - The parsed data.
   */
  parseData(data, dataType) {
    if (dataType === 'json') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse JSON data:", e);
        throw new Error("JsonParseFailed");
      }
    }
    return data;
  }

  /**
   * Fetches a resource. It first checks the local file system. If not available,
   * it downloads it from Firebase Storage and saves it locally.
   * @param {string} resourcePath - The path to the resource in Firebase Storage (e.g., 'maps/world_map.bin').
   * @param {string} dataType - The expected data type, e.g., 'json' or 'string'.
   * @returns {Promise<any>} - The resource content.
   */
  async getResource(resourcePath, dataType = 'json') {
    const localUri = getLocalUri(resourcePath);
    const fileInfo = await FileSystem.getInfoAsync(localUri);

    // 1. Check if file exists locally
    if (fileInfo.exists) {
      console.log(`[ResourceLoader] Loading resource from local cache: ${resourcePath}`);
      const content = await FileSystem.readAsStringAsync(localUri);
      return this.parseData(content, dataType);
    }

    // 2. If not, download from Firebase Storage
    console.log(`[ResourceLoader] Resource not in cache. Downloading from Firebase: ${resourcePath}`);
    try {
      const storageRef = ref(this.storage, resourcePath);
      const downloadUrl = await getDownloadURL(storageRef);
      
      const { uri } = await FileSystem.downloadAsync(downloadUrl, localUri);
      
      const content = await FileSystem.readAsStringAsync(uri);
      // No need to save again, downloadAsync already saved it.
      
      return this.parseData(content, dataType);

    } catch (error) {
      console.error(`[ResourceLoader] Failed to download resource: ${resourcePath}`, error);
      // As a fallback, check if the file was perhaps downloaded before the crash but not registered.
      // This is a last-ditch effort.
      const finalCheck = await FileSystem.getInfoAsync(localUri);
      if (finalCheck.exists) {
          const content = await FileSystem.readAsStringAsync(localUri);
          return this.parseData(content, dataType);
      }
      throw new Error(`ResourceLoadFailed: ${resourcePath}`);
    }
  }

  // Backward compatibility for existing calls in GameStateManager, etc.
  async getMapData() {
    return this.getResource('maps/world_map.bin', 'json');
  }
}

export default new ResourceLoader();
