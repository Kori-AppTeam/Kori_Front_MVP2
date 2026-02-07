import { COMMUNITY_ROUTER } from '@/src/shared/constants/route';
import { confirmOpenURL } from '@/src/shared/utils/confirmOpenURL';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import Hyperlink from 'react-native-hyperlink';
import styled from 'styled-components/native';
import useVisitor from '../../../hooks/useVisitor';

type PostTextContentProps = {
  isTruncate: boolean;
  content: string;
  postId?: number;
};

const PostTextContent = ({ isTruncate, content, postId }: PostTextContentProps) => {
  const { handleBlockVisitor } = useVisitor();

  // 내용이 비어있는 경우 렌더링하지 않음(퀴즈/투표에서 텍스트 없는 경우 대비)
  if (content.trim() === '') {
    return null;
  }

  const handleMorePress = useCallback(() => {
    if (!postId) return;
    handleBlockVisitor(() => router.push(COMMUNITY_ROUTER.DETAIL(postId)));
  }, [postId, handleBlockVisitor]);

  if (isTruncate === true) {
    const [truncate, setTruncate] = useState({ numberOfLines: 0 });

    // 텍스트의 총 라인 수를 계산하는 콜백함수
    const onGetLines = useCallback(
      (e: NativeSyntheticEvent<TextLayoutEventData>) => {
        const lines = e.nativeEvent.lines.length;
        setTruncate({ numberOfLines: lines });
      },
      [content],
    );

    return (
      <ContentText>
        <HiddenText onTextLayout={onGetLines} pointerEvents="none">
          {content}
        </HiddenText>
        <Hyperlink
          linkDefault={true}
          linkStyle={{ color: theme.colors.primary.mint, textDecorationLine: 'underline' }}
          onPress={(url) => confirmOpenURL(url)}
          style={{ width: '100%' }}
        >
          <Body numberOfLines={2} ellipsizeMode="tail">
            {content}
          </Body>
        </Hyperlink>
        {truncate.numberOfLines > 2 ? (
          <MoreContent onPress={handleMorePress}>
            <MoreContentText>more</MoreContentText>
          </MoreContent>
        ) : null}
      </ContentText>
    );
  }

  return (
    <ContentText>
      <Hyperlink
        linkDefault={true}
        linkStyle={{ color: theme.colors.primary.mint, textDecorationLine: 'underline' }}
        style={{ width: '100%' }}
        onPress={(url) => confirmOpenURL(url)}
      >
        <Body>{content}</Body>
      </Hyperlink>
    </ContentText>
  );
};

export default memo(PostTextContent);

const ContentText = styled.View`
  flex-direction: column;
  width: 100%;
  padding: 0 20px;
  align-items: flex-start;
  gap: 4px;
`;
const Body = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  width: 100%;
  text-align: left;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}
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
  width: 100%;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}
`;
