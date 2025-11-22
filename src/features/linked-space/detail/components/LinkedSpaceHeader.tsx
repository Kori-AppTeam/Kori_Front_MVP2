import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  HeaderBackButton,
  HeaderBackground,
  HeaderBackgroundContainer,
  HeaderProfileBox,
  HeaderProfileImage,
} from '../styles';

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
          <HeaderProfileImage
            source={
              imageUrl
                ? { uri: imageUrl }
                : require('@/assets/images/character1.png')
            }
          />
        </HeaderProfileBox>
      </HeaderBackground>
    </HeaderBackgroundContainer>
  );
};
