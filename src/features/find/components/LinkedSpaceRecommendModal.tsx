import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import { useLinkedSpaceRecommend } from '../hooks/useLinkedSpaceRecommend';

interface Props {
  visible: boolean;
  onJoin: (roomId: string, roomName: string) => void;
  onDontShowToday: () => void;
  onClose: () => void;
}

export const LinkedSpaceRecommendModal = ({ visible, onJoin, onDontShowToday, onClose }: Props) => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const { data } = useLinkedSpaceRecommend(visible);

  // visible이 변경될 때 모달을 열거나 닫음
  useEffect(() => {
    if (visible && data) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible, data]);

  // data가 없으면 모달을 렌더링하지 않음
  if (!visible || !data) {
    return null;
  }

  return (
    <CustomBottomSheet ref={bottomSheetRef} backgroundColor="transparent" handleComponent={() => null}>
      <BottomSheetContent>
        <ModalCard source={require('@/assets/images/background2.png')}>
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
        </ModalCard>

        <BottomActions>
          <ActionButton onPress={onDontShowToday} activeOpacity={0.7}>
            <ActionText>Don't Show again today</ActionText>
          </ActionButton>
          <ActionButton onPress={onClose} activeOpacity={0.7}>
            <ActionText>Close</ActionText>
          </ActionButton>
        </BottomActions>
      </BottomSheetContent>
    </CustomBottomSheet>
  );
};

const BottomSheetContent = styled.View`
  width: 100%;
  border-top-left-radius: 22px;
  border-top-right-radius: 22px;
`;

const ModalCard = styled.ImageBackground`
  width: 100%;
  min-height: 300px;
  justify-content: center;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  overflow: hidden;
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
  gap: 28px;
  max-width: 40%;
`;

const RightSection = styled.View`
  max-width: 40%;
`;

const BadgeText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  font-family: ${({ theme }) => theme.fonts.body.B4_R.fontFamily};
  font-size: ${({ theme }) => theme.fonts.body.B4_R.fontSize}px;
  line-height: ${({ theme }) => theme.fonts.body.B4_R.lineHeight}px;
`;

const SpaceName = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  font-family: ${({ theme }) => theme.fonts.headline.H2_B.fontFamily};
  font-size: ${({ theme }) => theme.fonts.headline.H2_B.fontSize}px;
  line-height: ${({ theme }) => theme.fonts.headline.H2_B.lineHeight}px;
`;

const SpaceImage = styled.Image`
  width: 162px;
  height: 162px;
  border-radius: 200px;
`;

const JoinButton = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.primary.mint};
  padding: 16px 30px;
  border-radius: 10px;
  align-self: flex-start;
`;

const JoinButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  font-family: ${({ theme }) => theme.fonts.body.B4_M.fontFamily};
  font-size: ${({ theme }) => theme.fonts.body.B4_M.fontSize}px;
  line-height: ${({ theme }) => theme.fonts.body.B4_M.lineHeight}px;
`;

const BottomActions = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 5%;
  padding-bottom: 32px;
  background-color: ${({ theme }) => theme.colors.gray.darkBlack_1};
`;

const ActionButton = styled.TouchableOpacity`
  padding: 8px 4px;
`;

const ActionText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  font-family: ${({ theme }) => theme.fonts.body.B5_M.fontFamily};
  font-size: ${({ theme }) => theme.fonts.body.B5_M.fontSize}px;
  line-height: ${({ theme }) => theme.fonts.body.B5_M.lineHeight}px;
`;
