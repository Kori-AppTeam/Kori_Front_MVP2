import AllSpaceRoomBox from '@/src/features/chat/components/AllSpaceRoomBox';
import BuzzingRoomBox from '@/src/features/chat/components/BuzzingRoomBox';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import { fetchAllSpaces, fetchBuzzingSpaces } from '../api/groupChatRooms';

// 🔹 데이터 타입
type BuzzingData = {
  roomId: number;
  roomImageUrl: string;
  roomName: string;
  description: string;
  userCount: string;
};

// 🔹 memo 적용
const MemoizedBuzzingRoomBox = memo(({ data }: { data: BuzzingData }) => <BuzzingRoomBox data={data} />);

const MemoizedAllSpaceRoomBox = memo(({ data }: { data: BuzzingData }) => <AllSpaceRoomBox data={data} />);

export const GroupChatList = () => {
  const [buzzingSpaces, setBuzzingSpaces] = useState<BuzzingData[]>([]);
  const [allSpaces, setAllSpaces] = useState<BuzzingData[]>([]);
  const [lastChatRoomId, setLastChatRoomId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const Buzzing_Data = await fetchBuzzingSpaces();
        setBuzzingSpaces(Buzzing_Data);
      } catch (err) {
        console.error('Linked Space 불러오기 실패:', err);
      }
    };
    fetchRooms();
  }, []);

  // 🔹 무한 스크롤 - 추가 데이터 로드
  const loadMoreSpaces = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const moreData = await fetchAllSpaces(lastChatRoomId);

      if (moreData && moreData.length > 0) {
        setAllSpaces((prev) => [...prev, ...moreData]);
        setLastChatRoomId(moreData[moreData.length - 1].roomId);
        setHasMore(moreData.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('추가 데이터 로드 실패:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastChatRoomId]);

  // 🔹 ListHeaderComponent를 분리
  const ListHeader = () => (
    <View>
      <GroupTitleContainer>
        <GroupTitleText>Buzzing Spaces</GroupTitleText>
      </GroupTitleContainer>

      <BuzzingContainer>
        <FlatList
          data={buzzingSpaces}
          renderItem={({ item }) => <MemoizedBuzzingRoomBox data={item} />}
          keyExtractor={(item) => item.roomId.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </BuzzingContainer>

      <GroupTitleContainer>
        <GroupTitleText>All Spaces</GroupTitleText>
      </GroupTitleContainer>
    </View>
  );

  // 🔹 Footer - 로딩 인디케이터
  const ListFooter = () => {
    if (!isLoading) return null;
    return (
      <FooterContainer>
        <ActivityIndicator size="small" color="#ffffff" />
      </FooterContainer>
    );
  };

  return (
    <Container>
      <FlatList
        data={allSpaces}
        renderItem={({ item }) => <MemoizedAllSpaceRoomBox data={item} />}
        keyExtractor={(item) => item.roomId.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<ListHeader />}
        ListFooterComponent={<ListFooter />}
        onEndReached={loadMoreSpaces}
        onEndReachedThreshold={0.5}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </Container>
  );
};

// 🔹 스타일
const Container = styled.View`
  flex: 1;
`;

const GroupTitleContainer = styled.View`
  justify-content: center;
  height: 70px;
`;

const GroupTitleText = styled.Text`
  font-family: PlusJakartaSans_700Bold;
  font-size: 18px;
  color: #ffffff;
`;

const BuzzingContainer = styled.View`
  height: 236px;
`;

const FooterContainer = styled.View`
  padding: 20px;
  align-items: center;
`;
