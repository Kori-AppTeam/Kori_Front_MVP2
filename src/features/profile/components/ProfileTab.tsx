import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

interface ProfileTabProps {
  about: string;
  lang: string;
  interest: string[];
}

const ProfileTab = ({ about, lang, interest }: ProfileTabProps) => {
  return (
    <Container>
      <ContentWrap>
        <Label>
          <Icon type="mic" size={16} color={theme.colors.gray.gray_2} />
          <LabelText>About Me</LabelText>
        </Label>
        <Content>{about}</Content>
      </ContentWrap>

      <ContentWrap>
        <Label>
          <Icon type="global" size={16} color={theme.colors.gray.gray_2} />
          <LabelText>Language</LabelText>
        </Label>
        <Content>{lang}</Content>
      </ContentWrap>

      <ContentWrap>
        <Label>
          <Icon type="heartNonSelected" size={16} color={theme.colors.gray.gray_2} />
          <LabelText>Interest</LabelText>
        </Label>
      </ContentWrap>
      <Content>{interest}</Content>
    </Container>
  );
};

export default ProfileTab;

const Container = styled.View`
  flex: 1;
  padding: 20px;
  gap: 30px;
`;

const ContentWrap = styled.View`
  align-items: flex-start;
  gap: 12px;
`;

const Label = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const LabelText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_2};
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
const Content = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;
