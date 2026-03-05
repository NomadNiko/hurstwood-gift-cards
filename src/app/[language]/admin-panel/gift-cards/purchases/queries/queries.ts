import { useGetGiftCardsService } from "@/services/api/services/gift-cards";
import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery } from "@tanstack/react-query";

export const giftCardsQueryKeys = createQueryKeys(["giftCards"], {
  list: () => ({
    key: [],
    sub: {
      by: ({
        status,
        templateId,
      }: {
        status?: string;
        templateId?: string;
      }) => ({
        key: [status, templateId],
      }),
    },
  }),
});

export const useGetGiftCardsQuery = ({
  status,
  templateId,
}: { status?: string; templateId?: string } = {}) => {
  const fetch = useGetGiftCardsService();

  return useInfiniteQuery({
    queryKey: giftCardsQueryKeys.list().sub.by({ status, templateId }).key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status: httpStatus, data } = await fetch(
        { page: pageParam, limit: 10, status, templateId },
        { signal }
      );
      if (httpStatus === HTTP_CODES_ENUM.OK) {
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
