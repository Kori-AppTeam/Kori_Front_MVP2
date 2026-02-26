import Avatar from '@/components/Avatar';
import Icon from '@/components/common/Icon';
import OnlineState from '@/src/shared/components/OnlineState';
import { useGetOnlineState } from '@/src/shared/hooks/useGetOnlineState';
import { User } from '@/src/shared/types/user';
import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface UserInfoHeaderProps {
  userId: number;
  data: User;
}

const UserInfoHeader = ({ userId, data }: UserInfoHeaderProps) => {
  const { data: onlineState } = useGetOnlineState(userId);

  return (
    <Container>
      <AvatarWrapper>
        <Avatar size={120} uri={data?.imageKey} />
      </AvatarWrapper>

      <OnlineStateWrapper>
        <OnlineState isOnline={onlineState?.online ?? false} size={16} />
        <OnlineStateText>{onlineState?.online ? 'Online' : 'Offline'}</OnlineStateText>
      </OnlineStateWrapper>

      <InfoWrapper>
        <Name>
          {data?.firstname}, {data?.lastname}
        </Name>
        <DescriptionWrapper>
          <Description>
            <InfoLabel>Birth</InfoLabel>
            <InfoData>{data?.birthday}</InfoData>
            <Icon type={data?.gender === 'M' ? 'maleColored' : 'femaleColored'} size={16} />
          </Description>
          <Description>
            <InfoLabel>From</InfoLabel>
            <InfoData>{data?.country}</InfoData>
          </Description>
        </DescriptionWrapper>
      </InfoWrapper>
    </Container>
  );
};

export default UserInfoHeader;

const Container = styled.View`
  width: 100%;
  position: relative;
  padding: 0 20px;
`;
// Avatar 컴포넌트의 기본 margin이 15px이므로, 이를 고려하여 margin을 보정
const AvatarWrapper = styled.View`
  margin-top: -75px;
  margin-left: -15px;
`;
const InfoWrapper = styled.View`
  margin-top: 5px;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 8px;
`;
const Name = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.headline.H4_SB)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
const DescriptionWrapper = styled.View`
  flex-direction: row;
  gap: 12px;
`;
const Description = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;
const InfoLabel = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_R)};
  color: ${({ theme }) => theme.colors.gray.gray_2};
`;
const InfoData = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
const OnlineStateWrapper = styled.View`
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-radius: 100px;
  gap: 4px;
  flex-direction: row;
  align-items: center;
  position: absolute;
  top: 20px;
  right: 20px;
`;
const OnlineStateText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  color: ${({ theme }) => theme.colors.gray.lightGray_2};
`;
