import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import Icon from '@/components/common/Icon';
import ProfileImage from '@/components/common/ProfileImage';
import { ActivityIndicator } from 'react-native';
import {
  UploadProfileImageResult,
  useUploadProfileImage,
} from '@/src/features/profile-setup/hooks/useUploadProfileImage';

type UploadedImage = UploadProfileImageResult;

type Props = {
  imageUri?: string;
  onUploaded: (result: UploadedImage) => void;
  disabled?: boolean;
};

const UploadProfileImageButton = ({ imageUri, onUploaded, disabled }: Props) => {
  const theme = useTheme();

  const { uploading, onPress } = useUploadProfileImage({ disabled, onUploaded });

  return (
    <AvatarContainer onPress={onPress} disabled={disabled || uploading}>
      {imageUri ? (
        <>
          <PhotoContainer selected={!!imageUri}>
            <PhotoAvatar source={{ uri: imageUri }} />
          </PhotoContainer>
        </>
      ) : (
        <CameraAvatar>
          {uploading ? (
            <ActivityIndicator size="large" color={theme.colors.gray.lightGray_1} />
          ) : (
            <Icon type="cameraColored" size={40} color={theme.colors.gray.lightGray_1} />
          )}
        </CameraAvatar>
      )}
    </AvatarContainer>
  );
};

export default UploadProfileImageButton;

const AvatarContainer = styled.TouchableOpacity`
  width: 48%;
  aspect-ratio: 1;
  margin-bottom: 20px;
  position: relative;
  justify-content: center;
  align-items: center;
`;

const CameraAvatar = styled.View`
  width: 95%;
  height: 95%;
  border-radius: 1000px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border: 4px solid transparent;
`;

const PhotoContainer = styled.View<{ selected?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 1000px;
  border: ${(props) => (props.selected ? `4px solid ${props.theme.colors.primary.mint}` : '4px solid transparent')};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const PhotoAvatar = styled(ProfileImage)`
  width: 100%;
  height: 100%;
`;
