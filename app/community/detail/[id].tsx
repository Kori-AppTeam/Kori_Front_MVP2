import Icon from '@/components/common/Icon';
import SortTabs from '@/components/SortTabs';
import PostCarousel from '@/src/features/community/post/components/elements/body/PostCarousel';
import PostSingleImage from '@/src/features/community/post/components/elements/body/PostSingleImage';
import PostTextContent from '@/src/features/community/post/components/elements/body/PostTextContent';
import EditCommentModal from '@/src/features/community/post/components/elements/comment/EditCommentModal';
import PostComment from '@/src/features/community/post/components/elements/comment/PostComment';
import PostCommentInput from '@/src/features/community/post/components/elements/comment/PostCommentInput';
import PostCommonFooter from '@/src/features/community/post/components/elements/footer/PostCommonFooter';
import PostCommonHeader from '@/src/features/community/post/components/elements/header/PostCommonHeader';
import { useCommentManager } from '@/src/features/community/post/hooks/comment/useCommentManager';
import { useGetPostDetail } from '@/src/features/community/post/hooks/useGetPostDetail';
import { useHandleLikeBookmark } from '@/src/features/community/post/hooks/useHandleLikeBookmark';
import { useMoreSheetStore } from '@/src/features/community/post/store/useMoreSheetStore';
import { SortParam } from '@/src/features/community/post/types';
import { ContentBox } from '@/src/features/community/shared/styles/styles';
import { CommentNode } from '@/src/features/community/shared/utils/organizeComment';
import ProfileModal from '@/src/shared/components/ProfileModal';
import { useUserProfileQuery } from '@/src/shared/hooks/useUserProfileQuery';
import { textStyle, theme } from '@/src/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import type { FlatList as RNFlatList } from 'react-native';
import { Dimensions, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import styled from 'styled-components/native';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const postId = Number(id);

  const [sort, setSort] = useState<SortParam>('LATEST');
  const { postDetailData, isLoading, isError, error } = useGetPostDetail(Number.isFinite(postId) ? postId : undefined);

  const manage = useCommentManager(postId, sort);

  // 프로필 모달 상태 관리
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const selectedUser = useUserProfileQuery(targetUserId);

  const handleSetSelectedUser = (userId: number) => {
    setTargetUserId(userId);
    setIsProfileVisible(true);
  };

  const [anonymous, setAnonymous] = useState(false);

  const listRef = useRef<RNFlatList<CommentNode>>(null);

  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { handleToggleBookmark, handleToggleLike } = useHandleLikeBookmark();
  const { showMoreSheet } = useMoreSheetStore();

  if (isLoading) {
    return (
      <Safe>
        <Header>
          <Back onPress={() => router.back()}>
            <Icon type="previous" size={20} color={theme.colors.gray.lightGray_1} />
          </Back>
          <HeaderTitle>Post</HeaderTitle>
          <RightPlaceholder />
        </Header>
        <Center>
          <Dim>Loading…</Dim>
        </Center>
      </Safe>
    );
  }
  if (isError || !postDetailData) {
    return (
      <Safe>
        <Header>
          <Back onPress={() => router.back()}>
            <Icon type="previous" size={20} color={theme.colors.gray.lightGray_1} />
          </Back>
          <HeaderTitle>Post</HeaderTitle>
          <RightPlaceholder />
        </Header>
        <Center>
          <Dim>Post not found.</Dim>
        </Center>
      </Safe>
    );
  }

  return (
    <Safe>
      <Header>
        <Back onPress={() => router.back()}>
          <Icon type="previous" size={24} color={theme.colors.gray.lightGray_1} />
        </Back>
        <HeaderTitle>Post</HeaderTitle>
        <RightPlaceholder />
      </Header>

      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 26}
      >
        <FlatList<CommentNode>
          ref={listRef}
          data={manage.organizedComments}
          keyExtractor={(item) => String(item.commentId)}
          renderItem={({ item, index }) => (
            <>
              <PostComment
                data={item}
                onShowProfileModal={() => handleSetSelectedUser(item.authorId)}
                onToggleLike={() => manage.toggleCommentLike(item)}
                onOpenModal={() => showMoreSheet('comment', postId, item.authorId, item.commentId, item.content)}
                onClickReply={() => manage.onClickReplyToComment(item.commentId)}
              />
              {/* 대댓글 */}
              {item.replies &&
                item.replies.map((reply) => (
                  <PostComment
                    key={reply.commentId}
                    data={reply}
                    onShowProfileModal={() => handleSetSelectedUser(reply.authorId)}
                    onToggleLike={() => manage.toggleCommentLike(reply)}
                    onOpenModal={() => showMoreSheet('comment', postId, reply.authorId, reply.commentId, reply.content)}
                  />
                ))}
            </>
          )}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ backgroundColor: theme.colors.gray.darkBlack_1 }}
          onTouchStart={manage.onCancelReplyToComment}
          ListHeaderComponent={
            <>
              {/* 게시글카드 */}
              <Container>
                <PostCommonHeader
                  showProfileModal={true}
                  onShowProfileModal={() => handleSetSelectedUser(postDetailData.authorId)}
                  authorId={postDetailData.authorId}
                  postId={postDetailData.postId}
                  authorName={postDetailData.authorName}
                  isAnonymous={postDetailData.isAnonymous}
                  userImageUrl={postDetailData.userImageUrl}
                  createdAt={postDetailData.createdTime}
                  boardCategory={postDetailData.boardCategory}
                  viewCount={postDetailData.viewCount}
                  isBookmarked={postDetailData.isBookmarked}
                  onToggleBookmark={() => handleToggleBookmark(postDetailData.postId, postDetailData.isBookmarked)}
                />

                <ContentBox>
                  {/* 이미지 컨텐츠 */}
                  {postDetailData.contentImageUrls !== undefined &&
                    postDetailData.contentImageUrls.length > 0 &&
                    (postDetailData.contentImageUrls.length > 1 ? (
                      <PostCarousel
                        images={postDetailData.contentImageUrls}
                        gap={5}
                        offset={20}
                        pageWidth={SCREEN_WIDTH}
                        imageCount={postDetailData.imageCount}
                      />
                    ) : (
                      <PostSingleImage
                        imageUrl={postDetailData.contentImageUrls[0]}
                        imageCount={postDetailData.imageCount}
                        pageWidth={SCREEN_WIDTH - 20 * 2}
                      />
                    ))}

                  {/* 텍스트 컨텐츠 */}
                  <PostTextContent isTruncate={false} content={postDetailData.content} />
                </ContentBox>

                <PostCommonFooter
                  isLiked={postDetailData.isLiked}
                  likeCount={postDetailData.likeCount}
                  commentCount={postDetailData.commentCount}
                  onToggleLike={() => handleToggleLike(postDetailData.postId, postDetailData.isLiked)}
                  onOpenModal={() => showMoreSheet('post', postDetailData.postId, postDetailData.authorId)}
                />
              </Container>

              {/* 정렬 탭 - 댓글 있을 때만 렌더링 */}
              {manage.organizedComments.length > 0 && (
                <SortWrap>
                  <SortTabs value={sort} onPress={setSort} />
                </SortWrap>
              )}
            </>
          }
        />

        {/* 댓글 인풋 */}
        <PostCommentInput
          inputRef={manage.inputRef}
          text={manage.value}
          onChangeText={manage.setValue}
          onSubmit={() => manage.handleSubmitComment(manage.value, anonymous)}
          isAnonymous={anonymous}
          setAnonymous={setAnonymous}
          category={postDetailData.boardCategory}
        />
      </KeyboardAvoidingView>

      {/* 프로필모달 */}
      <ProfileModal
        visible={isProfileVisible}
        userData={selectedUser.data}
        onClose={() => setIsProfileVisible(false)}
      />

      {/* 댓글 수정 모달 */}
      <EditCommentModal />
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: ${({ theme }) => theme.colors.primary.black};
`;
const Container = styled.View`
  padding: 20px 0;
  background-color: ${({ theme }) => theme.colors.primary.black};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray.darkGray_1};
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
const Center = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const Dim = styled.Text`
  color: #cfd4da;
`;
const SortWrap = styled.View`
  margin-bottom: 24px;
`;
