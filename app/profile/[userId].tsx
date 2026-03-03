import { ErrorContainer, ErrorText, RetryButton, RetryButtonText } from '@/src/features/community/shared/styles/styles';
import LinkedSpaceTab from '@/src/features/profile/components/LinkedSpaceTab';
import PostTab from '@/src/features/profile/components/PostTab';
import ProfileTab from '@/src/features/profile/components/ProfileTab';
import UserInfoHeader from '@/src/features/profile/components/UserInfoHeader';
import CustomButton from '@/src/shared/components/CustomButton';
import HeaderNav from '@/src/shared/components/HeaderNav';
import TabButton, { TabsBottomLine, TabsRow } from '@/src/shared/components/TabButton';
import { UserProfileCardActions } from '@/src/shared/components/UserProfileCard/UserProfileCardActions';
import { useFriendAction } from '@/src/shared/hooks/useFriendAction';
import { useUserProfileQuery } from '@/src/shared/hooks/useUserProfileQuery';
import useAuthStore from '@/src/store/useAuthStore';
import { Safe } from '@/src/styles/GlobalStyles';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const Index = () => {
  const { userId } = useLocalSearchParams<{
    userId: string;
  }>();
  const [tab, setTab] = useState('Profile');

  const { currentUserId } = useAuthStore();
  const { data: userInfo, isLoading, isError, refetch } = useUserProfileQuery(Number(userId));
  const { getFollowAction, handleChat } = useFriendAction(userInfo);

  const myProfile = Number(userId) === currentUserId;

  if (isLoading) {
    return (
      <Safe>
        <HeaderContainer>
          <HeaderNav title="Profile" iconType="close" onClick={() => router.back()} />
        </HeaderContainer>
        <LoadingContainer>
          <ActivityIndicator size="large" />
        </LoadingContainer>
      </Safe>
    );
  }

  if (isError || !userInfo) {
    return (
      <Safe>
        <HeaderContainer>
          <HeaderNav title="Profile" iconType="close" onClick={() => router.back()} />
        </HeaderContainer>
        <ErrorContainer>
          <ErrorText>Ooops...</ErrorText>
          <RetryButton onPress={() => refetch()}>
            <RetryButtonText>Try Again</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Safe>
    );
  }

  return (
    <Safe>
      <HeaderContainer>
        <HeaderBackground source={require('@/assets/images/profile_header_bg.png')} />
        <HeaderNav title="Profile" iconType="close" onClick={() => router.back()} />
      </HeaderContainer>
      <UserInfoHeader userId={Number(userId)} data={userInfo} isMyProfile={myProfile} />

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
        {tab === 'Linked Space' && <LinkedSpaceTab userId={Number(userId)} />}
        {tab === 'Post' && <PostTab userId={Number(userId)} />}
      </BodyWrap>

      <BottomButtonWrap>
        {myProfile ? (
          <CustomButton label="Edit Profile" tone="darkGray" filled onPress={() => router.push('/mypage/edit')} />
        ) : (
          <UserProfileCardActions
            actions={{
              ...getFollowAction(),
              chat: { label: 'Chat', onPress: () => handleChat('push', 0) },
            }}
          />
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

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const BodyWrap = styled.View`
  flex: 1;
`;

const BottomButtonWrap = styled.View`
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  aspect-ratio: 375 / 50;
  margin-bottom: 20px;
`;

const TabsWrap = styled(TabsRow)`
  margin-top: 16px;
`;
