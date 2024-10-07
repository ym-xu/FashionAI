import { API_BASE_URL } from '../config';

export const uploadToCloudflare = async (imageBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('file', imageBlob);
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload-to-cloudflare`, {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Cloudflare upload error:', errorData);
        throw new Error(errorData.detail || `Upload failed: ${response.status}`);
      }
  
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error uploading to Cloudflare:', error);
      throw error;
    }
};