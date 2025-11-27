import { useQuery } from '@tanstack/react-query';
import { getIsVisitor } from '../apis/visitor';

export default function useGetVisitor() {
  return useQuery({
    queryKey: ['isVisitorState'],
    queryFn: () => getIsVisitor(),
  });
}
