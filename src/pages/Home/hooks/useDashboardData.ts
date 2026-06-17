import { useQuery } from '@tanstack/react-query';
import { fetchDashboardData } from '@/pages/Home/services/dashboard.services';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};