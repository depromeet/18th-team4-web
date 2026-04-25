import { ENDPOINTS } from '@/constants';
import {
  NoticeDetailRequest,
  NoticeDetailResponse,
  NoticeListRequest,
  NoticeListResponse,
  publicHttp,
} from '@/lib';

export const getNoticeList = async (request: NoticeListRequest) => {
  const params = new URLSearchParams();

  params.set('page', String(request.page));
  params.set('limit', String(request.limit));

  if (request.searchField && request.searchKeyword) {
    params.set('searchField', request.searchField);
    params.set('searchKeyword', request.searchKeyword);
  }

  const response = await publicHttp.get<NoticeListResponse>(
    `${ENDPOINTS.PAPER.archieve()}?${params.toString()}`,
    {
      cache: 'force-cache',
    },
  );

  return {
    data: response.data,
    paginationData: response.meta,
  };
};

export const getNoticeDetail = async (request: NoticeDetailRequest) => {
  const response = await publicHttp.get<NoticeDetailResponse>(
    `${ENDPOINTS.PAPER.detail(Number(request.id))}`,
  );

  return response.data;
};
