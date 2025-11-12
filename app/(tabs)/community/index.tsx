import api from '@/api/axiosInstance';
import { addBookmark, removeBookmark } from '@/api/community/bookmarks';
import CategoryChips, { Category } from '@/components/CategoryChips';
import Icon from '@/components/common/Icon';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import PostCard from '@/components/PostCard';
import SortTabs from '@/components/SortTabs';
import WriteFab from '@/components/WriteFab';
import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import { useToggleLike } from '@/src/features/community/hooks/useToggleLike';
import { PostEx, PostsListItem, PostsListResp } from '@/src/features/community/types/postsListType';
import { isMeaningfulName, pickNonEmpty, toDateLabel } from '@/src/features/community/utils/indexUtils';
import { usePostUI } from '@/src/store/usePostUI';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, ListRenderItem, type FlatListProps } from 'react-native';
import styled from 'styled-components/native';

const ICON = require('@/assets/images/IsolationMode.png');
const VisitorImage = require('@/assets/images/character_05.svg');
const AnonymityImage = require('@/assets/images/character_04.svg');

const MAX_IMAGES = 5;

const mapItem = (post: PostsListItem, respTimestamp?: string): PostEx => {
  const isAnon = Boolean(post.isAnonymous);

  const createdRaw = post.createdAt ?? post.createdTime;
  const liked = post?.likedByMe ?? post?.isLike ?? post?.isLiked ?? false;

  const imageKeys: string[] =
    post.contentImageUrls ??
    post.imageUrls ??
    (post.contentImageUrl ? [post.contentImageUrl] : post.imageUrl ? [post.imageUrl] : []);

  const pickedRaw = pickNonEmpty(post.authorName, post.userName, post.nickname, post.memberName, post.writerName);
  const display = isMeaningfulName(pickedRaw) ? pickedRaw : isAnon ? 'Anonymous' : '—';
  const safeUserImageUrl = !isAnon && post.userImageUrl ? post.userImageUrl : undefined;

  const niceCategory =
    post.boardCategory && typeof post.boardCategory === 'string'
      ? ((post.boardCategory[0] + post.boardCategory.slice(1).toLowerCase()) as Category)
      : ('Free talk' as Category);

  return {
    id: String(post.postId),
    postId: post.postId,
    author: display,
    authorName: display,
    isAnonymous: isAnon,
    category: niceCategory,
    createdAt: toDateLabel(createdRaw, respTimestamp),
    body: post.contentPreview ?? post.content ?? '',
    likes: Number(post.likeCount ?? 0),
    comments: Number(post.commentCount ?? 0),
    images: (imageKeys || []).filter(Boolean).slice(0, MAX_IMAGES),
    hotScore: typeof post.score === 'number' ? post.score : 0,
    likedByMe: Boolean(liked),
    viewCount: Number(post.viewCount ?? 0),
    ...(safeUserImageUrl ? { userImageUrl: safeUserImageUrl } : {}),
  };
};

