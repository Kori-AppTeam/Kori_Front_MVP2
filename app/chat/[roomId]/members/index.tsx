// 채팅방 구성원 확인 페이지
import { ChatMembersHeader } from '@/src/features/chat/member/components/ChatMembersHeader';
import { LeaveChatButton } from '@/src/features/chat/member/components/LeaveChatButton';
import { MembersList } from '@/src/features/chat/member/components/MembersList';
import { ReportBlockModal } from '@/src/features/chat/member/components/ReportBlockModal';
import { ReportDetailModal } from '@/src/features/chat/member/components/ReportDetailModal';
import { ReportReasonModal } from '@/src/features/chat/member/components/ReportReasonModal';
import { useChatMembers } from '@/src/features/chat/member/hooks/useChatMembers';
import { useLeaveChatRoom } from '@/src/features/chat/member/hooks/useLeaveChatRoom';
import { useReportBlock } from '@/src/features/chat/member/hooks/useReportBlock';
import type { ReportReason } from '@/src/features/chat/member/types';
import ProfileModal from '@/src/shared/components/ProfileModal';
import { useUserProfileQuery } from '@/src/shared/hooks/useUserProfileQuery';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';

const ChatInsideMember = () => {
  const router = useRouter();
  const { roomId, roomName } = useLocalSearchParams<{ roomId: string; roomName: string }>();

  // 멤버 목록 & 프로필
  const { members } = useChatMembers({ roomId });

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const { data: selectedUser, isLoading, error } = useUserProfileQuery(selectedUserId);

  const [profileVisible, setProfileVisible] = useState(false);

  const handleProfilePress = (userId: number) => {
    setSelectedUserId(userId);
    setProfileVisible(true);
  };

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
          onPressProfile={handleProfilePress}
          onPressMore={reportBlock.openReportBlockMenu}
        />

        {/* Profile Modal */}
        <ProfileModal
          visible={profileVisible}
          userData={selectedUser}
          onClose={() => setProfileVisible(false)}
          routeType="replace"
          dissMissCount={1}
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
