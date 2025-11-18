import Icon from '@/components/common/Icon';
import SortTabs from '@/components/SortTabs';
import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import CategoryChips from '@/src/features/community/components/CategoryChips';
import PostListCard from '@/src/features/community/components/PostListCard';
import { useGetPosts } from '@/src/features/community/hooks/useGetPosts';
import { useToggleBookmark } from '@/src/features/community/hooks/useToggleBookmark';
import { useToggleLike } from '@/src/features/community/hooks/useToggleLike';
import { AllowedCategory, PostsListItem, SortParam } from '@/src/features/community/types/postsListType';
import { theme } from '@/src/styles/theme';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, View } from 'react-native';
import styled from 'styled-components/native';

const ICON = require('@/assets/images/IsolationMode.png');
const VisitorImage = require('@/assets/images/character_05.svg');
const AnonymityImage = require('@/assets/images/character_04.svg');

const MAX_IMAGES = 5;

export default function CommunityScreen() {
  // const {
  //   bookmarked,
  //   toggleBookmarked,
  //   setBookmarked,
  //   liked,
  //   likeCount,
  //   setLiked,
  //   toggleLiked,
  //   setLikeCount,
  //   bumpLike,
  //   hydrateLikeFromServer,
  // } = usePostUI();

  // useEffect(() => {
  //   refresh();
  // }, [boardId, sort]);

  // const handleWritePress = async () => {
  //   if (writeLoading) return;
  //   try {
  //     const response = await api.get(`/api/v1/member/is-completed`);
  //     const isProfileCompleted = response.data?.profileCompleted;
  //     if (isProfileCompleted === false) {
  //       setProfileModalVisible(true); // alert를 modal로 수정
  //       return;
  //     } else {
  //       router.push('/community/write');
  //     }
  //   } catch (e: any) {
  //     console.error('[write:check] error', e);
  //     Alert.alert('Error', 'Failed to check profile status. Please try again.');
  //   } finally {
  //     setWriteLoading(false);
  //   }
  // };

  const [sort, setSort] = useState<SortParam>('LATEST');
  const [category, setCategory] = useState<AllowedCategory>('ALL');

  const { data, posts, isLoading, isFetchingNextPage, isError, hasNextPage, refetch, isRefetching, fetchNextPage } =
    useGetPosts(CATEGORY_TO_BOARD_ID[category], sort);
  const likeMutation = useToggleLike(CATEGORY_TO_BOARD_ID[category], sort);
  const bookmarkMutation = useToggleBookmark(CATEGORY_TO_BOARD_ID[category], sort);
  const scrollRef = useRef<FlatList>(null);

  const handlePostPress = (postId: number) => {
    router.push({ pathname: '/(tabs)/community/[id]', params: { id: postId } });
  };

  const handleToggleLike = (postId: number, isLike: boolean) => {
    likeMutation.mutate({ postId: postId, liked: isLike });
  };

  const handleToggleBookmark = (postId: number, isBookmark: boolean) => {
    bookmarkMutation.mutate({ postId: postId, isBookmarked: isBookmark });
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const renderPost: ListRenderItem<PostsListItem> = ({ item }) => (
    <PostListCard
      data={item}
      onPress={() => handlePostPress(item.postId)}
      onToggleLike={() => handleToggleLike(item.postId, item.isLiked)}
      onToggleBookmark={() => handleToggleBookmark(item.postId, item.isBookmarked)}
    />
  );

  // 임시설정
  if (isError) {
    return <View>데이터를 불러올 수 없습니다.</View>;
  }

  return (
    <Safe>
      <Header>
        <Left>
          <Title onPress={scrollToTop}>Community</Title>
          <IconImage source={ICON} />
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
              router.push('/community/bookmarks');
            }}
          >
            <Icon type="bookmarkNonSelected" size={24} color={theme.colors.gray.lightGray_1} />
          </IconBtn>

          <IconBtn onPress={() => router.push('/community/my-history')}>
            <Icon type="person" size={24} color={theme.colors.gray.lightGray_1} />
          </IconBtn>
        </Right>
      </Header>

      <ChipsWrap>
        <CategoryChips value={category} onChange={setCategory} />
      </ChipsWrap>

      <SortWrap>
        <SortTabs value={sort} onChange={setSort} />
      </SortWrap>

      <FlatList
        data={posts}
        ref={scrollRef}
        keyExtractor={(item: PostsListItem) => String(item.postId)}
        renderItem={renderPost}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListFooterComponent={
          isLoading || isFetchingNextPage ? (
            <FooterLoading>
              <ActivityIndicator />
            </FooterLoading>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* <WriteFab onPress={handleWritePress} />
      <ProfileSetupModal visible={profileModalVisible} onClose={() => setProfileModalVisible(false)} /> */}
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
const FooterLoading = styled.View`
  padding: 16px 0;
`;
