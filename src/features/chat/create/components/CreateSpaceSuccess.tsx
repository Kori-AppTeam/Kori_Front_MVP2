import React from 'react';
import styled from 'styled-components/native';

interface CreateSpaceSuccessProps {
  spaceImageUrl?: string;
  onDone: () => void;
}

/**
 * 스페이스 생성 성공 화면
 */
export const CreateSpaceSuccess: React.FC<CreateSpaceSuccessProps> = ({
  spaceImageUrl,
  onDone,
}) => {
  return (
    <Background source={require('@/assets/images/background2.png')} resizeMode="cover">
      <ProfileBox>
        <ProfileImage source={{ uri: spaceImageUrl }} />
      </ProfileBox>

      <TextBox>
        <BigText>New Spaces Created</BigText>
        <SmallText>Bring people together and share your interests</SmallText>
      </TextBox>

      <NextButton onPress={onDone}>
        <ButtonText>Done</ButtonText>
      </NextButton>

      <BottomSpacer />
    </Background>
  );
};

const Background = styled.ImageBackground`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  padding-top: 200px;
`;

const ProfileBox = styled.View`
  width: 160px;
  height: 160px;
  overflow: hidden;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
  border-radius: 100px;
`;

const TextBox = styled.View`
  margin-top: 80px;
  height: 100px;
  align-items: center;
  justify-content: center;
`;

const BigText = styled.Text`
  color: #ffffff;
  font-family: PlusJakartaSans_600SemiBold;
  font-size: 24px;
`;

const SmallText = styled.Text`
  color: #949899;
  font-family: PlusJakartaSans_400Regular;
  font-size: 13px;
`;

const NextButton = styled.TouchableOpacity`
  width: 90%;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: #02f59b;
  margin: 150px;
`;

const ButtonText = styled.Text`
  color: #1d1e1f;
  font-size: 15px;
  font-family: PlusJakartaSans_500Medium;
`;

const BottomSpacer = styled.View`
  height: 25px;
`;
