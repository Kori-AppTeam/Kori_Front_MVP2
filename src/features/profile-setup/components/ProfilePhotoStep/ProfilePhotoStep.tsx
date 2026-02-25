import UploadProfileImageButton from '@/src/features/profile-setup/components/ProfilePhotoStep/UploadProfileImageButton';
import { profileSetupImageAssets } from '@/src/features/profile-setup/constants/assets';
import { usePreloadAssets } from '@/src/shared/hooks/usePreloadAssets';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useFormContext } from 'react-hook-form';
import { ProfileSetupFormValues } from '@/src/features/profile-setup/types';

const ProfilePhotoStep = () => {
  const { width: deviceWidth } = Dimensions.get('window');
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);

  const { watch, setValue, getValues } = useFormContext<ProfileSetupFormValues>();

  usePreloadAssets(profileSetupImageAssets);

  return (
    <StepContent>
      <ImageBackground source={profileSetupImageAssets[0]} deviceWidth={deviceWidth}>
        <UploadProfileImageButton
          imageUri={imageUri}
          onUploaded={(result) => {
            setImageUri(result.uri);
            setValue('imageKey', result.imageKey, { shouldDirty: true, shouldValidate: true });
          }}
        />
      </ImageBackground>
    </StepContent>
  );
};

export default ProfilePhotoStep;

const StepContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-bottom: 24px;
  margin-bottom: 48px;
`;

const ImageBackground = styled.ImageBackground.attrs<{ deviceWidth: number }>({
  resizeMode: 'cover',
})`
  flex: 1;
  width: ${({ deviceWidth }) => deviceWidth}px;
  height: 100%;
  justify-content: center;
  align-items: center;
`;
