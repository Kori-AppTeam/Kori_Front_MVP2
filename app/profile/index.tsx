import Avatar from '@/components/Avatar';
import Icon from '@/components/common/Icon';
import { IconBtn } from '@/src/features/community/shared/styles/styles';
import { getSecureStoreItem } from '@/src/shared/utils/secureStore';
import { Safe } from '@/src/styles/GlobalStyles';
import { textStyle, theme } from '@/src/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

const Index = () => {
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();

  const getLoginInfo = async () => {
    const [storedUserId, isToken] = await Promise.all([
      getSecureStoreItem('MyuserId'),
      getSecureStoreItem('accessToken'),
    ]);
  };

  return (
    <Safe>
      <Header>
        <HeaderNav>
          <Back onPress={() => router.back()}>
            <Icon type="close" size={24} color={theme.colors.gray.lightGray_1} />
          </Back>
          <HeaderTitle>Profile</HeaderTitle>
          <RightPlaceholder />
        </HeaderNav>
      </Header>
      <Avatar size={120} uri=""></Avatar>
    </Safe>
  );
};

export default Index;

const Header = styled.View`
  align-items: center;
  height: 167px;
  background-color: ${theme.colors.primary.mint};
`;
const HeaderNav = styled.View`
  width: 100%;
  padding: 11px 20px 10px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