export default function CommunityScreen() {
  const [cat, setCat] = useState<Category>('All');
  const [sort, setSort] = useState<'new' | 'hot'>('new');
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [items, setItems] = useState<PostEx[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [writeLoading, setWriteLoading] = useState(false);
  const sortServer = sort === 'new' ? 'LATEST' : 'POPULAR';
  const boardId = Number(CATEGORY_TO_BOARD_ID[cat]);

  const likeMutation = useToggleLike();

  const {
    bookmarked,
    toggleBookmarked,
    setBookmarked,
    liked,
    likeCount,
    setLiked,
    toggleLiked,
    setLikeCount,
    bumpLike,
    hydrateLikeFromServer,
  } = usePostUI();

  const hasAnyBookmark = Object.values(bookmarked).some(Boolean);

  useEffect(() => {
    refresh();
  }, [boardId, sort]);

  const fetchPage = async (after?: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const params = { sort: sortServer, size: 20, ...(after ? { cursor: after } : {}) };
      const { data } = await api.get<PostsListResp>(`/api/v1/boards/${boardId}/posts`, { params });
      const respTimestamp = data?.timestamp;
      const list = (data?.data?.items ?? []).map((item) => mapItem(item, respTimestamp));

      setItems((prev) => {
        if (!after) {
          return list.map((p) => ({
            ...p,
            bookmarked: bookmarked[p.postId] ?? p.bookmarked ?? false,
            likedByMe: liked[p.postId] ?? p.likedByMe ?? false,
            likes: likeCount[p.postId] ?? p.likes ?? 0,
          }));
        } else {
          const seen = new Set(prev.map((p) => p.postId));
          const appended = list.filter((p) => !seen.has(p.postId));
          const merged = [...prev, ...appended];

          return merged.map((p) => ({
            ...p,
            bookmarked: bookmarked[p.postId] ?? p.bookmarked ?? false,
          }));
        }
      });

      setHasNext(Boolean(data?.data?.hasNext));
      setCursor(data?.data?.nextCursor ?? undefined);
    } catch (e) {
      console.error('[community:list] error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    setItems([]);
    setCursor(undefined);
    setHasNext(true);
    fetchPage(undefined);
  };

  const onEndCalledRef = useRef(false);

  const loadMore = () => {
    if (loading || onEndCalledRef.current || !hasNext || !cursor) return;
    onEndCalledRef.current = true;
    fetchPage(cursor).finally(() => {});
  };

  const handleToggleLike = async (postId: number) => {
    const target = items.find((p) => p.postId === postId);
    const prevLiked = Boolean(target?.likedByMe);
    const prevCount = likeCount[postId] ?? target?.likes ?? 0;
    const nextLiked = !prevLiked;
    const delta = prevLiked ? -1 : +1;
    const nextCount = Math.max(0, prevCount + delta);

    toggleLiked(postId);
    setLikeCount(postId, nextCount);

    setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, likedByMe: nextLiked, likes: nextCount } : p)));

    try {
      await likeMutation.mutateAsync({ postId, liked: prevLiked });
    } catch (e: any) {
      const status = e.response?.status;

      if (status === 428) {
        setLiked(postId, prevLiked);
        setLikeCount(postId, prevCount);
        setItems((prev) =>
          prev.map((p) => (p.postId === postId ? { ...p, likedByMe: prevLiked, likes: prevCount } : p)),
        );
        setProfileModalVisible(true);
        return;
      }
      setLiked(postId, prevLiked);
      setLikeCount(postId, prevCount);
      setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, likedByMe: prevLiked, likes: prevCount } : p)));
      console.error('[like:list] error', e);
      setLiked(postId, prevLiked);
      setLikeCount(postId, prevCount);
      setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, likedByMe: prevLiked, likes: prevCount } : p)));
      console.error('[like:list] error', e);
    }
  };

  const bmBusyRef = useRef<Record<number, boolean>>({});

  const handleWritePress = async () => {
    if (writeLoading) return;
    try {
      const response = await api.get(`/api/v1/member/is-completed`);
      const isProfileCompleted = response.data?.profileCompleted;
      if (isProfileCompleted === false) {
        setProfileModalVisible(true); // alert를 modal로 수정
        return;
      } else {
        router.push('/community/write');
      }
    } catch (e: any) {
      console.error('[write:check] error', e);
      Alert.alert('Error', 'Failed to check profile status. Please try again.');
    } finally {
      setWriteLoading(false);
    }
  };
  const handleToggleBookmark = async (postId: number) => {
    if (bmBusyRef.current[postId]) return;
    bmBusyRef.current[postId] = true;

    const before = items.find((p) => p.postId === postId)?.bookmarked ?? false;
    const next = !before;

    toggleBookmarked(postId);
    setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, bookmarked: next } : p)));

    try {
      if (next) {
        await addBookmark(postId);
      } else {
        await removeBookmark(postId);
      }
    } catch (e) {
      setBookmarked(postId, before);
      setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, bookmarked: before } : p)));
      console.error('[bookmark:list] error', e);
    } finally {
      bmBusyRef.current[postId] = false;
    }
  };

  const onPostPressHandler = (postId: number) => {
    router.push({ pathname: `(tabs)/community/${String(postId)}` });
  };
  const renderPost: ListRenderItem<PostEx> = ({ item }) => (
    <PostCard
      data={{ ...item, category: cat === 'All' ? item.category : cat }}
      onPress={() => onPostPressHandler(item.postId)}
      onToggleLike={() => handleToggleLike(item.postId)}
      onToggleBookmark={() => handleToggleBookmark(item.postId)}
    />
  );

  return (
    <Safe>
      <Header>
        <Left>
          <Title>Community</Title>
          <IconImage source={ICON} />
        </Left>

        <Right>
          <IconBtn
            onPress={() => {
              const qs = `?boardId=${encodeURIComponent(String(boardId))}&cat=${encodeURIComponent(cat)}`;
              router.push(`/community/SearchScreen${qs}`);
            }}
          >
            <Icon type="search" size={24} color={theme.colors.gray.lightGray_1} />
          </IconBtn>

          <IconBtn
            onPress={() => {
              router.push('/community/bookmarks');
            }}
          >
            <Icon type="bookmarkSelected" size={24} color={theme.colors.gray.lightGray_1} />
          </IconBtn>

          <IconBtn onPress={() => router.push('/community/my-history')}>
            <Icon type="person" size={24} color={theme.colors.gray.lightGray_1} />
          </IconBtn>
        </Right>
      </Header>

      <ChipsWrap>
        <CategoryChips value={cat} onChange={setCat} />
      </ChipsWrap>

      <SortWrap>
        <SortTabs value={sort} onChange={setSort} />
      </SortWrap>

      <List
        data={items}
        keyExtractor={(it: PostEx) => String(it.postId)}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        onMomentumScrollBegin={() => {
          onEndCalledRef.current = false;
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={
          loading ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <WriteFab onPress={handleWritePress} />
      <ProfileSetupModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />
    </Safe>
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
const Title = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-family: 'InstrumentSerif_400Regular';
  letter-spacing: -0.2px;
`;
const IconImage = styled.Image`
  margin-left: 4px;
  width: 20px;
  height: 20px;
  resize-mode: contain;
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
  margin-bottom: 10px;
`;
const List = styled(FlatList as React.ComponentType<FlatListProps<PostEx>>)``;
const FooterLoading = styled.View`
  padding: 16px 0;
`;
