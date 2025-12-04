import * as FileSystem from 'expo-file-system';

type UploadArgs = {
  putUrl: string;
  headers: Record<string, string>;
  fileUri: string;
};

export async function uploadImageToPresignedUrl({ putUrl, headers, fileUri }: UploadArgs) {
  try {
    const res = await FileSystem.uploadAsync(putUrl, fileUri, {
      httpMethod: 'PUT',
      headers: {
        ...headers,
        'Content-Type': headers['Content-Type'] || 'image/jpeg', // fallback
      },
    });

    if (res.status !== 200) {
      throw new Error(`Upload failed with status ${res.status}`);
    }
  } catch (err) {
    console.error('[upload:fail]', err);
    throw err;
  }
}
