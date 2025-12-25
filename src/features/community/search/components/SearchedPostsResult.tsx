import React from 'react';
import { ListRenderItem, StyleSheet, View } from 'react-native';
import PostListCard from '../../post/components/PostListCard';
import { AllowedCategory, PostsListItem } from '../../post/types';
import { CATEGORY_TO_BOARD_ID } from '../../shared/constants/constants';
import { useGetSearchedPosts } from '../hooks/useGetSearchedPosts';

type SearchedPostsResultProps = {
  category: AllowedCategory;
  value: string;
};

const SearchedPostsResult = ({ category, value }: SearchedPostsResultProps) => {
  const searchedQuery = useGetSearchedPosts(CATEGORY_TO_BOARD_ID[category], value);

  const renderPost: ListRenderItem<PostsListItem> = ({ item }) => <PostListCard data={item} />;

  return <View></View>;
};

const styles = StyleSheet.create({});

export default SearchedPostsResult;
