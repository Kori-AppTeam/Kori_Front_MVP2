import styled from 'styled-components/native';
import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';

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
