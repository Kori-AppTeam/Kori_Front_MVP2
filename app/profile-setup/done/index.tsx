import React from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import { useNavigation } from 'expo-router';
import { CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const index = () => {
  const navigation = useNavigation();
  const startKori = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: '(tabs)' }],
      }),
    );
  };

  return (
    <SafeArea>
      <StatusBar barStyle="light-content" />
      <Container source={require('@/assets/images/ProfileSetUpDone.png')} resizeMode="cover">
        <TitleWrapper>
          <TitleText>Profile set up Done!</TitleText>
          <SubTitleText>Now,you can use Kori</SubTitleText>
        </TitleWrapper>
        <Button onPress={startKori}>
          <ButtonText>Start Kori!</ButtonText>
        </Button>
      </Container>
    </SafeArea>
  );
};

export default index;

const SafeArea = styled(SafeAreaView).attrs({ edges: [] })`
  flex: 1;
`;

const Container = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrapper = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
`;

const TitleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};

  font-size: 50px;
  font-family: InstrumentSerif_400Regular;
`;

const SubTitleText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  font-size: 17px;
  font-family: PlusJakartaSans_300Light;
`;

const Button = styled.TouchableOpacity`
  align-self: center;
  background-color: ${({ theme }) => theme.colors.primary.mint};
  width: 90%;
  height: 50px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-bottom: 64px;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.primary.black};
  font-size: 16px;
  font-family: PlusJakartaSans_500Medium;
`;
