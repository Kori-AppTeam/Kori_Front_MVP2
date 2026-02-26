import ProfileTab from '@/src/features/profile/components/ProfileTab';
import UserInfoHeader from '@/src/features/profile/components/UserInfoHeader';
import CustomButton from '@/src/shared/components/CustomButton';
import HeaderNav from '@/src/shared/components/HeaderNav';
import TabButton, { TabsBottomLine, TabsRow } from '@/src/shared/components/TabButton';
import { useUserProfileQuery } from '@/src/shared/hooks/useUserProfileQuery';
import useAuthStore from '@/src/store/useAuthStore';
import { Safe } from '@/src/styles/GlobalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import styled from 'styled-components/native';

const Index = () => {
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const [tab, setTab] = useState('Profile');

  const { currentUserId } = useAuthStore();
  const { data: userInfo, isLoading, isError } = useUserProfileQuery(Number(userId));

  const myProfile = Number(userId) === currentUserId;

  // if (isLoading) {
  //   return (
  //     <Safe>

  //     </Safe>
  //   );
  // }

  // if (isError || !userInfo) {
  //   return (
  //     <Safe>

  //     </Safe>
  //   );
  // }

  if (!userInfo) {
  }

  return (
    <Safe>
      <HeaderContainer>
        <HeaderBackground source={require('@/assets/images/profile_header_bg.png')} />
        <HeaderNav title="Profile" iconType="close" onClick={() => router.back()} />
      </HeaderContainer>
      <UserInfoHeader userId={Number(userId)} data={userInfo} />
      <TabsWrap>
        <TabButton title="Profile" activeTab={tab === 'Profile'} onPress={() => setTab('Profile')} />
        <TabButton title="Linked Space" activeTab={tab === 'Linked Space'} onPress={() => setTab('Linked Space')} />
        <TabButton title="Post" activeTab={tab === 'Post'} onPress={() => setTab('Post')} />
      </TabsWrap>
      <TabsBottomLine />
      <BodyWrap>
        {tab === 'Profile' && (
          <ProfileTab about={userInfo?.introduction} lang={userInfo?.language} interest={userInfo?.hobby} />
        )}
      </BodyWrap>
      <BottomButtonWrap>
        {myProfile && (
          <CustomButton label="Edit Profile" tone="darkGray" filled onPress={() => router.push('/mypage/edit')} />
        )}
      </BottomButtonWrap>
    </Safe>
  );
};

export default Index;

const HeaderContainer = styled.View`
  align-items: center;
  height: 116px;
  position: relative;
  overflow: hidden;
`;
const HeaderBackground = styled.ImageBackground`
  position: absolute;
  top: -51px;
  left: 0;
  width: 100%;
  aspect-ratio: 750 / 944;
`;
const BodyWrap = styled.View`
  flex: 1;
`;
const BottomButtonWrap = styled.View`
  padding: 20px 20px 40px 20px;
`;
const TabsWrap = styled(TabsRow)`
  margin-top: 16px;
`;
