import Icon from '@/components/common/Icon';
import { MYPAGE_SUPPORT_ROUTE } from '@/src/shared/constants/route';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

const SupportButton = () => {
  return (
    <Container>
      <Title>
        <Icon type="info" size={16} color={theme.colors.gray.gray_1} />
        <TitleText>Support</TitleText>
      </Title>

      <RedirectButton onPress={() => router.push(MYPAGE_SUPPORT_ROUTE)}>
        <RedirectText>Feedback & Support</RedirectText>
        <Icon type="next" size={20} color={theme.colors.primary.white} />
      </RedirectButton>
    </Container>
  );
};

export default SupportButton;

const Container = styled.View`
  gap: 20px;
  border-bottom-width: 1px;
  padding-bottom: 20px;

  /* 리팩토링 전 마진값, divider색상 */
  margin: 28px 16px;
  border-bottom-color: #2a2b2c;

  /* 리팩토링 후에는 이렇게 or index.tsx에 따라 수정해주세요 */
  /* margin: 40px 20px; 
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1}; */
`;
const Title = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
`;
const TitleText = styled.Text`
  /* 아래는 리팩토링 전 마이페이지 스타일과 맞추기 위한 것이므로 리팩토링 시 삭제해주세요 */
  color: #9aa0a6;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.2px;
  font-family: 'PlusJakartaSans_600SemiBold';

  /* 이 스타일 사용하시면 됩니다! */
  /* color: ${({ theme }) => theme.colors.gray.gray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B5_SB)} */
`;
const RedirectButton = styled.Pressable`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const RedirectText = styled.Text`
  /* 아래는 리팩토링 전 마이페이지 스타일과 맞추기 위한 것이므로 리팩토링 시 삭제해주세요 */
  color: #e9ecef;
  font-size: 15px;
  font-family: 'PlusJakartaSans_400Regular';

  /* 이 스타일 사용하시면 됩니다! */
  /* color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)} */
`;
