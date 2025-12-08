import { textStyle } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

/**
 * 텍스트 버튼 공용 컴포넌트
 * - 밑줄이 있는 텍스트 형태의 버튼 컴포넌트입니다.
 * - 주로 링크로 연결되는 버튼에 사용합니다.
 *
 * @param label 버튼에 표시할 텍스트
 * @param onPress 버튼 클릭 시 호출되는 핸들러 함수
 */

interface TextButtonProps {
  label: string;
  onPress?: () => void;
}

const TextButton = ({ label, onPress }: TextButtonProps) => {
  return (
    <Btn onPress={onPress}>
      <BtnText>{label}</BtnText>
    </Btn>
  );
};

export default TextButton;

const Btn = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  height: 20px;
`;

const BtnText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
  text-decoration-line: underline;
`;
