import UploadProfileImageButton from '@/src/features/profile-setup/components/ProfilePhotoStep/UploadProfileImageButton';
import { profileSetupImageAssets } from '@/src/features/profile-setup/constants/assets';
import { StepContainer } from '@/src/features/profile-setup/styles/styles';
import { usePreloadAssets } from '@/src/shared/hooks/usePreloadAssets';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const ProfilePhotoStep = () => {
  const { width: deviceWidth } = Dimensions.get('window');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  usePreloadAssets(profileSetupImageAssets);

  return (
    <StepContainer>
      <ImageBackground source={profileSetupImageAssets[0]} deviceWidth={deviceWidth}>
        <UploadProfileImageButton imageUri={imageUri} onUploaded={(result) => setImageUri(result.uri)} />
      </ImageBackground>
    </StepContainer>
  );
};

export default ProfilePhotoStep;

const ImageBackground = styled.ImageBackground.attrs<{ deviceWidth: number }>({
  resizeMode: 'cover',
})`
  margin-left: -20px;
  flex: 1;
  width: ${({ deviceWidth }) => deviceWidth}px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
