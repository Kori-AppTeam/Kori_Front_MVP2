import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import { FlatList } from 'react-native';
import {
  ParticipantsContainer,
  ParticipantsCountContainer,
  ParticipantsCountText,
  ParticipantsDivider,
  ParticipantsImage,
  ParticipantsImageBox,
  ParticipantsImageContainer,
  ParticipantsImagesBox,
  ParticipantsTotalText,
} from '../styles';

type ParticipantsInfoProps = {
  participantCount: number;
  participantsImageUrls: string[];
};

export const ParticipantsInfo = ({ participantCount, participantsImageUrls }: ParticipantsInfoProps) => {
  return (
    <ParticipantsContainer>
      <ParticipantsCountContainer>
        <Icon type="person" size={16} color={theme.colors.gray.gray_2} />
        <ParticipantsCountText>{participantCount} members in</ParticipantsCountText>
        <ParticipantsDivider />
      </ParticipantsCountContainer>
      <ParticipantsImageContainer>
        <ParticipantsImagesBox>
          <FlatList
            data={participantsImageUrls.slice(0, 5)}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <ParticipantsImageBox>
                <ParticipantsImage source={{ uri: item }} />
              </ParticipantsImageBox>
            )}
          />
        </ParticipantsImagesBox>
        <ParticipantsTotalText>+{participantCount}</ParticipantsTotalText>
      </ParticipantsImageContainer>
    </ParticipantsContainer>
  );
};
