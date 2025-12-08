import Icon from '@/components/common/Icon';
import { textStyle, theme } from '@/src/styles/theme';
import React from 'react';
import styled from 'styled-components/native';
import { guidelines } from '../../shared/constants/constants';

const WritePolicy = () => {
  return (
    <Container>
      <Title>The following content is not allowed</Title>

      <Policy>
        {guidelines.map((item) => (
          <ListItem key={item}>
            <Bullet>•</Bullet>
            <PolicyText>{item}</PolicyText>
          </ListItem>
        ))}
      </Policy>

      <WarnWrap>
        <IconBtn>
          <Icon type="notice" size={16} color={theme.colors.secondary.red} />
        </IconBtn>
        <WarningText>If you write inappropriate posts, you may be reported or blocked.</WarningText>
      </WarnWrap>
    </Container>
  );
};

export default WritePolicy;

const BaseText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.gray_1};
`;
const Container = styled.View`
  margin-top: auto;
  margin-left: 20px;
  margin-right: 20px;
  gap: 12px;
`;
const Title = styled(BaseText)`
  ${({ theme }) => textStyle(theme.fonts.body.B5_M)};
`;
const Policy = styled.View``;
const ListItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
`;
const Bullet = styled(BaseText)`
  width: 14px;
  ${({ theme }) => textStyle(theme.fonts.body.B5_L)};
  line-height: 18.5px;
`;
const PolicyText = styled(BaseText)`
  ${({ theme }) => textStyle(theme.fonts.body.B5_L)}
  line-height: 18.5px;
  flex: 1;
`;
const WarnWrap = styled.View`
  flex-direction: row;
  align-items: flex-start;
  gap: 11px;
  border-radius: 4px;
  background-color: ${({ theme }) => `${theme.colors.secondary.red}1A`};
  padding: 10px 12px;
`;
const IconBtn = styled.View`
  padding: 2px;
  align-items: center;
  justify-content: center;
`;
const WarningText = styled.Text`
  flex: 1;
  ${({ theme }) => textStyle(theme.fonts.body.B5_L)};
  color: ${({ theme }) => theme.colors.secondary.red};
`;
