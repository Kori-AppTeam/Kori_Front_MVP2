import React from 'react';
import { ActivityIndicator, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useLinkedSpaceRecommend } from '../hooks/useLinkedSpaceRecommend';

interface Props {
  visible: boolean;
  onJoin: (roomId: string, roomName: string) => void;
  onDontShowToday: () => void;
  onClose: () => void;
}

export const LinkedSpaceRecommendModal = ({ visible, onJoin, onDontShowToday, onClose }: Props) => {
  const { data, isLoading } = useLinkedSpaceRecommend(visible);
  // data가 없으면 모달을 렌더링하지 않음
  if (!visible || (!isLoading && !data)) {
    return null;
  }

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <ModalBackground>
        <BottomSheet>
          <ModalCard source={require('@/assets/images/background2.png')}>
            {isLoading ? (
              <LoadingContainer>
                <ActivityIndicator color="#fff" size="large" />
              </LoadingContainer>
            ) : data ? (
              <ContentContainer>
                <LeftSection>
                  <LeftTextSection>
                    <BadgeText>Trending space</BadgeText>
                    <SpaceName numberOfLines={2}>{data.roomName}</SpaceName>
                  </LeftTextSection>
                  <JoinButton onPress={() => onJoin(String(data.roomId), data.roomName)} activeOpacity={0.8}>
                    <JoinButtonText>Join</JoinButtonText>
                  </JoinButton>
                </LeftSection>

                <RightSection>
                  <SpaceImage source={{ uri: data.roomImageUrl }} />
                </RightSection>
              </ContentContainer>
            ) : null}
          </ModalCard>

          <BottomActions>
            <ActionButton onPress={onDontShowToday} activeOpacity={0.7}>
              <ActionText>Don't Show again today</ActionText>
            </ActionButton>
            <ActionButton onPress={onClose} activeOpacity={0.7}>
              <ActionText>Close</ActionText>
            </ActionButton>
          </BottomActions>
        </BottomSheet>
      </ModalBackground>
    </Modal>
  );
};

const ModalBackground = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.7);
`;

const BottomSheet = styled.View`
  width: 100%;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
`;

const ModalCard = styled.ImageBackground`
  width: 100%;
  min-height: 28%;
  justify-content: center;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
  overflow: hidden;
`;

const LoadingContainer = styled.View`
  min-height: 150px;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  min-height: 150px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-left: 5%;
  padding-right: 5%;
`;

const LeftTextSection = styled.View`
  gap: 8px;
`;

const LeftSection = styled.View`
  flex: 1;
  gap: 32px;
  max-width: 40%;
`;

const RightSection = styled.View`
  max-width: 40%;
`;

const BadgeText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: 400;
`;

const SpaceName = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
  line-height: 42px;
`;

const SpaceImage = styled.Image`
  width: 162px;
  height: 162px;
  border-radius: 200px;
`;

const JoinButton = styled.TouchableOpacity`
  background-color: #02F59B;
  padding: 16px 30px;
  border-radius: 10px;
  align-self: flex-start;
`;

const JoinButtonText = styled.Text`
  color: #1D1E1F;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0.3px;
`;

const BottomActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 5%;
  padding-bottom: 32px;
  background-color: #171818;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 4px;
`;

const ActionText = styled.Text`
  color: #CCCFD0;
  font-size: 14px;
  font-weight: 500;
`;
