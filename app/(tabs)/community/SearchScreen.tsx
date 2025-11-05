import api from '@/api/axiosInstance';
import { addBookmark, removeBookmark } from '@/api/community/bookmarks';
import CategoryChips, { Category } from '@/components/CategoryChips';
import Icon from '@/components/common/Icon';
import PostCard, { Post } from '@/components/PostCard';
import SortTabs, { SortKey } from '@/components/SortTabs';
import WriteFab from '@/components/WriteFab';
import { useToggleLike } from '@/hooks/mutations/useToggleLike';
import useMyProfile from '@/hooks/queries/useMyProfile';
import { useSearchPosts, type PostExFromSearch } from '@/hooks/queries/useSearchPosts';
import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import { usePostUI } from '@/src/store/usePostUI';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  TextInput as RNTextInput,
  ViewToken,
  type FlatListProps,
} from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams } from 'expo-router';
import { formatCreatedYMD } from '@/src/utils/dateUtils';
const ICON = require('@/assets/images/IsolationMode.png');
const AV = require('@/assets/images/character1.png');

const MAX_IMAGES = 5;

type PostsListItem = {
  postId: number;
  title?: string;
  contentPreview?: string;
  content?: string;
  authorName?: string;
  createdAt?: string | number;
  createdTime?: string | number;
  likeCount?: number;
  commentCount?: number;
  viewCount?: number;
  score?: number;
  likedByMe?: boolean;
  isLike?: boolean;
  isLiked?: boolean;

  contentImageUrls?: string[];
  imageUrls?: string[];
  contentImageUrl?: string;
  imageUrl?: string;

  userImageUrl?: string;
};

type PostsListResp = {
  success: boolean;
  data: {
    items: PostsListItem[];
    hasNext: boolean;
    nextCursor?: string;
  };
  timestamp?: string;
};
function toDateLabel(raw?: unknown, fallbackIso?: string): string {
  return formatCreatedYMD(raw, fallbackIso);
}

type PostEx = Post & {
  postId: number;
  hotScore?: number;
  minutesAgo?: number;
  bookmarked?: boolean;
  likedByMe?: boolean;
  userImageUrl?: string;
};

function resolveAuthor(row: any): string {
  const isAnon = row?.isAnonymous ?? row?.anonymous ?? false;
  const cands = [
    row?.authorName,
    row?.memberName,
    row?.nickname,
    row?.userName,
    row?.writerName,
    row?.displayName,
    row?.name,
  ]
    .map((v) => (v == null ? undefined : String(v).trim()))
    .filter(Boolean) as string[];
  return (isAnon ? cands[0] || '익명' : cands[0]) || '익명';
}

const mapItem = (row: PostsListItem, respTimestamp?: string): PostEx => {
  const createdRaw = row.createdAt ?? row.createdTime;
  const liked = (row as any).likedByMe ?? (row as any).isLike ?? (row as any).isLiked ?? false;

  const imageKeys: string[] =
    row.contentImageUrls ??
    row.imageUrls ??
    (row.contentImageUrl ? [row.contentImageUrl] : row.imageUrl ? [row.imageUrl] : []);

  return {
    id: String(row.postId),
    postId: row.postId,
    author: resolveAuthor(row),
    avatar: row.userImageUrl ? { uri: row.userImageUrl } : AV,
    category: 'Free talk',
    createdAt: toDateLabel(createdRaw, respTimestamp),
    body: row.contentPreview ?? row.content ?? '',
    likes: Number(row.likeCount ?? 0),
    comments: Number(row.commentCount ?? 0),
    images: imageKeys.slice(0, MAX_IMAGES),
    hotScore: typeof row.score === 'number' ? row.score : 0,
    likedByMe: Boolean(liked),
    ...(row.userImageUrl ? { userImageUrl: row.userImageUrl } : {}),
  };
};

