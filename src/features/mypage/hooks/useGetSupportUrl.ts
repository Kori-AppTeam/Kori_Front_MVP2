import { useQuery } from '@tanstack/react-query';
import { getSupportLinks } from '../api/support';

export const useGetSupportUrl = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['support-links'],
    queryFn: () => getSupportLinks(),
  });

  return { data, isLoading, isError, refetch };
};
