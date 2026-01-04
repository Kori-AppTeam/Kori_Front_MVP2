import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';
import styled from 'styled-components/native';
import Icon, { IconType } from './Icon';
import { textStyle, theme } from '@/src/styles/theme';

interface DetailHeaderProps {
  title: string;
  buttonType?: 'text' | 'icon';
  buttonText?: string;
  buttonIconType?: IconType;
  onButtonPress?: () => void;
  isBackButtonVisible?: boolean;
}

export default function DetailHeader({
  title,
  buttonType,
  buttonText,
  buttonIconType,
  onButtonPress,
  isBackButtonVisible = true,
}: DetailHeaderProps) {
  const TextButton = <TextBtn onPress={onButtonPress}>{buttonText}</TextBtn>;
  const IconButton = buttonIconType && (
    <Pressable onPress={onButtonPress}>
      <Icon type={buttonIconType} size={20} />
    </Pressable>
  );

  return (
    <Header>
      {isBackButtonVisible && (
        <BackBtn onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </BackBtn>
      )}

      <TitleWrap pointerEvents="none">
        <Title>
          <Text>{title}</Text>
        </Title>
      </TitleWrap>
      <RightBtn>
        {buttonType === 'icon' && IconButton}
        {buttonType === 'text' && TextButton}
      </RightBtn>
    </Header>
  );
}

const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary.black};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
`;

const Title = styled.Text`
  font-family: 'PlusJakartaSans_500Medium';
  font-size: 16px;
  color: ${({ theme }) => theme.colors.primary.white};
`;

const BackBtn = styled.Pressable`
  width: 40px;
  align-items: flex-start;
`;

const TitleWrap = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  align-items: center;
`;

const RightBtn = styled.View`
  position: absolute;
  top: 8px;
  right: 20px;
  width: 40px;
  align-items: flex-end;
`;

const TextBtn = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
  color: ${({ theme }) => theme.colors.primary.white};
`;
