import { requestPresignedUrl, uploadToNCPStorage } from '../api/imageApi';

/**
 * 커스텀 이미지 업로드 (presigned URL 발급 + NCP 업로드)
 */
export const uploadCustomSpaceImage = async (imageUri: string): Promise<string> => {
  const presignedInfo = await requestPresignedUrl('SpacePhoto.jpg');
  await uploadToNCPStorage(presignedInfo, imageUri);
  return presignedInfo.key;
};
