//링크드 스페이스 상세 페이지
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import { JoinButton } from '@/src/features/linked-space/detail/components/JoinButton';
import { LinkedSpaceDescription } from '@/src/features/linked-space/detail/components/LinkedSpaceDescription';
import { LinkedSpaceHeader } from '@/src/features/linked-space/detail/components/LinkedSpaceHeader';
import { LinkedSpaceInfo } from '@/src/features/linked-space/detail/components/LinkedSpaceInfo';
import { useJoinLinkedSpace } from '@/src/features/linked-space/detail/hooks/useJoinLinkedSpace';
import { useLinkedSpaceDetail } from '@/src/features/linked-space/detail/hooks/useLinkedSpaceDetail';
import { BottomSpacer, Container, DetailContainer, SectionDivider } from '@/src/features/linked-space/detail/styles';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

const LinkedSpaceDetail = () => {
  const { roomId: linkedSpaceId } = useLocalSearchParams<{ roomId: string }>();

  const { linkedSpaceDetail, isLoading } = useLinkedSpaceDetail(linkedSpaceId);
  const { handleJoin, isJoining, profileModalVisible, setProfileModalVisible } = useJoinLinkedSpace(
    linkedSpaceId,
    linkedSpaceDetail?.roomName,
  );

  return (
    <Container>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <LinkedSpaceHeader imageUrl={linkedSpaceDetail?.roomImageUrl} />

        <DetailContainer>
          {linkedSpaceDetail && (
            <>
              <LinkedSpaceInfo
                title={linkedSpaceDetail.roomName}
                ownerImageUrl={linkedSpaceDetail.ownerImageUrl}
                ownerFirstName={linkedSpaceDetail.ownerFirstName}
                participantCount={linkedSpaceDetail.participantCount}
                participantsImageUrls={linkedSpaceDetail.participantsImageUrls}
              />

              <SectionDivider />

              <LinkedSpaceDescription description={linkedSpaceDetail.description} />
            </>
          )}
        </DetailContainer>
      </ScrollView>

      <JoinButton onPress={handleJoin} disabled={isJoining || isLoading} />
      <BottomSpacer />

      <ProfileSetupModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />
    </Container>
  );
};

export default LinkedSpaceDetail;
