export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
  meta: PaginationType;
}

export interface PaginationType {
  limit: number;
  page: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiRequestInit extends RequestInit {
  responseType?: 'blob' | 'json';
  xForwardedFor?: string;
}
