import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { DEFAULT_AVATARS, SPACE_DESCRIPTION_MAX_LENGTH, SPACE_NAME_MAX_LENGTH } from '../constants';

interface SpaceFormInputsProps {
  spaceName: string;
  description: string;
  avatarUrl?: string;
  onSpaceNameChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onAvatarPress: () => void;
}

/**
 * 스페이스 생성 폼 입력 컴포넌트
 */
export const SpaceFormInputs: React.FC<SpaceFormInputsProps> = ({
  spaceName,
  description,
  avatarUrl,
  onSpaceNameChange,
  onDescriptionChange,
  onAvatarPress,
}) => {
  return (
    <>
      <ProfileContainer>
        <ProfileBox onPress={onAvatarPress}>
          <ProfileImage source={avatarUrl ? { uri: avatarUrl } : DEFAULT_AVATARS[0].source} />
          <CameraContainer>
            <Icon type="cameraColored" size={20} color={theme.colors.primary.black} />
          </CameraContainer>
        </ProfileBox>
      </ProfileContainer>

      <SpaceNameContainer>
        <SpaceNameText>Space Name</SpaceNameText>
        <SpaceNameLengthText>
          {spaceName.length}/{SPACE_NAME_MAX_LENGTH}
        </SpaceNameLengthText>
      </SpaceNameContainer>

      <EnterSpaceNameContainer
        value={spaceName}
        onChangeText={onSpaceNameChange}
        maxLength={SPACE_NAME_MAX_LENGTH}
        placeholder="Enter Space name"
        placeholderTextColor="#848687"
      />

      <SpaceDecContainer>
        <SpaceDecText>Space Description</SpaceDecText>
      </SpaceDecContainer>

      <EnterDecContainer>
        <EnterDecInput
          value={description}
          onChangeText={onDescriptionChange}
          placeholder="Describe space here"
          placeholderTextColor={theme.colors.gray.gray_1}
          returnKeyType="done"
          multiline
          submitBehavior="blurAndSubmit"
          textAlignVertical="top"
          maxLength={SPACE_DESCRIPTION_MAX_LENGTH}
        />
        <LimitWrapper>
          <LimitCount>
            {description.length}/{SPACE_DESCRIPTION_MAX_LENGTH} limit
          </LimitCount>
        </LimitWrapper>
      </EnterDecContainer>
    </>
  );
};

const ProfileContainer = styled.View`
  height: 30%;
  align-items: center;
  justify-content: center;
`;

const ProfileBox = styled.Pressable`
  width: 150px;
  height: 150px;
`;

const CameraContainer = styled.View`
  position: absolute;
  bottom: 20px;
  right: 5px;
  width: 32px;
  height: 32px;
  border-radius: 30px;
  background-color: ${theme.colors.primary.mint};
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ProfileImage = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 75px;
  resize-mode: contain;
`;

const SpaceNameContainer = styled.View`
  height: 40px;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

const SpaceNameText = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)}
`;

const SpaceNameLengthText = styled.Text`
  color: ${theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_R)}
`;

const EnterSpaceNameContainer = styled.TextInput`
  background-color: ${theme.colors.gray.darkGray_1};
  height: 50px;
  padding-left: 10px;
  border-radius: 4px;
`;

const SpaceDecContainer = styled.View`
  height: 40px;
  justify-content: center;
`;

const SpaceDecText = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)}
  margin-top: 10px;
`;

const EnterDecContainer = styled.View`
  background-color: ${theme.colors.gray.darkGray_1};
  height: 200px;
  border-radius: 4px;
  padding-left: 10px;
  position: relative;
  margin-top: 3px;
`;

const EnterDecInput = styled.TextInput`
  flex: 1;
  ${({ theme }) => textStyle(theme.fonts.body.B2_R)}
  line-height: 24px;
  text-align-vertical: top;
`;

const LimitWrapper = styled.View`
  position: absolute;
  bottom: 15px;
  right: 15px;
`;

const LimitCount = styled.Text`
  color: ${theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)}
`;
