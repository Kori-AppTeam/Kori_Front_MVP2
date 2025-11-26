import React from 'react';
import styled from 'styled-components/native';
import Toast from 'react-native-toast-message';
import { useNavigation, useRouter } from 'expo-router';

import DetailHeader from '@/components/common/DetailHeader';
import { useEmailLogin } from '@/src/features/auth/hooks/useEmailLogin';
import { resetToTabsScreen } from '@/src/features/auth/lib/resetToTabScreen';
import CustomButton from '@/src/shared/components/CustomButton';
import Input from '@/src/shared/components/Input';
import TextButton from '@/src/shared/components/TextButton';
import { SIGNUP_ROUTE, VERIFY_EMAIL_ROUTE } from '@/src/shared/constants/route';
import { getAxiosErrorCode } from '@/src/shared/utils/getAxiosErrorCode';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { EMAIL_LOGIN_ERROR } from '@/src/features/auth/constants/error';

const index = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { email, setEmail, password, setPassword, emailLogin } = useEmailLogin();
  const isFull = email && password;

  const handleLoginPress = async () => {
    try {
      const isNewUser = await emailLogin();

      if (isNewUser) {
        router.push('/screens/makeprofile/NameStepScreen');
      } else {
        resetToTabsScreen(navigation);
      }
    } catch (error: unknown) {
      const errorCode = getAxiosErrorCode(error);
      const errorConfig = EMAIL_LOGIN_ERROR[errorCode];

      Toast.show({
        type: 'error',
        text1: errorConfig.message,
        text2: `Please check again.`,
        position: 'bottom',
        bottomOffset: 180,
      });
    }
  };

  const goSignUpPage = () => {
    router.push(SIGNUP_ROUTE);
  };

  const goResetScreen = () => {
    router.push(VERIFY_EMAIL_ROUTE);
  };

  return (
    <SafeArea>
      <DetailHeader title={'Continue with email'} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Container>
          <LoginInputWrapper>
            <Input
              placeholder="Enter email address"
              value={email}
              onChangeText={(text) => setEmail(text)}
              label="Email"
            />
            <Input
              placeholder="Enter password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              label="Password"
              secureTextEntry
            />
            <TextButton label="Forgot Password?" onPress={goResetScreen} />
          </LoginInputWrapper>
          <BottomButtonWrapper>
            <CustomButton label="Login" onPress={handleLoginPress} disabled={!isFull} />
            <TextButton label="Create new account" onPress={goSignUpPage} />
          </BottomButtonWrapper>
        </Container>
      </TouchableWithoutFeedback>
    </SafeArea>
  );
};

export default index;

const SafeArea = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.primary.black};
  padding: 0px 20px;
`;

const LoginInputWrapper = styled.View`
  flex: 1;
  justify-content: start;
  margin: 24px 0;
  gap: 30px;
`;

const BottomButtonWrapper = styled.View`
  width: 100%;
  gap: 24px;
  margin-bottom: 80px;
`;
