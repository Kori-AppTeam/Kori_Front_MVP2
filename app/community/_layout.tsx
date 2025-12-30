import { Stack } from 'expo-router';

export default function CommunityStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 모든 자식 화면의 헤더를 숨김
      }}
    >
      <Stack.Screen
        name="detail/[id]"
        options={{
          title: '게시글',
        }}
      />
      <Stack.Screen
        name="write/index"
        options={{
          title: '글쓰기',
        }}
      />
      <Stack.Screen
        name="bookmark-list/index"
        options={{
          title: '북마크',
        }}
      />
      <Stack.Screen
        name="my-history/index"
        options={{
          title: '히스토리',
        }}
      />
      <Stack.Screen
        name="search/index"
        options={{
          title: '검색 페이지',
        }}
      />
    </Stack>
  );
}
