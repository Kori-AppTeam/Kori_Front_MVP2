import styled from 'styled-components/native';
import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';

/**
 * 스낵바 공용 컴포넌트(Toast)
 * - 전역 Toast 컴포넌트에서 사용되는 스낵바 컴포넌트입니다.
 * - 사용 시에는 Toast를 통해 메시지와 타입을 전달하여 호출합니다.
 *
 * @param type 'success' | 'error' 스낵바 유형
 * @param message 주요 메시지
 * @param message2 (선택 사항) 부가 메시지
 */

interface SnackBarProps {
  type: 'success' | 'error';
  message: string;
  message2?: string;
}

const SnackBar = ({ type, message, message2 }: SnackBarProps) => {
  const isSuccess = type === 'success';
  return (
    <SnackBarContainer>
      <Icon
        type={isSuccess ? 'check' : 'info'}
        size={24}
        color={isSuccess ? theme.colors.primary.mint : theme.colors.secondary.red}
      />
      <TextWrapper>
        <SnackBarText>{message}</SnackBarText>
        {message2 && <SnackBarText>{message2}</SnackBarText>}
      </TextWrapper>
    </SnackBarContainer>
  );
};

export default SnackBar;

const SnackBarContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 60px;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.gray.darkGray_2};
  padding: 16px;
  gap: 8px;
  border-radius: 4px;
`;

const SnackBarText = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B5_R)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

const TextWrapper = styled.View`
  flex-direction: column;
  justify-content: center;
`;
