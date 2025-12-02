import AnonymityImage from '@/assets/images/character_04.svg';
import ProfileImage from '@/components/common/ProfileImage';
import React, { memo } from 'react';
import { SvgUri } from 'react-native-svg';
import styled from 'styled-components/native';

type PostUserImgProps = {
  isAnonymous: boolean;
  userImageUrl: string | null;
};

const PostUserProfileImg = ({ isAnonymous, userImageUrl }: PostUserImgProps) => {
  if (userImageUrl === null || isAnonymous === true) {
    return <AnonymityImage width="100%" height="100%" />;
  }

  const extension = userImageUrl.split('.').pop()?.toLowerCase();

  if (extension !== 'svg') {
    return <ImageString source={{ uri: userImageUrl }} resizeMode="cover" />;
  }

  return <SvgUri uri={userImageUrl} width="100%" height="100%" />;
};

export default memo(PostUserProfileImg);

const ImageString = styled(ProfileImage)`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;
