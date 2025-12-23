import Icon from '@/components/common/Icon';
import MyCommentsList from '@/src/features/community/post/components/MyCommentsList';
import MyPostsList from '@/src/features/community/post/components/MyPostsList';
import useVisitor from '@/src/features/community/post/hooks/useVisitor';
import { textStyle, theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import styled from 'styled-components/native';

type Tab = 'post' | 'comment';

export default function MyHistoryScreen() {
  const { data } = useVisitor();
  const [tab, setTab] = useState<Tab>('post');

  return (
    <Safe>
      <Header>
        <Back onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </Back>
        <HeaderTitle>My History</HeaderTitle>
        <RightPlaceholder />
      </Header>

      <TabsWrap>
        <TabsRow>
          <TabItem active={tab === 'post'} onPress={() => setTab('post')}>
            <TabBox active={tab === 'post'}>
              <TabText active={tab === 'post'}>My Post</TabText>
            </TabBox>
          </TabItem>
          <TabItem active={tab === 'comment'} onPress={() => setTab('comment')}>
            <TabBox active={tab === 'comment'}>
              <TabText active={tab === 'comment'}>Comments</TabText>
            </TabBox>
          </TabItem>
        </TabsRow>
      </TabsWrap>
      <TabsBottomLine />

      {tab === 'post' ? <MyPostsList authorId={data?.userId} /> : <MyCommentsList authorId={data?.userId} />}
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;

const Header = styled.View`
  padding: 11px 20px 16px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Back = styled.Pressable`
  width: 40px;
  align-items: flex-start;
`;

const HeaderTitle = styled.Text`
  ${({ theme }) => textStyle(theme.fonts.body.B2_M)};
  color: ${({ theme }) => theme.colors.primary.white};
  text-align: center;
  flex: 1;
`;

const RightPlaceholder = styled.View`
  width: 40px;
`;

const TabsWrap = styled.View`
  padding: 0 16px;
`;

const TabsRow = styled.View`
  flex-direction: row;
`;

const TabItem = styled.Pressable<{ active: boolean }>`
  flex: 1;
  align-items: center;
`;

const TabBox = styled.View<{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 15px 20px;
  min-width: 115px;
  border-bottom-width: 2px;
  border-bottom-color: ${({ theme, active }) => (active ? theme.colors.primary.mint : 'transparent')};
`;

const TabText = styled.Text<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.colors.primary.mint : theme.colors.gray.darkGray_2)};
  ${({ theme }) => textStyle(theme.fonts.body.B4_M)};
`;

const TabsBottomLine = styled.View`
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  border-bottom-width: 1px;
`;
