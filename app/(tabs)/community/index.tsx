import Icon from '@/components/common/Icon';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import SortTabs from '@/components/SortTabs';
import WriteFab from '@/components/WriteFab';

import CategoryChips from '@/src/features/community/post/components/CategoryChips';
import MyPostModal from '@/src/features/community/post/components/elements/footer/MyPostModal';
import OthersPostModal from '@/src/features/community/post/components/elements/footer/OthersPostModal';
import PostList from '@/src/features/community/post/components/PostList';
import useGetVisitor from '@/src/features/community/post/hooks/useGetVisitor';
import useScrollToTop from '@/src/features/community/post/hooks/useScrollToTop';
import { AllowedCategory, SortParam } from '@/src/features/community/post/types';
import { CATEGORY_TO_BOARD_ID } from '@/src/features/community/shared/constants/constants';
import { useOpenMoreSheet } from '@/src/features/community/shared/hooks/useOpenMoreSheet';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { textStyle, theme } from '@/src/styles/theme';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

const ICON = require('@/assets/images/IsolationMode.png');

export default function CommunityScreen() {
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const { data, isLoading, isError, refetch } = useGetVisitor();
  const { selectedPost, openModal, closeModal, isMine, authorId, bottomSheetRef } = useOpenMoreSheet();

  // community 화면 보일 때마다 visitor 검사
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  const [sort, setSort] = useState<SortParam>('LATEST');
  const [category, setCategory] = useState<AllowedCategory>('ALL');

  const { scrollRef, scrollToTop } = useScrollToTop();

  const handleSortChange = (sortButton: SortParam) => {
    if (sort === sortButton) return;
    scrollToTop(false);
    setSort(sortButton);
  };

  const handleCategoryChange = (cat: AllowedCategory) => {
    if (category === cat) return;
    scrollToTop(false);
    setCategory(cat);
  };

  const handleWritePress = () => {
    if (isLoading) {
      return;
    }

    if (isError) {
      console.error('[write:check] error');
      Alert.alert('Error', 'Failed to check profile status. Please try again.');
      return;
    }

    if (data) {
      if (data.profileCompleted === false) {
        setProfileModalVisible(true);
        return;
      }
    }
    router.push('/community/write/write');
  };

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
                router.push('/community/bookmark-list/bookmarks');
              }}
            >
              <Icon type="bookmarkNonSelected" size={24} color={theme.colors.gray.lightGray_1} />
            </IconBtn>

            <IconBtn onPress={() => router.push('/community/my-history/my-history')}>
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

        <WriteFab onHandleWritePress={handleWritePress} />
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
