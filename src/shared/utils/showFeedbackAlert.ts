import { Alert } from 'react-native';

export async function showFeedbackAlert(onPressHandler: (satisfied: string) => Promise<void>) {
  Alert.alert(
    'How was your experience with Kori?',
    "We'd love to hear your valuable feedback. Your input will help us provide a better service.",
    [
      {
        text: 'Not really',
        onPress: async () => onPressHandler('Unsatisfied'),
      },
      {
        text: 'Good',
        onPress: async () => onPressHandler('Satisfied'),
      },
    ],
  );
  return null;
}

export function showFeedbackFailedAlert() {
  Alert.alert('Feedback Submit Failed', 'There was an issue sending your feedback. Please try again later.', [
    { text: 'Close' },
  ]);
}

export function showFeedbackDoneAlert() {
  Alert.alert('Thank you for your feedback!', 'We appreciate your time and effort in helping us improve Kori.', [
    { text: 'Close' },
  ]);
}
