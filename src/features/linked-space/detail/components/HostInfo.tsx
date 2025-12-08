import ProfileImage from '@/components/common/ProfileImage';
import React from 'react';
import { HostBadgeBox, HostBadgeText, HostContainer, HostImageBox, HostNameText } from '../styles';

type HostInfoProps = {
  imageUrl?: string;
  firstName: string;
};

export const HostInfo = ({ imageUrl, firstName }: HostInfoProps) => {
  return (
    <HostContainer>
      <HostImageBox>
        <ProfileImage
          source={imageUrl ? { uri: imageUrl } : require('@/assets/images/character3.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </HostImageBox>
      <HostNameText>{firstName}</HostNameText>
      <HostBadgeBox>
        <HostBadgeText>Host</HostBadgeText>
      </HostBadgeBox>
    </HostContainer>
  );
};
