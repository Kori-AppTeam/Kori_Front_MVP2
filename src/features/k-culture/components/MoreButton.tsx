import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

type MoreButtonProps = {
  buttonText?: string;
  onPress?: () => void;
};

const MoreButton = ({ buttonText, onPress }: MoreButtonProps) => {
  return (
    <Button onPress={onPress} width={SCREEN_WIDTH - 100 * 2}>
      <ButtonText>{buttonText || 'More'}</ButtonText>
      <Icon type="next" color={theme.colors.primary.white} size={16} />
    </Button>
  );
};

export default MoreButton;

const Button = styled.Pressable<{ width?: number }>`
  width: ${({ width }) => (width ? `${width}px` : '175px')};
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  border-width: 1px;
  border-color: ${theme.colors.gray.darkGray_2};
  padding: 17px 42px;
`;
const ButtonText = styled.Text`
  color: ${theme.colors.primary.white};
`;
