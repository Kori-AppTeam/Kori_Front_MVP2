import Icon from '@/components/common/Icon';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import SortTabs from '@/components/SortTabs';
import WriteFab from '@/components/WriteFab';

import CategoryChips from '@/src/features/community/post/components/CategoryChips';
import MyPostModal from '@/src/features/community/post/components/elements/footer/MyPostModal';
import OthersPostModal from '@/src/features/community/post/components/elements/footer/OthersPostModal';
import PostList from '@/src/features/community/post/components/PostList';
import { useHandleCommunityList } from '@/src/features/community/post/hooks/useHandleList';
import useVisitor from '@/src/features/community/post/hooks/useVisitor';
import { CATEGORY_TO_BOARD_ID, COMMUNITY_ROUTER } from '@/src/features/community/shared/constants/constants';
import { useOpenMoreSheet } from '@/src/features/community/shared/hooks/useOpenMoreSheet';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { textStyle, theme } from '@/src/styles/theme';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback } from 'react';
import styled from 'styled-components/native';

const ICON = require('@/assets/images/IsolationMode.png');

export default function CommunityScreen() {
  const { selectedPost, openModal, closeModal, isMine, authorId, bottomSheetRef } = useOpenMoreSheet();

  const { sort, category, handleSortChange, handleCategoryChange, scrollRef, scrollToTop } = useHandleCommunityList();

  const { refetch, isLoading, handleBlockVisitor, profileModalVisible, setProfileModalVisible } = useVisitor();

  // community 화면 보일 때마다 visitor 검사
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <>
      <Safe>
        <Header>
          <Left>
            <TextButton onPress={() => scrollToTop(true)} activeOpacity={0.6}>
              <Title>Community</Title>
            </TextButton>
            <IconImage source={ICON} resizeMode="contain" />
          </Left>

          <Right>
            <IconBtn
              onPress={() => {
                router.push({
                  pathname: '/community/SearchScreen',
                  params: {
                    qs: `?boardId=${encodeURIComponent(String(CATEGORY_TO_BOARD_ID[category]))}&cat=${encodeURIComponent(category)}`,
                  },
                });
              }}
            >
              <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>

            <IconBtn
              onPress={() => {
                handleBlockVisitor(() => router.push(COMMUNITY_ROUTER['BOOKMARK']));
              }}
            >
              <Icon type="bookmarkNonSelected" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>

            <IconBtn
              onPress={() => {
                handleBlockVisitor(() => router.push(COMMUNITY_ROUTER['MY_HISTORY']));
              }}
            >
              <Icon type="person" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>
          </Right>
        </Header>

        <ChipsWrap>
          <CategoryChips value={category} onPress={handleCategoryChange} />
        </ChipsWrap>

        <SortWrap>
          <SortTabs value={sort} onPress={handleSortChange} />
        </SortWrap>

        <PostList sort={sort} category={category} openModal={openModal} scrollRef={scrollRef} />

        <WriteFab onHandleWritePress={() => handleBlockVisitor(() => router.push(COMMUNITY_ROUTER['WRITE']))} />
        <ProfileSetupModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />
      </Safe>
      <CustomBottomSheet ref={bottomSheetRef} backgroundColor="transparent">
        {selectedPost && authorId ? (
          isMine ? (
            <MyPostModal closeModal={closeModal} postId={selectedPost} />
          ) : (
            <OthersPostModal closeModal={closeModal} postId={selectedPost} authorId={authorId} />
          )
        ) : (
          <></>
        )}
      </CustomBottomSheet>
    </>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;
const Header = styled.View`
  padding: 0 12px;
  margin-top: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Left = styled.View`
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;
const TextButton = styled.TouchableOpacity``;
const Title = styled.Text`
  color: ${({ theme }) => theme.colors.primary.white};
  ${({ theme }) => textStyle(theme.fonts.Serif.H3_R)};
`;
const IconImage = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
`;
const Right = styled.View`
  flex-direction: row;
  align-items: center;
`;
const IconBtn = styled.Pressable`
  padding: 6px;
  margin-left: 8px;
`;
const ChipsWrap = styled.View`
  margin-top: 12px;
`;
const SortWrap = styled.View`
  margin-top: 20px;
  margin-left: 10px;
`;
