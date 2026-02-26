import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { textStyle } from '@/src/styles/theme';
import { SafeAreaWithNoNavBar } from '@/src/styles/GlobalStyles';

const SignUpDoneScreen = () => {
  const router = useRouter();
  const goMakeProfile = () => {
    router.dismissAll(); // 네비게이션 스택 다 비움
    router.replace('/screens/makeprofile/NameStepScreen'); // 프로필 생성 화면으로 이동
  };

  return (
    <SafeAreaWithNoNavBar>
      <StatusBar barStyle="light-content" />
      <Container source={require('@/assets/images/SignUpDone.png')} resizeMode="cover">
        <TitleText>Sign up Done!</TitleText>
        <SubTitleText>Now, you can use Kori</SubTitleText>
        <Button onPress={goMakeProfile}>
          <ButtonText>Start</ButtonText>
        </Button>
      </Container>
    </SafeAreaWithNoNavBar>
  );
};

export default SignUpDoneScreen;

const Container = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const TitleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.Serif.H1_R)}
  position: absolute;
  top: 100;
`;
const SubTitleText = styled.Text`
  color: ${({ theme }) => theme.colors.gray.lightGray_1};
  ${({ theme }) => textStyle(theme.fonts.body.B3_L)}
  position: absolute;
  top: 170;
`;
const Button = styled.TouchableOpacity`
  position: absolute;
  align-self: center;
  bottom: 50;
  background-color: ${({ theme }) => theme.colors.primary.mint};
  width: 90%;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
`;
const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  ${({ theme }) => textStyle(theme.fonts.body.B3_M)}
`;
