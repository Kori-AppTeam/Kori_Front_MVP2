import { useQuery } from '@tanstack/react-query';
import { getPosts } from '../apis/post';
import { BoardId, PostsListServerResp, RequestPageParams } from '../types/postsListType';

export function useGetPosts(boardId: BoardId, params: RequestPageParams) {
  const { data } = useQuery<PostsListServerResp>({
    queryKey: ['communityPosts'],
    queryFn: () => getPosts(boardId, params),
    retry: 3,
  });
  return data;
}
