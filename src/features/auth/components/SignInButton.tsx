import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, PressableProps } from 'react-native';
import styled from 'styled-components/native';
import AppleIcon from '@/assets/icons/apple-logo.svg';
import GoogleIcon from '@/assets/icons/google-logo.svg';

type IconType = 'mail' | 'apple' | 'google';

type Props = PressableProps & {
  loading?: boolean;
  label: string;
  iconType: IconType;
};

const SignInIcon = (iconType: IconType) => {
  switch (iconType) {
    case 'mail':
      return <Icon type="mail" size={24} />;

    case 'apple':
      return <AppleIcon />;

    case 'google':
      return <GoogleIcon />;
    default:
      break;
  }
};

const SignInButton = ({ onPress, disabled, loading, label, iconType, ...props }: Props) => {
  return (
    <Button onPress={onPress} disabled={disabled || loading} {...props}>
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.primary.mint} />
          ) : (
            <>
              {SignInIcon(iconType)}
              <ButtonText pressed={pressed}>{label}</ButtonText>
            </>
          )}
        </>
      )}
    </Button>
  );
};

export default SignInButton;

const Button = styled(Pressable)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  border-color: ${({ theme }) => theme.colors.gray.darkGray_2};
  border-width: 1px;
  margin-bottom: 12px;
  gap: 10px;
`;

const ButtonText = styled.Text<{ pressed: boolean }>`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)};
  opacity: ${(props) => (props.pressed ? 0.7 : 1)};
`;
