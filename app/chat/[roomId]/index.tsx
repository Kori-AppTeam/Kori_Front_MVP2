//채팅방 화면
import api from '@/api/axiosInstance';
import ProfileModal from '@/components/ProfileModal';
import Header from '@/src/features/chat/room/components/header/Header';
import MessageInput from '@/src/features/chat/room/components/input/MessageInput';
import MessageList from '@/src/features/chat/room/components/message/MessageList';
import SearchNavigation from '@/src/features/chat/room/components/search/SearchNavigation';
import TranslateButton from '@/src/features/chat/room/components/TranslateButton';
import { useChatMessages } from '@/src/features/chat/room/hooks/useChatMessages';
import { useMessageActions } from '@/src/features/chat/room/hooks/useMessageActions';
import { useMessageSearch } from '@/src/features/chat/room/hooks/useMessageSearch';
import { useStompConnection } from '@/src/features/chat/room/hooks/useStompConnection';
import { useTranslation } from '@/src/features/chat/room/hooks/useTranslation';
import { useUserProfile } from '@/src/features/chat/room/hooks/useUserProfile';
import { Config } from '@/src/lib/config';
import { CHAT_MEMBER_ROUTE } from '@/src/shared/constants/route';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

const ChattingRoomScreen = () => {
  // ----------- states ----------- //
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName: string }>();
  const [myUserId, setMyUserId] = useState<string>('');

  // ----------- hooks ----------- //
  const stompClient = useStompConnection();
  stompClient.connect(); // 컴포넌트 렌더링 시점에 연결 시도
  const messageState = useChatMessages(roomId, stompClient);
  const messageActions = useMessageActions(stompClient);
  const messageSearch = useMessageSearch(roomId, messageState.state.messages);
  const { isTranslate, toggleTranslate } = useTranslation(roomId, messageState.updateMessageList);
  const userProfile = useUserProfile();

  // ----------- effects & handlers ----------- //
  useEffect(() => {
    const fetchData = async () => {
      // 사용자 ID 가져오기
      const userId = await SecureStore.getItemAsync('MyuserId');
      setMyUserId(userId || '');

      // 채팅방 메시지 모두 읽음 처리
      await api.post(`${Config.SERVER_URL}/api/v1/chat/rooms/${roomId}/read-all`);
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
          onShowMembers={() => router.push({
            pathname: CHAT_MEMBER_ROUTE(Number(roomId)),
            params: { roomId, roomName },
          })}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          {/* 채팅 화면 */}
          <ChattingScreen>
            <MessageList
              messages={messageState.state.messages}
              myUserId={myUserId}
              isTranslate={isTranslate}
              searchKeyword={messageSearch.state.isSearching ? messageSearch.state.searchText : undefined}
              isCurrentMessage={messageSearch.isCurrentMessage}
              onLoadMore={messageState.loadMessages}
              onDeleteMessage={messageActions.deleteMessageWithConfirm}
              onProfilePress={userProfile.actions.fetchProfile}
              flatListRef={messageSearch.flatListRef}
            />

            {/* 하단 입력창 또는 검색 내비게이션 */}
            {messageSearch.state.isActive ? (
              <SearchNavigation
                onNavigateUp={() => messageSearch.navigateToUp()}
                onNavigateDown={() => messageSearch.navigateToDown()}
                searchResultText={messageSearch.getSearchResultText()}
              />
            ) : (
              <MessageInput
                message={messageState.state.currentMessage}
                onMessageChange={messageState.handleMessageChange}
                onSendMessage={() => messageActions.sendMessage(roomId)}
                paddingBottom={insets.bottom}
              />
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

            {/* 번역 버튼 */}
            <TranslateButton
              isTranslating={isTranslate}
              onToggle={toggleTranslate}
            />
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
