interface ApiRequestInit extends RequestInit {
  responseType?: 'blob' | 'json';
}

function resolveRequestUrl(url: string): string {
  if (typeof window !== 'undefined' || /^https?:\/\//.test(url)) return url;
  if (!url.startsWith('/')) return url;

  const serverOrigin = process.env.API_PROXY_TARGET;
  return `${serverOrigin}${url}`;
}

export class HttpError extends Error {
  status: number;
  errorCode?: string;
  path?: string;

  constructor(params: { message: string; status: number; errorCode?: string; path?: string }) {
    super(params.message);
    this.name = 'HttpError';
    this.status = params.status;
    this.errorCode = params.errorCode;
  }
}

export const httpBase = async <T>(url: string, options: ApiRequestInit = {}): Promise<T> => {
  const requestUrl = resolveRequestUrl(url);

  const { ...fetchOptions } = options;

  let res: Response;
  try {
    res = await fetch(requestUrl, {
      credentials: 'include',
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    throw new HttpError({
      message: error instanceof Error ? error.message : 'Network Error',
      status: 503,
    });
  }

  console.groupCollapsed('api call');
  console.log('METHOD:', options.method);
  console.log('URL:', url);
  console.log('HEADERS:', {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  });
  console.groupEnd();
  console.groupCollapsed('api response');
  console.log(res);
  console.groupEnd();
  if (!res.ok) {
    let message = 'API Error';
    let errorCode: string | undefined;
    let path: string | undefined;

    try {
      const errorBody = await res.json();
      message = errorBody?.message ?? message;
      errorCode = errorBody?.errorCode ?? errorBody?.code ?? errorBody?.data?.errorCode;
      path = errorBody?.path;
    } catch {
      // non-json 에러 응답 대비
    }

    throw new HttpError({
      message,
      status: res.status,
      errorCode,
      path,
    });
  }

  if (options.responseType === 'blob') {
    return (await res.blob()) as T;
  }

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new HttpError({
      message: 'Invalid API response format',
      status: res.status || 502,
    });
  }

  try {
    return (await res.json()) as T;
  } catch {
    throw new HttpError({
      message: 'Failed to parse API response',
      status: res.status || 502,
    });
  }
};
