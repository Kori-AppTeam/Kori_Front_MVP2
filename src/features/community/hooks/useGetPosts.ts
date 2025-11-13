import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getPosts } from '../apis/post';
import { BoardId, PostsListResp, RequestPageParams } from '../types/postsListType';

export function useGetPosts(boardId: BoardId, params: RequestPageParams) {
  try {
    const result = useQuery<PostsListResp>({
      queryKey: ['communityPosts'],
      queryFn: () => getPosts(boardId, params),
      retry: 3,
    });

    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data.message || 'Unknown Error';

      if (status === 400) {
        return message;
      } else if (status === 404) {
        return message;
      } else if (status === 500) {
        console.log('Server Error: ', error);
        return 'Server Error';
      } else {
        console.log('UnKnown Error: ', error);
        return 'UnKnown Error';
      }
    }
  }
}
