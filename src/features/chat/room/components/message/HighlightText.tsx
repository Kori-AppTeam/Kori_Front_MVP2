// 텍스트 내 키워드 하이라이트 컴포넌트
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { HighlightTextProps } from '../../types';

const HIGHLIGHT_COLORS = {
  MY_MESSAGE: 'rgba(255,255,0,0.8)',
  OTHER_MESSAGE: 'rgba(255,255,0,0.3)',
} as const;

const HighlightText: React.FC<HighlightTextProps> = ({ text, keyword, textType, highlightStyle }) => {
  // 키워드가 없으면 일반 텍스트 반환
  if (!keyword) {
    return textType === 'my' ? <MyText>{text}</MyText> : <OtherText>{text}</OtherText>;
  }

  // 정규식으로 텍스트 분할 (키워드 부분도 배열에 포함)
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));

  const TextComponent = textType === 'my' ? MyText : OtherText;
  const defaultHighlightColor = textType === 'my' ? HIGHLIGHT_COLORS.MY_MESSAGE : HIGHLIGHT_COLORS.OTHER_MESSAGE;

  return (
    <TextComponent>
      {parts.map((part, index) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <TextComponent
            key={index}
            style={{
              backgroundColor: highlightStyle?.backgroundColor || defaultHighlightColor,
            }}
          >
            {part}
          </TextComponent>
        ) : (
          <TextComponent key={index}>{part}</TextComponent>
        ),
      )}
    </TextComponent>
  );
};

export default HighlightText;

// ============= Styled Components =============
const MyText = styled.Text`
  color: ${theme.colors.primary.black};
  ${({ theme }) => theme.fonts.body.B4_R}
`;

const OtherText = styled.Text`
  color: ${theme.colors.primary.white};
  ${({ theme }) => theme.fonts.body.B4_L}
`;
