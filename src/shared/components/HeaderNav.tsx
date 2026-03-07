import Icon, { IconType } from '@/components/common/Icon';
import { IconBtn } from '@/src/features/community/shared/styles/styles';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

interface HeaderNavProps {
  title: string;
  onClick?: () => void;
  iconType: IconType;
  rightComponent?: React.ReactNode;
}

const HeaderNav = ({ title, onClick, iconType, rightComponent }: HeaderNavProps) => {
  return (
    <Container>
      <Back onPress={onClick || (() => router.back())}>
        <Icon type={iconType} size={24} color={theme.colors.gray.lightGray_1} />
      </Back>
      <HeaderTitle>{title}</HeaderTitle>
      {rightComponent ? rightComponent : <RightPlaceholder />}
    </Container>
  );
};

export default HeaderNav;

const Container = styled.View`
  width: 100%;
  padding: 11px 20px 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 10;
`;
const HeaderTitle = styled.Text`
  flex: 1;
  text-align: center;
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
`;
const RightPlaceholder = styled.View`
  width: 40px;
`;
const Back = styled(IconBtn)`
  width: 40px;
`;
