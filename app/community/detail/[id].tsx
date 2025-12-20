import api from '@/api/axiosInstance';
import Icon from '@/components/common/Icon';
import ProfileImage from '@/components/common/ProfileImage';
import SortTabs from '@/components/SortTabs';
import { useUpdateComment } from '@/hooks/mutations/useUpdateComment';
import { blockComment } from '@/src/features/community/post/apis/comments';
import PostCarousel from '@/src/features/community/post/components/elements/body/PostCarousel';
import PostSingleImage from '@/src/features/community/post/components/elements/body/PostSingleImage';
import PostTextContent from '@/src/features/community/post/components/elements/body/PostTextContent';
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
import { theme } from '@/src/styles/theme';
import { router, useLocalSearchParams } from 'expo-router';
import React, { forwardRef, useRef, useState } from 'react';
import type { FlatList as RNFlatList } from 'react-native';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput as RNTextInput,
  TextInputProps,
  View,
} from 'react-native';
import styled from 'styled-components/native';

const StyledEditInput = styled(RNTextInput)`
  min-height: 220px;
  border-radius: 8px;
  padding: 12px;
  background: #1f2021;
  color: #e7eaed;
  font-size: 14px;
  border-width: 1px;
  border-color: #3a3d40;
`;
const EditInput = forwardRef<RNTextInput, TextInputProps>((props, ref) => <StyledEditInput ref={ref} {...props} />);
EditInput.displayName = 'EditInput';

