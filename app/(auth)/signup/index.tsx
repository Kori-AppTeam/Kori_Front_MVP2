import { patchLocation } from '@/api/member/location';
import { requestLocationPermission } from '@/lib/location/requestLocationPermission';
import { ACCESS_KEY, REFRESH_KEY } from '@/src/lib/auth/session';
import { Config } from '@/src/shared/constants/config';
import axios from 'axios';
import { usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Alert, StatusBar } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import * as Location from 'expo-location';
import {
  SIGNUP_DONE_ROUTE,
  SIGNUP_PRIVACY_POLICY_ROUTE,
  SIGNUP_ROUTE,
  SIGNUP_TERMS_AND_CONDITIONS_ROUTE,
} from '@/src/shared/constants/route';
import DetailHeader from '@/components/common/DetailHeader';
import ConfirmTermsBottomSheet from '@/src/features/auth/components/ConfirmTermsBottomSheet';
import { useConfirmTerms } from '@/src/features/auth/hooks/useConfirmTerms';
import { useConfirmTermsBottomSheet } from '@/src/features/auth/hooks/useConfirmTermsBottomSheet';
import EmailForm from '@/src/features/auth/components/EmailForm';
import PasswordForm from '@/src/features/auth/components/PasswordForm';
import CustomButton from '@/src/shared/components/CustomButton';

enum isDuplicatedEmail {
  Init = 'Init',
  Exist = 'Exist',
  NotExist = 'NotExist',
}

enum isCorrectCode {
  Init = 'Init',
  Fail = 'Fail',
  Success = 'Success',
}

