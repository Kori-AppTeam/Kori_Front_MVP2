import { useProfile } from '@/app/contexts/ProfileContext';
import Icon from '@/components/common/Icon';
import { theme } from '@/src/styles/theme';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Platform, // [수정]
  SafeAreaView,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import styled from 'styled-components/native';
import SkipHeader from './components/SkipHeader';

export default function BirthdaySelectionScreen() {
  const router = useRouter();
  const [text, setText] = useState(''); // (MM/DD/YYYY 포맷의 최종 날짜)
  const [validbirth, setValidBirth] = useState(false);
  const { profileData, updateProfile } = useProfile();

  // [수정] 피커를 위한 상태 추가
  const [date, setDate] = useState(new Date(2000, 0, 1)); // (기본값: 2000-01-01)
  const [showPicker, setShowPicker] = useState(false);

  // [수정] 날짜 포맷팅 함수 (MM/DD/YYYY)
  const formatDate = (d: Date): string => {
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear().toString();
    return `${month}/${day}/${year}`;
  };

  const validateDate = (input: string) => {
    // 1. MM/DD/YYYY 형식 체크
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
    if (!regex.test(input)) return false;

    // 2. 실제 날짜 존재 여부
    const [month, day, year] = input.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return false;

    // 3. 미래 날짜 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0); // (자정 기준으로 비교)
    if (date > today) return false;

    return true;
  };

  const handleSkip = () => {
    updateProfile('birthday', '');
    router.push('./PurposeStepScreen');
  };

  const moveNextScreen = () => {
    updateProfile('birthday', text);
    router.push('./PurposeStepScreen');
  };

  // [수정] 피커 값이 변경될 때마다 호출되는 함수 (iOS)
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    // iOS에서는 모달을 직접 닫아야 하므로, 여기서는 임시 날짜만 업데이트합니다.
    if (Platform.OS === 'ios') {
      setDate(currentDate);
    } else {
      // Android에서는 '확인'을 누르면 모달이 닫히므로 바로 확정
      confirmDate(currentDate);
    }
  };

  // [수정] 날짜 선택 '확인' 함수
  const confirmDate = (selectedDate: Date) => {
    setShowPicker(false); // 피커 닫기
    const formatted = formatDate(selectedDate);
    setText(formatted);
    setDate(selectedDate);
    setValidBirth(validateDate(formatted));
  };

  // [수정] 날짜 선택 '취소' 함수
  const cancelDate = () => {
    setShowPicker(false);
  };

  // [수정] 피커를 띄울 최대 날짜 (오늘)
  const maxDate = new Date();

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
            <BirthText isSet={text !== ''} isValid={validbirth} isText={text}>
              {text || 'MM/DD/YYYY'}
            </BirthText>
            {validbirth && text.length === 10 ? (
              <Icon type="check" size={24} color={theme.colors.primary.mint} />
            ) : !validbirth && text.length === 10 ? (
              <Icon type="close" size={24} color={theme.colors.secondary.red} />
            ) : null}
          </BirthBox>
        </TouchableOpacity>

        {!validbirth && text.length === 10 && (
          <ErrorWrapper>
            <ErrorBox>
              <Icon type="close" size={24} color={theme.colors.secondary.red} />
              <ErrorText>Please insert a valid date</ErrorText>
            </ErrorBox>
          </ErrorWrapper>
        )}

        <Spacer />

        <NextButton onPress={moveNextScreen} disabled={!validbirth} isDone={validbirth}>
          <ButtonText>Next</ButtonText>
        </NextButton>

        <BottomSpacer />
      </Container>

      {/* [수정] Date Picker Modal 추가 */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner" // (안드로이드 휠)
          onChange={onDateChange}
          maximumDate={maxDate}
          onPointerCancel={cancelDate} // (바깥쪽 터치 시)
          themeVariant="dark"
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <ModalOverlay onPress={cancelDate}>
            <ModalContent>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner" // (iOS 휠)
                onChange={onDateChange}
                maximumDate={maxDate}
                textColor={theme.colors.primary.white} // (iOS 휠 텍스트 색상)
                themeVariant="dark"
              />
              <ModalButtonContainer>
                <ModalButton onPress={cancelDate}>
                  <ModalButtonText>Cancel</ModalButtonText>
                </ModalButton>
                <ModalButton onPress={() => confirmDate(date)} primary>
                  <ModalButtonText primary>Done</ModalButtonText>
                </ModalButton>
              </ModalButtonContainer>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      )}
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
const BirthText = styled.Text<{ isSet: boolean; isValid: boolean; isText: string }>`
  flex: 1;
  font-size: 16px; /* (Input과 맞춤) */
  font-family: 'PlusJakartaSans-Regular'; /* (Input과 맞춤) */
  /* [수정] placeholder 및 유효성 검사 색상 */
  color: ${(props) =>
    !props.isSet
      ? '#616262' // (placeholder 색상)
      : props.isText.length === 10
        ? props.isValid
          ? '#ffffff'
          : '#FF4F4F'
        : '#ffffff'};
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