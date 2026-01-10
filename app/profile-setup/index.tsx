import React from 'react';
import styled from 'styled-components/native';
import { ScrollView } from 'react-native-gesture-handler';

import DetailHeader from '@/components/common/DetailHeader';
import BasicInfoStep from '@/src/features/profile-setup/components/BasicInfoStep';
import StepIndicator from '@/src/features/profile-setup/components/StepIndicator';
import CustomButton from '@/src/shared/components/CustomButton';
import { textStyle } from '@/src/styles/theme';

const index = () => {
  return (
    <SafeArea>
      <DetailHeader title="" onButtonPress={() => null} />
      <Contents>
        <StepIndicator step={1} />
        <Title>{`Please set the basic\ninformation`}</Title>
        <SubTitle>{`This is how it’ll appear on your profile card.`}</SubTitle>

        <StepContainer keyboardShouldPersistTaps="handled">
          <BasicInfoStep />
        </StepContainer>

        <CustomButton label="next" />
      </Contents>
    </SafeArea>
  );
};

export default index;

const SafeArea = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
`;

const Contents = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  margin: 12px 0 20px 0;
`;

const Title = styled.Text`
  margin-top: 30px;
  ${({ theme }) => textStyle(theme.fonts.Serif.H1_R)};
  color: ${({ theme }) => theme.colors.primary.white};
`;

const SubTitle = styled.Text`
  margin-top: 8px;
  margin-bottom: 24px;
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)};
  color: ${({ theme }) => theme.colors.gray.gray_2};
`;

const StepContainer = styled(ScrollView)`
  flex: 1;
`;