const index = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isExistEmail, setIsExistEmail] = useState<isDuplicatedEmail>(isDuplicatedEmail.Init);
  const [isCorrect, setIsCorrect] = useState<isCorrectCode>(isCorrectCode.Init);
  const [code, setCode] = useState('');
  const pathname = usePathname();
  const [isNextButtonClicked, setIsNextButtonClicked] = useState<boolean>(false);

  const {} = useConfirmTerms();
  const { bottomSheetRef, handleBottomSheetClose, handleBottomSheetOpen } = useConfirmTermsBottomSheet();

  const [checks, setChecks] = useState({
    isnull: true,
    uppercase: false,
    length: false,
    special: false,
  });

  const [EmailChecks, setEmailChecks] = useState({
    isnull: true,
    isEmail: false,
  });

  const [isSamePassword, setIsSamePassword] = useState({
    isnull: true,
    isSame: false,
  });

  const completeCondition =
    isCorrect === isCorrectCode.Success &&
    checks.length &&
    checks.uppercase &&
    checks.special &&
    isSamePassword.isSame === true;

  useEffect(() => {
    setChecks({
      isnull: password.length === 0,
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      special: /[@!~]/.test(password),
    });
  }, [password]);

  useEffect(() => {
    setEmailChecks({
      isnull: email.length === 0,
      isEmail: isEmail(),
    });
  }, [email]);

  useEffect(() => {
    setIsSamePassword({
      isnull: repeatPassword.length === 0,
      isSame: repeatPassword === password,
    });
  }, [repeatPassword]);

  const isEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 가입된 이메일 중복 체크 후 -> 이메일 인증 코드 발송
  const VerifyEmail = async () => {
    try {
      const res = await axios.post(`${Config.SERVER_URL}/api/v1/member/email/check`, { email: email });
      const { exists } = res.data.data;
      if (exists) {
        setIsExistEmail(isDuplicatedEmail.Exist);
      } else {
        // 이메일 인증 시작
        const res = await axios.post(`${Config.SERVER_URL}/api/v1/member/send-verification-email`, {
          email: email,
          lang: 'en',
        });
        setIsExistEmail(isDuplicatedEmail.NotExist);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('message:', err.message); // 예: "Network Error"
        console.error('code:', err.code); // 예: "ERR_NETWORK" (axios 1.x)
      }
      console.error('이메일 확인 중 에러 발생', err);
    }
  };

  // 이메일 인증 코드 보내서 검증 받음
  const verifyCode = async () => {
    try {
      const res = await axios.post(`${Config.SERVER_URL}/api/v1/member/verify-code`, {
        email: email,
        verificationCode: code,
      });

      const data = res.data.data;

      if (data) {
        setIsCorrect(isCorrectCode.Success);
      } else {
        setIsCorrect(isCorrectCode.Fail);
      }
    } catch (err) {
      console.error('코드 확인 중 에러 발생', err);
    }
  };

  const JoinMember = async () => {
    const { latitude, longitude } = await requestLocationPermission();

    try {
      const response = await axios.post(`${Config.SERVER_URL}/api/v1/member/signup`, {
        email,
        password,
        agreedToTerms: true,
      });
      if (response.status !== 200) {
        Alert.alert('Signup Failed', 'Please try again.');
        return;
      }

      const { accessToken, refreshToken, userId } = response.data;
      await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
      await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
      await SecureStore.setItemAsync('MyuserId', userId.toString());

      await patchLocation(latitude, longitude);
      router.replace(SIGNUP_DONE_ROUTE);
    } catch (err) {
      console.error('회원가입 중 에러 발생', err);
      Alert.alert('Error', '회원가입 중 문제가 발생했습니다.');
    }
  };

  const showModal = () => {
    setIsNextButtonClicked(true); // 버튼 클릭 여부 저장
    handleBottomSheetOpen(); // Next 버튼 클릭 시 모달 열기
  };

  const showTermsAndConditions = () => {
    handleBottomSheetClose();
    router.push(SIGNUP_TERMS_AND_CONDITIONS_ROUTE);
  };

  const showPrivacyPolicy = () => {
    handleBottomSheetClose();
    router.push(SIGNUP_PRIVACY_POLICY_ROUTE);
  };

  // next 버튼 클릭 상태에 따라 모달 열기
  useEffect(() => {
    // 회원가입 페이지가 아닌 경우 모달 닫음
    if (pathname !== SIGNUP_ROUTE) return;

    if (isNextButtonClicked) handleBottomSheetOpen();
  }, [pathname]);

  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <DetailHeader title="Create your account" onButtonPress={() => router.back()} />
      <Container>
        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          extraScrollHeight={40} // 입력창 위로 조금만 올리기
          enableOnAndroid={true}
        >
          <GeneralLoginContainer>
            <EmailForm />
            {/* 
            <TitleContainer>
              <TitleText>Email</TitleText>
            </TitleContainer>
            <VerifyContainer>
              <EmailContainer>
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setIsExistEmail(isDuplicatedEmail.Init); // 입력값 바뀔 때마다 초기화
                  }}
                />
                <CloseErrorBox>
                  {!EmailChecks.isEmail && !EmailChecks.isnull && (
                    <Icon type="close" size={24} color={theme.colors.secondary.red} />
                  )}
                </CloseErrorBox>
              </EmailContainer>

              {isExistEmail !== isDuplicatedEmail.NotExist && (
                <VerifyButton onPress={VerifyEmail} disabled={!EmailChecks.isEmail} canVerify={EmailChecks.isEmail}>
                  <VerifyText>Verify</VerifyText>
                </VerifyButton>
              )}
            </VerifyContainer>
            <ErrorBox>
              {!EmailChecks.isEmail && !EmailChecks.isnull && (
                <>
                  <Icon type="info" size={16} color={theme.colors.secondary.red} />
                  <ErrorText>Not the correct email format.</ErrorText>
                </>
              )}

              {EmailChecks.isEmail && isExistEmail === isDuplicatedEmail.Exist && (
                <>
                  <Icon type="info" size={16} color={theme.colors.secondary.red} />
                  <ErrorText>This email is already in use.</ErrorText>
                </>
              )}
            </ErrorBox>
            
            <TitleContainer>
              <TitleText>Code Verification</TitleText>
            </TitleContainer>
            <VerifyContainer>
              <CodeVerifyContainer>
                <CodeInputBox
                  value={code}
                  onChangeText={(text) => {
                    setCode(text);
                    setIsCorrect(isCorrectCode.Init);
                  }}
                  placeholder="Enter Code"
                  placeholderTextColor={'#616262'}
                />
              </CodeVerifyContainer>
              {isCorrect === isCorrectCode.Success ? (
                <ShowVerifiedBox>
                  <Entypo name="check" size={24} color="#949899" />
                </ShowVerifiedBox>
              ) : (
                <VerifyButton
                  onPress={verifyCode}
                  disabled={isExistEmail === isDuplicatedEmail.Exist}
                  canVerify={isExistEmail === isDuplicatedEmail.NotExist}
                >
                  <VerifyText>Verify</VerifyText>
                </VerifyButton>
              )}
            </VerifyContainer>
            {isCorrect === isCorrectCode.Fail && (
              <>
                <ErrorBox>
                  <Icon type="info" size={16} color={theme.colors.secondary.red} />
                  <ErrorText>Fail Code Verification</ErrorText>
                </ErrorBox>
              </>
            )}
            {isCorrect === isCorrectCode.Success && (
              <>
                <NotErrorBox>
                  <Icon type="check" size={16} color={theme.colors.primary.mint} />
                  <NotErrorText>Authentication successful</NotErrorText>
                </NotErrorBox>
              </>
            )} */}

            <PasswordForm />
            {/* <TitleContainer>
              <TitleText>Password</TitleText>
            </TitleContainer>
            <PasswordContainer>
              <PasswordInputBox
                value={password}
                onChangeText={setPassword}
                placeholder="Enter Password"
                placeholderTextColor={'#616262'}
                //secureTextEntry={lookPassword}
              />
              <EyeIconBox>
                <TouchableOpacity onPress={() => setLookPassword(!lookPassword)}>
                  <Ionicons name={lookPassword ? 'eye-off-outline' : 'eye-outline'} size={25} color="#616262" />
                </TouchableOpacity>
              </EyeIconBox>
            </PasswordContainer>

            <CheckPasswordContainer>
              <CheckPasswordBox>
                {checks.isnull ? (
                  <>
                    <Icon type="check" size={16} color="#848687" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.uppercase}>
                      Use all case letters
                    </CheckPasswordText>
                  </>
                ) : checks.uppercase ? (
                  <>
                    <Icon type="check" size={16} color="#02F59B" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.uppercase}>
                      Use all case letters
                    </CheckPasswordText>
                  </>
                ) : (
                  <>
                    <Icon type="close" size={16} color="#FF4F4F" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.uppercase}>
                      Use all case letters
                    </CheckPasswordText>
                  </>
                )}
              </CheckPasswordBox>

              <CheckPasswordBox>
                {checks.isnull ? (
                  <>
                    <Icon type="check" size={16} color="#848687" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.length}>
                      Enter 8-12 letters
                    </CheckPasswordText>
                  </>
                ) : checks.length ? (
                  <>
                    <Icon type="check" size={16} color="#02F59B" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.length}>
                      Enter 8-12 letters
                    </CheckPasswordText>
                  </>
                ) : (
                  <>
                    <Icon type="close" size={16} color="#FF4F4F" />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.length}>
                      Enter 8-12 letters
                    </CheckPasswordText>
                  </>
                )}
              </CheckPasswordBox>

              <CheckPasswordBox>
                {checks.isnull ? (
                  <>
                    <Icon type="check" size={16} color={theme.colors.gray.gray_1} />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.special}>
                      Enter special letters (@/!/~)
                    </CheckPasswordText>
                  </>
                ) : checks.special ? (
                  <>
                    <Icon type="check" size={16} color={theme.colors.primary.mint} />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.special}>
                      Enter special letters (@/!/~)
                    </CheckPasswordText>
                  </>
                ) : (
                  <>
                    <Icon type="close" size={16} color={theme.colors.secondary.red} />
                    <CheckPasswordText $isnull={checks.isnull} $check={checks.special}>
                      Enter special letters (@/!/~)
                    </CheckPasswordText>
                  </>
                )}
              </CheckPasswordBox>
            </CheckPasswordContainer>

            <TitleContainer>
              <TitleText>Repeat Password</TitleText>
            </TitleContainer>
            <PasswordContainer>
              <PasswordInputBox
                value={repeatPassword}
                onChangeText={setRepeatPassword}
                placeholder="Enter Password"
                placeholderTextColor={'#616262'}
                secureTextEntry={lookRepeatPassword}
              />
              <EyeIconBox>
                <TouchableOpacity onPress={() => setLookRepeatPassword(!lookRepeatPassword)}>
                  <Ionicons name={lookRepeatPassword ? 'eye-off-outline' : 'eye-outline'} size={25} color="#616262" />
                </TouchableOpacity>
              </EyeIconBox>
            </PasswordContainer>
            {!isSamePassword.isnull && isSamePassword.isSame && (
              <NotErrorBox>
                <Icon type="check" size={16} color={theme.colors.primary.mint} />
                <NotErrorText>Your password match.</NotErrorText>
              </NotErrorBox>
            )}

            {!isSamePassword.isnull && !isSamePassword.isSame && (
              <ErrorBox>
                <Icon type="close" size={16} color={theme.colors.secondary.red} />
                <ErrorText>Your password do not match.</ErrorText>
              </ErrorBox>
            )} */}
          </GeneralLoginContainer>
        </KeyboardAwareScrollView>
        <CustomButton label="Next" disabled={!completeCondition} onPress={showModal} />
        {/* <NextButtonContainer disabled={!completeCondition} completeCondition={completeCondition} onPress={showModal}>
          <NextText>Next</NextText>
        </NextButtonContainer> */}
      </Container>
      {/* 약관 동의 바텀시트 */}
      <ConfirmTermsBottomSheet
        bottomSheetClose={() => handleBottomSheetClose()}
        bottomSheetRef={bottomSheetRef}
        loginProvider="email"
      />
    </SafeArea>
  );
};

export default index;

/* 스타일 */
const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.primary.black};
  padding: 0px 20px 32px 20px;
`;

const GeneralLoginContainer = styled.View`
  padding-bottom: 40px;
  margin-top: 24px;
`;
