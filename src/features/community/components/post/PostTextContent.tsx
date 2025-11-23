import { textStyle } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import styled from 'styled-components/native';

type PostTextContentProps = {
  isTruncate: boolean;
  content: string;
  postId?: number;
};

const PostTextContent = ({ isTruncate, content, postId }: PostTextContentProps) => {
  if (isTruncate === true) {
    const [truncate, setTruncate] = useState({ numberOfLines: 0 });

    const onGetLines = useCallback(
      (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        const lines = e.nativeEvent.lines.length;
        setTruncate({ numberOfLines: lines });
      },
      [content],
    );

    return (
      <ContentText>
        <HiddenText onTextLayout={onGetLines}>{content}</HiddenText>
        <Body numberOfLines={2} ellipsizeMode="tail">
          {content}
        </Body>
        {truncate.numberOfLines > 2 ? (
          <MoreContent
            onPress={() => postId && router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } })}
          >
            <MoreContentText>more</MoreContentText>
          </MoreContent>
        ) : null}
      </ContentText>
    );
  }

  return <ContentText>{content}</ContentText>;
};

export default memo(PostTextContent);

const ContentText = styled.View`
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  gap: 4px;
`;
const Body = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  width: 100%;
  text-align: left;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}/* line-height: 18px; */
`;
const MoreContent = styled.Pressable``;
const MoreContentText = styled.Text`
  color: #cccfd0;
  text-decoration-line: underline;
  ${({ theme }) => textStyle(theme.fonts.body.B4_R)}
`;
const HiddenText = styled.Text`
  position: absolute;
  opacity: 0;
  z-index: -100;
  pointer-events: none;
  width: 100%;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}
`;
