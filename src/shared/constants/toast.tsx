import SnackBar from '@/src/shared/components/SnackBar';
import { ToastConfigParams } from 'react-native-toast-message';

export const toastConfig = {
  success: ({ text1, text2, props }: ToastConfigParams<{}>) => (
    <SnackBar type="success" message={text1 || ''} message2={text2 || ''} />
  ),
  error: ({ text1, text2, props }: ToastConfigParams<{}>) => (
    <SnackBar type="error" message={text1 || ''} message2={text2 || ''} />
  ),
};
