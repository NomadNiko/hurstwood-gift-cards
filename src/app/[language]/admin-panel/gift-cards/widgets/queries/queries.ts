import { useGetWidgetsService } from "@/services/api/services/widgets";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";

export const widgetsQueryKeys = createQueryKeys(["widgets"], {
  list: () => ({
    key: [],
  }),
});

export const useGetWidgetsQuery = () => {
  const fetch = useGetWidgetsService();

  return useInfiniteQuery({
    queryKey: widgetsQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        { page: pageParam, limit: 10 },
        { signal }
      );
      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    gcTime: 0,
  });
};
