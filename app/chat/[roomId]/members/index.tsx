// 채팅방 구성원 확인 페이지
import ProfileModal from '@/components/ProfileModal';
import {
  ChatMembersHeader,
  LeaveChatButton,
  MembersList,
  ReportBlockModal,
  ReportDetailModal,
  ReportReasonModal,
} from '@/src/features/chat/member/components';
import { useChatMembers, useLeaveChatRoom, useReportBlock } from '@/src/features/chat/member/hooks';
import type { ReportReason } from '@/src/features/chat/member/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';

const ChatInsideMember = () => {
  const router = useRouter();
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName: string }>();

  // 멤버 목록 & 프로필
  const { members, isLoadingMembers, userProfile } = useChatMembers({ roomId });
  const { state: profileState, actions: profileActions } = userProfile;

  // 채팅방 나가기
  const { handleLeaveChat } = useLeaveChatRoom({ roomId });

  // 신고/차단
  const reportBlock = useReportBlock({
    roomId,
    onLeaveChat: handleLeaveChat,
  });

  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <Container>
        {/* Header */}
        <ChatMembersHeader roomName={roomName || 'Chat Room'} onBack={() => router.back()} />

        {/* Members List */}
        <MembersList
          members={members}
          onPressProfile={profileActions.fetchProfile}
          onPressMore={reportBlock.openReportBlockMenu}
        />

        {/* Profile Modal */}
        <ProfileModal
          visible={profileState.isVisible}
          userData={profileState.selectedUser}
          onClose={profileActions.closeProfile}
          onFollow={profileActions.followUser}
          onUnfollow={profileActions.unfollowUser}
          onChat={profileActions.startChat}
        />

        {/* Leave Chat Button */}
        <LeaveChatButton onPress={handleLeaveChat} />

        {/* Report/Block Modal */}
        <ReportBlockModal
          bottomSheetRef={reportBlock.reportBlockSheetRef}
          targetUserName={reportBlock.selectedMemberName || ''}
          onPressBlock={reportBlock.handleBlockUser}
          onPressReport={reportBlock.openReportReasonSheet}
        />

        {/* Report Reason Modal */}
        <ReportReasonModal
          bottomSheetRef={reportBlock.reportReasonSheetRef}
          onSelectReason={(reason: ReportReason) => {
            reportBlock.openReportDetailSheet();
          }}
        />

        {/* Report Detail Modal */}
        <ReportDetailModal
          bottomSheetRef={reportBlock.reportDetailSheetRef}
          onSubmit={reportBlock.handleSubmitReport}
        />
      </Container>
    </SafeArea>
  );
};

export default ChatInsideMember;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: #191a1c;
`;

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;
