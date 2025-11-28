import Icon from '@/components/common/Icon';
import ProfileSetupModal from '@/components/common/ProfileSetupModal';
import SortTabs from '@/components/SortTabs';
import WriteFab from '@/components/WriteFab';
import { CATEGORY_TO_BOARD_ID } from '@/lib/community/constants';
import CategoryChips from '@/src/features/community/components/CategoryChips';
import PostList from '@/src/features/community/components/PostList';
import useGetVisitor from '@/src/features/community/hooks/useGetVisitor';
import useScrollToTop from '@/src/features/community/hooks/useScrollToTop';
import { AllowedCategory, SortParam } from '@/src/features/community/types';
import { theme } from '@/src/styles/theme';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

const ICON = require('@/assets/images/IsolationMode.png');

export default function CommunityScreen() {
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const { data, isLoading, isError, refetch } = useGetVisitor();

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
    router.push('/community/write');
  };

  return (
    <Safe>
      <Header>
        <Left>
          <Title onPress={() => scrollToTop(true)}>Community</Title>
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
        <CategoryChips value={category} onPress={handleCategoryChange} />
      </ChipsWrap>

      <SortWrap>
        <SortTabs value={sort} onPress={handleSortChange} />
      </SortWrap>

      <PostList sort={sort} category={category} scrollRef={scrollRef} />

      <WriteFab onHandleWritePress={handleWritePress} />
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
