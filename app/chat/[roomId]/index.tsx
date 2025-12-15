//채팅방 화면
import { readMessageAllAPI } from '@/src/features/chat/room/api/messages';
import Header from '@/src/features/chat/room/components/header/Header';
import MessageInput from '@/src/features/chat/room/components/input/MessageInput';
import MessageList from '@/src/features/chat/room/components/message/MessageList';
import SearchNavigation from '@/src/features/chat/room/components/search/SearchNavigation';
import { useChatMessages } from '@/src/features/chat/room/hooks/useChatMessages';
import { useMessageActions } from '@/src/features/chat/room/hooks/useMessageActions';
import { useMessageSearch } from '@/src/features/chat/room/hooks/useMessageSearch';
import { useUserProfile } from '@/src/features/chat/shared/hooks/useUserProfile';
import ProfileModal from '@/src/shared/components/ProfileModal';
import { CHAT_MEMBER_ROUTE } from '@/src/shared/constants/route';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const ChattingRoomScreen = () => {
  // ----------- states ----------- //
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName: string }>();
  const [myUserId, setMyUserId] = useState<string>('');

  // ----------- hooks ----------- //
  const { loadMessages } = useChatMessages(roomId);
  const messageActions = useMessageActions();
  const messageSearch = useMessageSearch(roomId);
  const userProfile = useUserProfile();

  // ----------- effects & handlers ----------- //
  useEffect(() => {
    const fetchData = async () => {
      // 사용자 ID 가져오기
      const userId = await SecureStore.getItemAsync('MyuserId');
      setMyUserId(userId || '');

      // 채팅방 메시지 모두 읽음 처리
      await readMessageAllAPI(roomId);
    };

    fetchData();
  }, [roomId]);

  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <Container>
        {/* 헤더 */}
        <Header
          roomName={roomName}
          onSearchSubmit={messageSearch.performSearch}
          onShowMembers={() =>
            router.push({
              pathname: CHAT_MEMBER_ROUTE(Number(roomId)),
              params: { roomName },
            })
          }
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 26}
        >
          {/* 채팅 화면 */}
          <ChattingScreen>
            <MessageList
              myUserId={myUserId}
              onLoadMore={loadMessages}
              onDeleteMessage={messageActions.deleteMessageWithConfirm}
              onProfilePress={userProfile.actions.fetchProfile}
              flatListRef={messageSearch.flatListRef}
            />

            {/* 하단 입력창 또는 검색 내비게이션 */}
            {messageSearch.state.isActive ? (
              <SearchNavigation
                onNavigateUp={() => messageSearch.navigateToUp()}
                onNavigateDown={() => messageSearch.navigateToDown()}
              />
            ) : (
              <MessageInput onSendMessage={() => messageActions.sendMessage(roomId)} paddingBottom={insets.bottom} />
            )}

            {/* 프로필 모달 */}
            <ProfileModal
              visible={userProfile.state.isVisible}
              userData={userProfile.state.selectedUser}
              onClose={userProfile.actions.closeProfile}
              onFollow={userProfile.actions.followUser}
              onUnfollow={userProfile.actions.unfollowUser}
              onChat={userProfile.actions.startChat}
            />

            {/* 번역 버튼 추후 변경 혹은 삭제 예정 */}
            {/* <TranslateButton /> */}
          </ChattingScreen>
        </KeyboardAvoidingView>
      </Container>
    </SafeArea>
  );
};

export default ChattingRoomScreen;

// ===================== styled-components =====================
const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #1d1e1f;
`;
const Container = styled.View`
  flex: 1;
  background-color: #1d1e1f;
  padding: 0px 15px;
`;

const ChattingScreen = styled.View`
  flex: 1;
  flex-direction: column;
  padding-bottom: 10px;
`;
