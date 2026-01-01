import { Stack } from 'expo-router';

export default function KcultureStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 모든 자식 화면의 헤더를 숨김
      }}
    >
      <Stack.Screen
        name="/k-news/index"
        options={{
          title: 'K-News',
        }}
      />
      <Stack.Screen
        name="detail/[newId]"
        options={{
          title: '뉴스 상세',
        }}
      />
      <Stack.Screen
        name="search/index"
        options={{
          title: 'K-News 검색',
        }}
      />
    </Stack>
  );
}
