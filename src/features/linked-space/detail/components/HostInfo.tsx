import React from 'react';
import {
  HostBadgeBox,
  HostBadgeText,
  HostContainer,
  HostImage,
  HostImageBox,
  HostNameText,
} from '../styles';

type HostInfoProps = {
  imageUrl?: string;
  firstName: string;
};

export const HostInfo = ({ imageUrl, firstName }: HostInfoProps) => {
  return (
    <HostContainer>
      <HostImageBox>
        <HostImage
          source={
            imageUrl
              ? { uri: imageUrl }
              : require('@/assets/images/character3.png')
          }
        />
      </HostImageBox>
      <HostNameText>{firstName}</HostNameText>
      <HostBadgeBox>
        <HostBadgeText>Host</HostBadgeText>
      </HostBadgeBox>
    </HostContainer>
  );
};
