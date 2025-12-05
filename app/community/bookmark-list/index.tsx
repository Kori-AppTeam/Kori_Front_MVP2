import Icon from '@/components/common/Icon';
import BookmarkList from '@/src/features/community/post/components/BookmarkList';
import MyPostModal from '@/src/features/community/post/components/elements/footer/MyPostModal';
import OthersPostModal from '@/src/features/community/post/components/elements/footer/OthersPostModal';
import { useOpenMoreSheet } from '@/src/features/community/shared/hooks/useOpenMoreSheet';
import CustomBottomSheet from '@/src/shared/components/CustomBottomSheet';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React from 'react';
import styled from 'styled-components/native';

const BookmarksScreen = () => {
  const { selectedPost, openModal, closeModal, isMine, authorId, bottomSheetRef } = useOpenMoreSheet();

  return (
    <>
      <Safe>
        <Header>
          <Back onPress={() => router.back()}>
            <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
          </Back>
          <Title>Bookmarked</Title>
          <RightSpace />
        </Header>

        <BookmarkList openModal={openModal} />
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
};

export default BookmarksScreen;

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
`;
const Header = styled.View`
  height: 48px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const Back = styled.Pressable`
  width: 40px;
  align-items: flex-start;
`;
const Title = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-family: 'PlusJakartaSans_500Bold';
`;
const RightSpace = styled.View`
  width: 40px;
`;