export default function CommunityScreen() {
  const [cat, setCat] = useState<Category>('All');
  const [sort, setSort] = useState<SortKey>('new');
  const isFirstRender = useRef(true);
  const callCountRef = useRef(0);
  const isFirstMount = useRef(true);
  const [items, setItems] = useState<PostEx[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [imagesById, setImagesById] = useState<Record<number, string[]>>({});
  const fetchedRef = useRef<Set<number>>(new Set());
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const params = useLocalSearchParams();

  const sortParam = sort === 'new' ? 'LATEST' : 'POPULAR';
  const boardId = CATEGORY_TO_BOARD_ID[cat];

  const likeMutation = useToggleLike();
  const { data: me } = useMyProfile();
  const { bookmarked, toggleBookmarked, setBookmarked, liked, setLiked, toggleLiked, likeCount, setLikeCount } =
    usePostUI();

  const myId = useMemo(() => {
    const raw = (me as any)?.memberId ?? (me as any)?.id ?? (me as any)?.userId;
    const n = typeof raw === 'number' ? raw : Number(raw);
    return Number.isFinite(n) ? n : undefined;
  }, [me]);

  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const inputRef = useRef<RNTextInput>(null);
  const effectiveQ = useMemo(() => q.trim(), [q]);
  const canQuery = effectiveQ.length >= 2;

  const { data: remoteHits = [], isFetching: searching } = useSearchPosts(effectiveQ, boardId);

  const localMatches = useMemo(() => {
    if (!canQuery) return [];
    const kw = effectiveQ.toLowerCase();
    return items.filter((p) => {
      const hay = `${p.author ?? ''} ${p.body ?? ''} ${(p as any).category ?? ''}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [items, canQuery, effectiveQ]);

  const resultsOnly: PostEx[] = useMemo(() => {
    if (!canQuery) return [];
    const normalize = (x: PostEx | PostExFromSearch): PostEx => ({
      ...x,
      postId: Number(x.postId),
      id: String(x.postId),
    });

    const seen = new Set<number>();
    const out: PostEx[] = [];

    const pushUnique = (arr: (PostEx | PostExFromSearch)[]) => {
      for (const raw of arr) {
        const p = normalize(raw as any);
        if (!seen.has(p.postId)) {
          seen.add(p.postId);
          out.push(p);
        }
      }
    };

    pushUnique(remoteHits as any);
    pushUnique(localMatches as any);
    return out;
  }, [canQuery, remoteHits, localMatches]);

  const [visible, setVisible] = useState<PostEx[]>([]);
  useEffect(() => {
    setVisible(
      items.map((it) => ({
        ...it,
        images: imagesById[it.postId] ? imagesById[it.postId] : it.images,
        bookmarked: bookmarked[it.postId] ?? it.bookmarked ?? false,
        likedByMe: liked[it.postId] ?? it.likedByMe ?? false,
        likes: likeCount[it.postId] ?? it.likes ?? 0,
      })),
    );
  }, [items, imagesById, bookmarked, liked, likeCount]);

  const composed: PostEx[] = useMemo(() => {
    if (!canQuery) return visible;

    const normalize = (x: PostEx | PostExFromSearch): PostEx => ({
      ...x,
      postId: Number(x.postId),
      id: String(x.postId),
    });

    const primary = [...remoteHits.map(normalize), ...localMatches.map(normalize)];

    const seen = new Set<number>();
    const out: PostEx[] = [];
    const pushUnique = (arr: PostEx[]) => {
      for (const p of arr) {
        if (!seen.has(p.postId)) {
          seen.add(p.postId);
          out.push(p);
        }
      }
    };

    pushUnique(primary);
    pushUnique(visible);
    return out;
  }, [canQuery, remoteHits, localMatches, visible]);

  const handleWritePress = async () => {
    if (checkingProfile) return;
    if (!myId) {
      Alert.alert('Error', 'Could not verify user profile. Please try again.');
      return;
    }

    setCheckingProfile(true);
    try {
      const { data } = await api.get<{ userId: number; profileCompleted: boolean }>(`/api/v1/member/is-completed`);

      if (data?.profileCompleted) {
        router.push('/community/write');
      } else {
        Alert.alert('Profile Setup Required', 'Please complete your profile setup to write a post.', [
          { text: 'Go to Setup', onPress: () => router.push('/(tabs)/mypage/edit' as any) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    } catch (error: any) {
      console.error('프로필 확인 실패:', error);
      Alert.alert('Error', error?.response?.data?.message ?? 'Failed to check profile.');
    } finally {
      setCheckingProfile(false);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    setCursor(undefined);
    setHasNext(true);
    fetchPage(undefined);
  };

  const openSearch = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  useEffect(() => {
    setSearchOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    callCountRef.current++;
    refresh();
  }, [boardId, sortParam]);

  const fetchPage = async (after?: string) => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<PostsListResp>(`/api/v1/boards/${boardId}/posts`, {
        params: { sort: sortParam, size: 20, ...(after ? { cursor: after } : null) },
      });

      const respTimestamp = data?.timestamp;
      const list = (data?.data?.items ?? []).map((item) => mapItem(item, respTimestamp));
      setItems((prev) => (after ? [...prev, ...list] : list));
      setHasNext(Boolean(data?.data?.hasNext));
      setCursor(data?.data?.nextCursor);
      setImagesById({});
      fetchedRef.current.clear();
    } catch (e) {
      console.error('[fetchPage] 에러:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!hasNext || !cursor || loading) return;
    fetchPage(cursor);
  };

  const handlePostPress = async (postId: number) => {
    if (checkingProfile) return;
    if (!myId) {
      Alert.alert('Error', 'Could not verify user profile. Please try again.');
      return;
    }

    setCheckingProfile(true);
    try {
      const { data } = await api.get<{ userId: number; profileCompleted: boolean }>(`/api/v1/member/is-completed`);

      if (data?.profileCompleted) {
        router.push({ pathname: '/community/[id]', params: { id: String(postId) } });
      } else {
        Alert.alert('Profile Setup Required', 'Please complete your profile setup to view posts.', [
          { text: 'Go to Setup', onPress: () => router.push('/(tabs)/mypage/edit' as any) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }
    } catch (error: any) {
      console.error('프로필 확인 실패:', error);
      Alert.alert('Error', error?.response?.data?.message ?? 'Failed to check profile.');
    } finally {
      setCheckingProfile(false);
    }
  };

  const hydrateImages = useCallback(async (postId: number) => {
    if (fetchedRef.current.has(postId)) return;
    fetchedRef.current.add(postId);
    try {
      const { data } = await api.get(`/api/v1/posts/${postId}`);
      const rawKeys: string[] =
        (data?.contentImageUrls as string[] | undefined) ??
        (data?.imageUrls as string[] | undefined) ??
        (data?.contentImageUrl ? [String(data.contentImageUrl)] : data?.imageUrl ? [String(data.imageUrl)] : []);
      if (rawKeys && rawKeys.length > 0) {
        setImagesById((prev) => ({ ...prev, [postId]: rawKeys.slice(0, MAX_IMAGES) }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    isFirstMount.current = false;
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (isFirstMount.current || searchOpen || canQuery) return;

      for (const v of viewableItems) {
        const it = v.item as PostEx | undefined;
        if (!it) continue;
        const hasEnough = Array.isArray(it.images) && it.images.length >= 2;
        if (!hasEnough) hydrateImages(it.postId);
      }
    },
    [searchOpen, canQuery, hydrateImages],
  );

  const viewConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const handleToggleLike = async (postId: number) => {
    const target = items.find((p) => p.postId === postId);
    const prevLiked = Boolean(liked[postId] ?? target?.likedByMe);
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
      setLiked(postId, prevLiked);
      setLikeCount(postId, prevCount);
      setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, likedByMe: prevLiked, likes: prevCount } : p)));

      const status = e?.response?.status;
      if (status === 428) {
        setProfileModalVisible(true);
        return;
      }
      console.error('[like:list] error', e);
    }
  };

  const bmBusyRef = useRef<Record<number, boolean>>({});
  const handleToggleBookmark = async (postId: number) => {
    if (bmBusyRef.current[postId]) return;
    bmBusyRef.current[postId] = true;

    const target = items.find((p) => p.postId === postId);
    const before = Boolean(bookmarked[postId] ?? target?.bookmarked);
    const next = !before;

    toggleBookmarked(postId);
    setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, bookmarked: next } : p)));

    try {
      if (next) {
        await addBookmark(postId);
      } else {
        await removeBookmark(postId);
      }
    } catch (e: any) {
      setBookmarked(postId, before);
      setItems((prev) => prev.map((p) => (p.postId === postId ? { ...p, bookmarked: before } : p)));

      const status = e?.response?.status;
      if (status === 428) {
        setProfileModalVisible(true);
      } else {
        console.error('[bookmark:list] error', e);
      }
    } finally {
      bmBusyRef.current[postId] = false;
    }
  };

  const renderPost: ListRenderItem<PostEx> = ({ item }) => (
    <PostCard
      data={{
        ...item,
        category: cat === 'All' ? item.category : cat,
        bookmarked: bookmarked[item.postId] ?? item.bookmarked,
        likedByMe: liked[item.postId] ?? item.likedByMe,
        likes: likeCount[item.postId] ?? item.likes,
      }}
      onPress={() => handlePostPress(item.postId)}
      onToggleLike={() => handleToggleLike(item.postId)}
      onToggleBookmark={() => handleToggleBookmark(item.postId)}
    />
  );

  return (
    <Safe>
      <Header>
        <Left style={{ flex: 1 }}>
          {!searchOpen ? (
            <>
              <Title>Community</Title>
              <IconImage source={ICON} />
            </>
          ) : (
            <SearchBox>
              <CustomIcon>
                {searching ? <ActivityIndicator size="small" /> : <Icon type="search" size={16} color="#9aa0a6" />}
              </CustomIcon>
              <RNTextInput
                ref={inputRef}
                value={q}
                onChangeText={setQ}
                placeholder="Search Anything"
                placeholderTextColor="#9aa0a6"
                returnKeyType="search"
                onSubmitEditing={() => {}}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ flex: 1, color: '#e6e9ec', padding: 0 }}
              />
              {!!q && (
                <ClearBtn onPress={() => setQ('')}>
                  <AntDesign name="close" size={14} color="#cfd4da" />
                </ClearBtn>
              )}
              <CancelBtn onPress={closeSearch}>
                <CancelText>Cancel</CancelText>
              </CancelBtn>
            </SearchBox>
          )}
        </Left>

        {!searchOpen && (
          <Right>
            <IconBtn onPress={openSearch}>
              <AntDesign name="search1" size={18} color="#cfd4da" />
            </IconBtn>
            <IconBtn onPress={() => router.push('/community/bookmarks')}>
              <MaterialIcons name="bookmark-border" size={20} color="#cfd4da" />
            </IconBtn>
            <IconBtn onPress={() => router.push('/community/my-history')}>
              <AntDesign name="user" size={18} color="#cfd4da" />
            </IconBtn>
          </Right>
        )}
      </Header>

      <ChipsWrap>
        <CategoryChips value={cat} onChange={setCat} />
      </ChipsWrap>

      <SortWrap>
        <SortTabs value={sort} onChange={setSort} />
      </SortWrap>

      <List
        data={canQuery ? resultsOnly : visible}
        keyExtractor={(it: PostEx) => String(it.postId)}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={loadMore}
        refreshing={refreshing}
        onRefresh={refresh}
        ListFooterComponent={
          loading && !refreshing ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
        ListEmptyComponent={
          canQuery && !searching ? (
            <EmptyWrap>
              <EmptyTitle>Ooops..</EmptyTitle>
              <EmptySub>There is no Search Results.</EmptySub>
            </EmptyWrap>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      <WriteFab onPress={handleWritePress} disabled={checkingProfile} />
      {/* [수정] checking -> checkingProfile */}
      <ProfileSetupModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} />
    </Safe>
  );
}

// ... (styled-components 코드는 변경 없음) ...
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
`;
const Title = styled.Text`
  color: #ffffff;
  font-size: 32px;
  font-family: 'InstrumentSerif_400Regular';
  letter-spacing: -0.2px;
`;
const IconImage = styled.Image.attrs({ resizeMode: 'contain' })`
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
  margin-bottom: 14px;
`;
const List = styled(FlatList as React.ComponentType<FlatListProps<PostEx>>)``;
const FooterLoading = styled.View`
  padding: 16px 0;
`;

const SearchBox = styled.View`
  flex: 1;
  height: 40px;
  background: #2a2b2c;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  padding: 0 6px 0 12px;
  margin-right: 8px;
`;
const CustomIcon = styled.View`
  width: 20px;
  align-items: center;
  margin-right: 8px;
`;
const ClearBtn = styled.Pressable`
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
`;
const CancelBtn = styled.Pressable`
  padding: 6px 8px;
`;
const CancelText = styled.Text`
  color: #cfd4da;
`;
const EmptyWrap = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

const EmptyTitle = styled.Text`
  color: #ffffff;
  font-size: 40px;
  font-family: 'InstrumentSerif_400Regular';
  line-height: 44px;
  margin-bottom: 8px;
`;

const EmptySub = styled.Text`
  color: #9aa0a6;
  font-size: 14px;
`;
