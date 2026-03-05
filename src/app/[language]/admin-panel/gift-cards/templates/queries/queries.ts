import { useGetGiftCardTemplatesService } from "@/services/api/services/gift-card-templates";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";

export const giftCardTemplatesQueryKeys = createQueryKeys(
  ["giftCardTemplates"],
  {
    list: () => ({
      key: [],
    }),
  }
);

export const useGetGiftCardTemplatesQuery = () => {
  const fetch = useGetGiftCardTemplatesService();

  return useInfiniteQuery({
    queryKey: giftCardTemplatesQueryKeys.list().key,
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
