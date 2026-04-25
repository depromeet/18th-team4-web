import { ApiResponse } from '@/lib';

export interface NoticeItem {
  id: number;
  title: string;
  createdAt: string;
  type: string;
}

export interface NoticeItemDetail {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  type: string;
  files: string[];
  originalFiles: string[];
}

export interface NoticeListRequest {
  page: number;
  limit: number;
  searchField?: string;
  searchKeyword?: string;
}

export interface NoticeDetailRequest {
  id: string;
}

export type NoticeListResponse = ApiResponse<NoticeItem[]>;
export type NoticeDetailResponse = ApiResponse<NoticeItemDetail>;
