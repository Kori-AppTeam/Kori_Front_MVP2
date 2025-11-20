import ProfileImage from '@/components/common/ProfileImage';
import React, { memo } from 'react';
import { SvgProps, SvgUri } from 'react-native-svg';
import styled from 'styled-components/native';

function UserProfileImg({ source }: { source: string | React.FC<SvgProps> }) {
  if (typeof source !== 'string') {
    const SVGImage = source;
    return <SVGImage width="100%" height="100%" />;
  }

  const extension = source.split('.').pop()?.toLowerCase();

  if (extension !== 'svg') {
    return <ImageString source={{ uri: source }} resizeMode="cover" />;
  }

  return <SvgUri uri={source} width="100%" height="100%" />;
}

const ImageString = styled(ProfileImage)`
  width: 100%;
  height: 100%;
  border-radius: 50px;
`;

export default memo(UserProfileImg);
