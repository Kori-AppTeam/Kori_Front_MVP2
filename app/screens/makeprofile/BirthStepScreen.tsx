import { useProfile } from '@/app/contexts/ProfileContext';
import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import SkipHeader from './components/SkipHeader';
import BirthPicker from '@/src/shared/components/BirthPicker';

export default function BirthdaySelectionScreen() {
  const router = useRouter();
  const [birth, setBirth] = useState(''); // (MM/DD/YYYY 포맷의 최종 날짜)
  const [validbirth, setValidBirth] = useState(false);
  const { profileData, updateProfile } = useProfile();
  const [showPicker, setShowPicker] = useState(false);

  const handleSkip = () => {
    updateProfile('birthday', '');
    router.push('./PurposeStepScreen');
  };

  const moveNextScreen = () => {
    updateProfile('birthday', birth);
    router.push('./PurposeStepScreen');
  };

  return (
    <SafeArea bgColor="#0F0F10">
      <StatusBar barStyle="light-content" />
      <Container>
        <SkipHeader onSkip={handleSkip} />
        <StepText>Step 6 / 9</StepText>

        <TitleWrapper>
          <Title>When is your</Title>
          <Title>Birthday?</Title>
        </TitleWrapper>

        <Subtitle>
          Don't worry. Only your age will be shown{'\n'}
          on your profile.
        </Subtitle>

        {/* [수정] BirthInput -> TouchableOpacity + BirthBox + BirthText */}
        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <BirthBox>
            <BirthText isSet={birth !== ''} isText={birth}>
              {birth || 'MM/DD/YYYY'}
            </BirthText>
            {birth !== '' ? <Icon type="check" size={24} color={theme.colors.primary.mint} /> : null}
          </BirthBox>
        </TouchableOpacity>

        <Spacer />

        <NextButton onPress={moveNextScreen} disabled={birth === ''} isDone={birth !== ''}>
          <ButtonText>Next</ButtonText>
        </NextButton>

        <BottomSpacer />
      </Container>

      <BirthPicker isShow={showPicker} onClose={() => setShowPicker(false)} setDate={(date) => setBirth(date)} />
    </SafeArea>
  );
}

// ------------------------
// Styled Components
// ------------------------
const SafeArea = styled(SafeAreaView)<{ bgColor?: string }>`
  flex: 1;
  background-color: ${(props) => props.bgColor || '#000'};
`;

const Container = styled.View`
  flex: 1;
  padding: 0px 20px;
`;
// ... (StepText, TitleWrapper, Title, Subtitle 동일)
const StepText = styled.Text`
  color: #5bd08d;
  font-size: 13px;
  letter-spacing: 0.2px;
  font-family: 'PlusJakartaSans-Regular';
  margin-top: 87px;
`;

const TitleWrapper = styled.View`
  margin-top: 46px;
`;

const Title = styled.Text`
  color: #ffffff;
  font-size: 40px;
  line-height: 40px;
  letter-spacing: 0.2px;
  font-family: 'InstrumentSerif-Regular';
`;

const Subtitle = styled.Text`
  margin-top: 15px;
  color: #949899;
  font-size: 15px;
  font-family: 'PlusJakartaSans-Light';
  line-height: 22px;
`;
// ---

const BirthBox = styled.View`
  background-color: #353637;
  border-radius: 4px;
  width: 100%;
  height: 50px;
  margin-top: 50px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 0px 12px 0px 16px; /* [수정] 왼쪽 패딩 추가 */
`;

// [수정] BirthInput -> BirthText
const BirthText = styled.Text<{ isSet: boolean; isText: string }>`
  flex: 1;
  font-size: 16px; /* (Input과 맞춤) */
  font-family: 'PlusJakartaSans-Regular'; /* (Input과 맞춤) */
  /* [수정] placeholder 및 유효성 검사 색상 */
  color: ${(props) => (!props.isSet ? '#616262' : '#ffffff')};
`;

// ... (ErrorWrapper, ErrorBox, ErrorText, Spacer, NextButton, ButtonText, BottomSpacer 동일)
const ErrorWrapper = styled.View`
  width: 100%;
  margin-top: 210px;
  align-items: center;
`;

const ErrorBox = styled.View`
  background-color: #171818cc;
  width: 60%;
  height: 36px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 8px;
`;

const ErrorText = styled.Text`
  color: #ffffff;
  margin-left: 12px;
  font-family: 'PlusJakartaSans-Medium';
`;

const Spacer = styled.View`
  flex: 1;
`;

const NextButton = styled.TouchableOpacity<{ isDone: boolean }>`
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: #02f59b;
  margin-bottom: 8px;
  opacity: ${(props) => (props.isDone ? 1 : 0.5)};
`;

const ButtonText = styled.Text`
  color: #1d1e1f;
  font-size: 15px;
  font-weight: 500;
  font-family: 'PlusJakartaSans-Medium';
`;

const BottomSpacer = styled.View`
  height: 25px;
`;
// ---

const ModalOverlay = styled.TouchableOpacity.attrs({
  activeOpacity: 1,
})`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: #2a2b2d; /* (어두운 테마) */
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-bottom: 30px; /* (Safe Area 하단 여백) */
`;
const ModalButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px 20px 0px 20px;
  border-top-width: 1px;
  border-color: #4a4b4c; /* (이전 응답에서 이 부분이 잘렸습니다) */
`;

const ModalButton = styled.TouchableOpacity<{ primary?: boolean }>`
  padding: 10px 20px;
`;

const ModalButtonText = styled.Text<{ primary?: boolean }>`
  font-size: 16px;
  font-family: 'PlusJakartaSans-SemiBold';
  color: ${(props) => (props.primary ? theme.colors.primary.mint : theme.colors.gray.gray_1)};
`;