export default function PostDetailScreen() {
  const { id, focusCommentId, intent, commentId } = useLocalSearchParams<{
    id: string;
    focusCommentId?: string;
    intent?: string;
    commentId?: string;
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

  const [menuVisible, setMenuVisible] = useState(false);
  const slideY = useRef(new Animated.Value(300)).current;
  const [anonymous, setAnonymous] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportCommentId, setReportCommentId] = useState<number | null>(null);
  type ReportTarget = 'post' | 'user' | 'comment';
  const [reportTarget, setReportTarget] = useState<ReportTarget>('post');

  //댓글 신고랑 차단
  type SheetCtx = { type: 'post' | 'comment' | null; commentId?: number };
  const [sheetCtx, setSheetCtx] = useState<SheetCtx>({ type: null });

  //리스트 보이도록
  const getCmtId = (c: any) => Number(c?.id ?? c?.commentId);
  // const visibleComments: Comment[] = useMemo(
  //   () => commentList.filter((c) => !hiddenCommentIds.has(getCmtId(c))),
  //   [commentList, hiddenCommentIds],
  // );

  const [editVisible, setEditVisible] = useState(false);
  const [editText, setEditText] = useState('');
  const editInputRef = useRef<RNTextInput>(null);

  const { mutateAsync: updateCommentMut } = useUpdateComment();

  const listRef = useRef<RNFlatList<CommentNode>>(null);

  const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

  const { handleToggleBookmark, handleToggleLike } = useHandleLikeBookmark();

  //게시글에서 열기
  // const openPostSheet = () => {
  //   setSheetCtx({ type: 'post' });
  //   setMenuVisible(true);
  //   slideY.setValue(300);
  //   Animated.timing(slideY, {
  //     toValue: 0,
  //     duration: 220,
  //     easing: Easing.out(Easing.cubic),
  //     useNativeDriver: true,
  //   }).start();
  // };

  //댓글에서 열기
  const openCommentSheet = (c: CommentNode) => {
    const cid = Number((c as any).id ?? (c as any).commentId);
    if (!Number.isFinite(cid)) return;
    setSheetCtx({ type: 'comment', commentId: cid });
    setMenuVisible(true);
    slideY.setValue(300);
    Animated.timing(slideY, {
      toValue: 0,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  // const openCommentReport = (c: Comment) => {
  //   const cid = Number((c as any).id ?? (c as any).commentId);
  //   if (!Number.isFinite(cid)) return;
  //   setReportTarget('comment');
  //   setReportCommentId(cid);
  //   setReportText('');
  //   setReportOpen(true);
  // };

  // const closeMenu = () =>
  //   new Promise<void>((resolve) => {
  //     Animated.timing(slideY, {
  //       toValue: 300,
  //       duration: 200,
  //       easing: Easing.in(Easing.cubic),
  //       useNativeDriver: true,
  //     }).start(() => {
  //       setMenuVisible(false);
  //       resolve();
  //     });
  //   });

  const onSubmitReport = () => {
    const reason = reportText.trim();

    if (reportTarget !== 'comment' && !reason) {
      Alert.alert('Report', 'Please enter details.');
      return;
    }

    const titleText =
      reportTarget === 'user'
        ? 'Report This User'
        : reportTarget === 'comment'
          ? 'Report This Comment'
          : 'Report This Post';

    Alert.alert('Report', `Are you sure\n${titleText}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Report',
        style: 'destructive',
        onPress: async () => {
          setReportLoading(true);
          try {
            if (reportTarget === 'comment') {
              if (!reportText.trim()) throw new Error('reason required');
              await api.post('/api/v1/chat/declaration', {
                ignored: reportText.trim(),
                // commentId: reportCommentId
              });
            } else if (reportTarget === 'user') {
              await api.post(`/api/v1/posts/${postId}/block`, { reason });
            } else {
              await api.post(`/api/v1/posts/${postId}/block`, { reason });
            }

            setReportOpen(false);
            setReportText('');
            setReportCommentId(null);
            Alert.alert('Report', 'We’ve received your report. It may take up to 24 hours for review.');
          } catch (e: any) {
            const s = e?.response?.status;
            let msg =
              s === 401
                ? 'Authentication required. Please log in again.'
                : s === 403
                  ? 'You do not have permission.'
                  : s === 404
                    ? 'Target not found.'
                    : s === 400
                      ? 'This comment cannot be blocked.'
                      : 'Failed to submit the report.';
            Alert.alert('Report', msg);

            console.group('[report] error');
            console.log('target', reportTarget, 'status', s);
            console.log('meta', { postId, reportCommentId });
            console.groupEnd();
          } finally {
            setReportLoading(false);
          }
        },
      },
    ]);
  };

  const onSaveEdit = async () => {
    const text = editText.trim();
    if (!text) {
      Alert.alert('Edit', 'Please enter your comment.');
      return;
    }
    if (!focusCommentId) {
      Alert.alert('Edit', 'Comment id missing.');
      return;
    }

    try {
      await updateCommentMut({ commentId: Number(focusCommentId), content: text });
      setEditVisible(false);
    } catch (e) {
      console.log('[update comment] error', e);
      Alert.alert('Edit', 'Failed to save changes.');
    }
  };

  const [hiddenCommentIds, setHiddenCommentIds] = useState<Set<number>>(new Set());

  const hideCommentLocal = (cid: number) => {
    setHiddenCommentIds((prev) => {
      const next = new Set(prev);
      next.add(cid);
      return next;
    });
  };
  // const unhideCommentLocal = (cid: number) => {
  //   setHiddenCommentIds((prev) => {
  //     if (!prev.has(cid)) return prev;
  //     const next = new Set(prev);
  //     next.delete(cid);
  //     return next;
  //   });
  // };

  //r게시글 차단
  const blockPostFromSheet = () => {
    if (!Number.isFinite(postId)) return;
    setMenuVisible(false);

    Alert.alert('Block', 'Are you sure you want to block this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.post(`/api/v1/posts/${postId}/declaration`, {});

            Alert.alert('Block', 'This post has been blocked.');
          } catch (e: any) {
            const s = e?.response?.status;
            const msg =
              s === 401
                ? 'Authentication required. Please log in again.'
                : s === 403
                  ? 'You do not have permission.'
                  : s === 404
                    ? 'Post not found.'
                    : 'Failed to block this post.';
            Alert.alert('Block', msg);
            console.log('[block post] error', { status: s, postId, e });
          } finally {
            router.back();
          }
        },
      },
    ]);
  };

  const blockCommentFromSheet = () => {
    if (sheetCtx.type !== 'comment' || !Number.isFinite(sheetCtx.commentId!)) return;
    const cid = sheetCtx.commentId!;
    setMenuVisible(false);

    Alert.alert('Block', 'Are you sure you want to block this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Block',
        style: 'destructive',
        onPress: async () => {
          hideCommentLocal(cid);

          try {
            await blockComment(cid, 'Blocked from comment sheet');
            Alert.alert('Block', 'This comment has been blocked.');
          } catch (e: any) {
            const s = e?.response?.status;
            const msg =
              s === 401
                ? 'Authentication required. Please log in again.'
                : s === 403
                  ? 'You do not have permission.'
                  : s === 404
                    ? 'Comment not found.'
                    : 'Failed to block this comment.';
            Alert.alert('Block', msg);
            console.log('[block comment] error', { status: s, commentId: cid, e });
          }
        },
      },
    ]);
  };

  const reportTitle =
    reportTarget === 'user'
      ? 'Report This User'
      : reportTarget === 'comment'
        ? 'Report This Comment'
        : 'Report This Post';

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
      {/* 게시글카드로 대체 */}
      <Header>
        <Back onPress={() => router.back()}>
          <Icon type="previous" size={20} color={theme.colors.primary.white} />
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
                onOpenModal={() => openCommentSheet(item)}
                onClickReply={() => manage.onClickReplyToComment(item.commentId)}
              />
              {item.replies &&
                item.replies.map((reply) => (
                  <PostComment
                    key={reply.commentId}
                    data={reply}
                    onShowProfileModal={() => handleSetSelectedUser(reply.authorId)}
                    onToggleLike={() => manage.toggleCommentLike(reply)}
                    onOpenModal={() => openCommentSheet(reply)}
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
                  userImageUrl={postDetailData.userImageUrl || undefined}
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
                  onOpenModal={() => showMoreSheet(postDetailData.postId, postDetailData.authorId)}
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

      <Modal transparent visible={menuVisible} onRequestClose={() => setMenuVisible(false)} animationType="none">
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setMenuVisible(false)} />
          <Animated.View
            style={{
              transform: [{ translateY: slideY }],
              backgroundColor: '#232425',
              paddingBottom: 20,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingTop: 10,
            }}
          >
            <SheetHandle />

            {sheetCtx.type === 'post' && (
              <>
                <SheetItem
                  onPress={() => {
                    setMenuVisible(false);
                    setReportTarget('post');
                    setReportText('');
                    setReportOpen(true);
                  }}
                >
                  <SheetIcon>
                    <Icon type="alert" size={24} color={theme.colors.secondary.red} />
                  </SheetIcon>
                  <SheetLabel $danger>Report This Post</SheetLabel>
                </SheetItem>

                <SheetItem
                  onPress={() => {
                    setMenuVisible(false);
                    setReportTarget('user');
                    setReportText('');
                    setReportOpen(true);
                  }}
                >
                  <SheetIcon>
                    <Icon type="person" size={24} color={theme.colors.secondary.red} />
                  </SheetIcon>
                  <SheetLabel $danger>Report This User</SheetLabel>
                </SheetItem>

                <SheetItem onPress={blockPostFromSheet}>
                  <SheetIcon>
                    <Icon type="close" size={24} color={theme.colors.secondary.red} />
                  </SheetIcon>
                  <SheetLabel $danger>Block This Post</SheetLabel>
                </SheetItem>
              </>
            )}

            {sheetCtx.type === 'comment' && (
              <>
                <SheetItem
                  onPress={() => {
                    setMenuVisible(false);
                    setReportTarget('comment');
                    setReportCommentId(sheetCtx.commentId!);
                    setReportText('');
                    setReportOpen(true);
                  }}
                >
                  <SheetIcon>
                    <Icon type="alert" size={24} color={theme.colors.secondary.red} />
                  </SheetIcon>
                  <SheetLabel $danger>Report This Comment</SheetLabel>
                </SheetItem>

                <SheetItem onPress={blockCommentFromSheet}>
                  <SheetIcon>
                    <Icon type="person" size={24} color={theme.colors.secondary.red} />
                  </SheetIcon>
                  <SheetLabel $danger>Block This User</SheetLabel>
                </SheetItem>
              </>
            )}

            <SheetItem onPress={() => setMenuVisible(false)}>
              <SheetIcon>
                <Icon type="close" size={24} color={theme.colors.gray.lightGray_1} />
              </SheetIcon>
              <SheetLabel>Cancel</SheetLabel>
            </SheetItem>
          </Animated.View>
        </View>
      </Modal>

      <Modal
        visible={reportOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        presentationStyle="overFullScreen"
        onRequestClose={() => setReportOpen(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Pressable
            onPress={() => setReportOpen(false)}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <Dialog>
            <DialogHeader>
              <DialogTitle>
                <Icon type="alert" size={24} color={theme.colors.secondary.red} />
                <DialogTitleText $danger> {reportTitle}</DialogTitleText>
              </DialogTitle>
              <CloseBtn onPress={() => setReportOpen(false)}>
                <Icon type="close" size={16} color="#cfd4da" />
              </CloseBtn>
            </DialogHeader>

            <DialogTextarea
              value={reportText}
              onChangeText={setReportText}
              placeholder={
                reportTarget === 'user'
                  ? 'Tell us what’s wrong with this user’s content…'
                  : reportTarget === 'comment'
                    ? 'Tell us what’s wrong with this comment…'
                    : 'Tell us what’s wrong with this post…'
              }
              blurOnSubmit
              returnKeyType="done"
              placeholderTextColor="#858b90"
              multiline
              textAlignVertical="top"
              editable={!reportLoading}
            />

            <SubmitBtn onPress={onSubmitReport} disabled={reportLoading || !reportText.trim()}>
              <SubmitText>{reportLoading ? 'Submitting…' : 'Submit'}</SubmitText>
            </SubmitBtn>
          </Dialog>
        </View>
      </Modal>

      <Modal
        visible={editVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setEditVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.55)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 24,
          }}
        >
          <Pressable
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
            onPress={() => setEditVisible(false)}
          />
          <EditBox>
            <EditHeader>
              <EditTitle>
                <Icon type="edit" size={24} color={theme.colors.primary.white} />
                <EditTitleText> Edit My Comments</EditTitleText>
              </EditTitle>
              <CloseBtn onPress={() => setEditVisible(false)}>
                <Icon type="close" size={24} color={theme.colors.primary.white} />
              </CloseBtn>
            </EditHeader>

            <EditInput
              ref={editInputRef}
              value={editText}
              onChangeText={setEditText}
              placeholder=""
              placeholderTextColor="#858b90"
              multiline
              textAlignVertical="top"
            />

            <SaveBtn onPress={onSaveEdit}>
              <SaveText>Save Edit</SaveText>
            </SaveBtn>
          </EditBox>
        </View>
      </Modal>
      <ProfileModal
        visible={isProfileVisible}
        userData={selectedUser.data}
        onClose={() => setIsProfileVisible(false)}
      />
    </Safe>
  );
}

const Safe = styled.SafeAreaView`
  flex: 1;
  background: #1d1e1f;
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
const HeaderTitle = styled.Text`
  color: #fff;
  font-size: 18px;
  font-family: 'PlusJakartaSans_500Bold';
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

const Avatar = styled(ProfileImage)`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background: #2a2b2c;
`;

const SortWrap = styled.View`
  background: #171818;
  margin-bottom: 24px;
`;

const SheetHandle = styled.View`
  align-self: center;
  width: 44px;
  height: 4px;
  border-radius: 2px;
  background: #44484d;
  margin-bottom: 8px;
`;
const SheetItem = styled.Pressable`
  flex-direction: row;
  align-items: center;
  padding: 14px 20px;
`;
const SheetIcon = styled.View`
  width: 28px;
  align-items: center;
  margin-right: 8px;
`;
const SheetLabel = styled.Text<{ $danger?: boolean }>`
  color: ${({ $danger }) => ($danger ? '#ff4d4f' : '#e6e9ed')};
  font-size: 16px;
`;
const SheetDivider = styled.View`
  height: 1px;
  background: #2c2f33;
  margin: 4px 0;
`;

const Dialog = styled.View`
  width: 100%;
  max-width: 360px;
  background: #2a2b2c;
  border-radius: 12px;
  padding: 12px 12px 16px 12px;
`;
const DialogHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const DialogTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;
const DialogTitleText = styled.Text<{ $danger?: boolean }>`
  color: ${({ $danger }) => ($danger ? '#ff4d4f' : '#e7eaed')};
  font-size: 14px;
  font-weight: 700;
`;
const CloseBtn = styled.Pressable`
  padding: 4px;
`;
const DialogTextarea = styled.TextInput`
  min-height: 220px;
  border-radius: 8px;
  padding: 12px;
  background: #1f2021;
  color: #e7eaed;
  font-size: 14px;
  border-width: 1px;
  border-color: #3a3d40;
`;
const SubmitBtn = styled.Pressable<{ disabled?: boolean }>`
  background: #ff4d4f;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
const SubmitText = styled.Text`
  color: #ffffff;
  font-weight: 700;
`;
const EditBox = styled.View`
  width: 100%;
  max-width: 360px;
  background: #2a2b2c;
  border-radius: 12px;
  padding: 12px 12px 16px 12px;
`;
const EditHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;
const EditTitle = styled.View`
  flex-direction: row;
  align-items: center;
`;
const EditTitleText = styled.Text`
  color: #cfd4da;
  font-size: 14px;
  font-weight: 700;
`;
const SaveBtn = styled.Pressable`
  background: #30f59b;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
`;
const SaveText = styled.Text`
  color: #000;
  font-weight: 700;
`;
