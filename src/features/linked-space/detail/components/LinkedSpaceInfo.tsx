import React from 'react';
import {
  InfoContainer,
  InfoMembersText,
  InfoMembersTextContainer,
  InfoTitleContainer,
  InfoTitleText,
} from '../styles';
import { HostInfo } from './HostInfo';
import { ParticipantsInfo } from './ParticipantsInfo';

type LinkedSpaceInfoProps = {
  title: string;
  ownerImageUrl?: string;
  ownerFirstName: string;
  participantCount: number;
  participantsImageUrls: string[];
};

export const LinkedSpaceInfo = ({
  title,
  ownerImageUrl,
  ownerFirstName,
  participantCount,
  participantsImageUrls,
}: LinkedSpaceInfoProps) => {
  return (
    <InfoContainer>
      <InfoTitleContainer>
        <InfoTitleText>{title}</InfoTitleText>
      </InfoTitleContainer>
      <InfoMembersTextContainer>
        <InfoMembersText>Members</InfoMembersText>
      </InfoMembersTextContainer>
      <HostInfo imageUrl={ownerImageUrl} firstName={ownerFirstName} />
      <ParticipantsInfo
        participantCount={participantCount}
        participantsImageUrls={participantsImageUrls}
      />
    </InfoContainer>
  );
};
