import * as ImagePicker from 'expo-image-picker';

export function inferMimeType(uri: string, fallback: string) {
  const ext = uri.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
  if (!ext) return fallback;
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'heic') return 'image/heic';
  return fallback;
}

export function coerceProfileMimeType(typeMime: string): 'image/jpeg' | 'image/png' | 'image/webp' {
  if (typeMime === 'image/png') return 'image/png';
  if (typeMime === 'image/webp') return 'image/webp';
  return 'image/jpeg';
}

export function inferFileName(uri: string, fallback: string) {
  const base = uri.split('?')[0].split('#')[0].split('/').pop();
  if (!base) return fallback;
  return base.includes('.') ? base : fallback;
}

export function getImagePickerMediaTypeCompat() {
  return (ImagePicker as any).MediaType || (ImagePicker as any).MediaTypeOptions;
}
