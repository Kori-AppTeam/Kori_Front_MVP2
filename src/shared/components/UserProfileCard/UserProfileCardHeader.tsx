// components/UserProfileCard/UserProfileCardHeader.tsx

import Icon from '@/components/common/Icon';
import ProfileImage from '@/components/common/ProfileImage';
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { BIO_MARGIN_BOTTOM, BIO_MARGIN_TOP, GENDER_ICON_MAP, META_MARGIN_TOP, NAME_MARGIN_TOP } from './constants';

interface Props {
  name: string;
  country: string;
  birth?: number;
  gender: string;
  bio?: string;
  imageKey?: string;
  expanded: boolean;
}

export function UserProfileCardHeader({ name, country, birth, gender, bio, imageKey, expanded }: Props) {
  const effectiveGender = gender === 'Male' || gender === 'Female' ? gender : 'Unspecified';

  return (
    <Container>
      <AvatarImg imageUrl={imageKey} isVisitor={!imageKey} />

      <Name>{name}</Name>

      <MetaLine>
        <MetaRow>
          <MetaDim>Birth </MetaDim>
          <MetaStrong>{birth ? String(birth) : '-'}</MetaStrong>

          <GenderIconSpacer>
            <Icon type={GENDER_ICON_MAP[effectiveGender]} size={16} color={theme.colors.gray.gray_1} />
          </GenderIconSpacer>
        </MetaRow>

        <MetaDim>From </MetaDim>
        <MetaStrong>{country}</MetaStrong>
      </MetaLine>

      <Bio numberOfLines={expanded ? 4 : 2}>{bio || 'No introduction'}</Bio>
    </Container>
  );
}

const Container = styled.View`
  align-items: center;
`;

const AvatarImg = styled(ProfileImage)`
  width: 88px;
  height: 88px;
  border-radius: 44px;
  background: #f3f4f5;
`;

const Name = styled.Text`
  margin-top: ${NAME_MARGIN_TOP}px;
  font-size: 18px;
  line-height: 24px;
  font-family: 'PlusJakartaSans_600SemiBold';
  color: #111;
  letter-spacing: 0.1px;
`;

const MetaLine = styled.View`
  margin-top: ${META_MARGIN_TOP}px;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
`;

const MetaRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GenderIconSpacer = styled.View`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.gray.lightGray_2};
  align-items: center;
  justify-content: center;
  margin: 0 6px;
`;

const MetaDim = styled.Text`
  font-family: 'PlusJakartaSans_400Regular';
  color: #9a9a9a;
  font-size: 13px;
  line-height: 18px;
`;

const MetaStrong = styled.Text`
  font-family: 'PlusJakartaSans_500SemiBold';
  color: #111;
  font-size: 13px;
  line-height: 18px;
`;

const Bio = styled.Text`
  margin-top: ${BIO_MARGIN_TOP}px;
  margin-bottom: ${BIO_MARGIN_BOTTOM}px;
  font-size: 14px;
  line-height: 22px;
  color: #000000;
  text-align: center;
  font-family: 'PlusJakartaSans_300Light';
`;
