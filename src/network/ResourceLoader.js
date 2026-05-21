import * as FileSystem from 'expo-file-system';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

class ResourceLoader {
  constructor() {
    this.localPath = FileSystem.documentDirectory + 'world_map.bin';
    this.storage = getStorage();
  }

  async syncResources() {
    const fileInfo = await FileSystem.getInfoAsync(this.localPath);
    
    if (fileInfo.exists) return true;

    try {
      const storageRef = ref(this.storage, 'maps/world_map.bin');
      const downloadUrl = await getDownloadURL(storageRef);
      
      await FileSystem.downloadAsync(downloadUrl, this.localPath);
      return true;
    } catch (e) {
      throw new Error('SyncFailed');
    }
  }

  async getMapData() {
    const content = await FileSystem.readAsStringAsync(this.localPath);
    return JSON.parse(content);
  }
}

export default new ResourceLoader();
