import React from 'react';
import { SvgProps } from 'react-native-svg';
import styled from 'styled-components/native';

export default function UserProfileImg({ source }: { source: string | React.FC<SvgProps> }) {
  if (typeof source === 'string') {
    return <ImageString source={{ uri: source }}></ImageString>;
  }

  const SVGImage = source;

  return <SVGImage width="100%" height="100%" />;
}

// 나중에 react-native 스타일에 맞게 수정 필요
const ImageString = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;
