import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';

type ReportButtonProps = {
  title: string;
  description?: string;
  onPress?: () => void;
};

const ReportButton = ({ title, description, onPress }: ReportButtonProps) => {
  return (
    <Container onPress={onPress}>
      <TextContainer>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
      </TextContainer>

      <IconBtn>
        <Icon type="next" size={24} color={theme.colors.primary.white} />
      </IconBtn>
    </Container>
  );
};

export default ReportButton;

const Container = styled.Pressable`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  padding: 8px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
`;
const TextContainer = styled.View`
  padding: 16px 0;
  gap: 3px;
`;
const IconBtn = styled.View`
  padding: 5px;
`;
const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => theme.fonts.body.B3_M};
`;
const Description = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => theme.fonts.body.B4_L};
`;
