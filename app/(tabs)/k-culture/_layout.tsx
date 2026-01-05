import { Stack } from 'expo-router';

// deeplink 클릭 시 먼저 initialRoute로 이동
export const unstable_settings = {
  initialRouteName: 'index',
};

export default function KcultureLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: '케이컬쳐',
        }}
      />
    </Stack>
  );
}
