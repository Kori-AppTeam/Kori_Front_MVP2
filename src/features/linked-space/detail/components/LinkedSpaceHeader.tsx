import Icon from '@/components/common/Icon';
import ProfileImage from '@/components/common/ProfileImage';
import { theme } from '@/src/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { HeaderBackButton, HeaderBackground, HeaderBackgroundContainer, HeaderProfileBox } from '../styles';

type LinkedSpaceHeaderProps = {
  imageUrl?: string;
};

export const LinkedSpaceHeader = ({ imageUrl }: LinkedSpaceHeaderProps) => {
  const router = useRouter();

  return (
    <HeaderBackgroundContainer>
      <HeaderBackground source={require('@/assets/images/background1.png')} resizeMode="cover">
        <HeaderBackButton onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </HeaderBackButton>
        <HeaderProfileBox>
          <ProfileImage
            source={imageUrl ? { uri: imageUrl } : require('@/assets/images/character1.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        </HeaderProfileBox>
      </HeaderBackground>
    </HeaderBackgroundContainer>
  );
};
