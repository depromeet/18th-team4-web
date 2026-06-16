import { ENDPOINTS } from '@/constants';
import { clientAuthHttp, HttpError } from '@/lib';
import { type CreateSessionResponse, type DoneEvent, type ErrorEvent } from './chat.type';
import { DoneEventSchema, ErrorEventSchema, TokenEventSchema } from './chat.zod';

const SSE_RETRY_MAX = 3;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type ApiErrorBody = {
  code?: string;
  errorCode?: string;
  message?: string;
  data?: {
    code?: string;
    errorCode?: string;
    message?: string;
  };
};

const parsePreStreamError = async (response: Response): Promise<ErrorEvent> => {
  let body: ApiErrorBody | undefined;
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    body = undefined;
  }

  const retryAfter = Number(response.headers.get('Retry-After'));
  const code =
    body?.errorCode ??
    body?.code ??
    body?.data?.errorCode ??
    body?.data?.code ??
    (response.status === 429 ? 'USER_RATE_LIMIT_EXCEEDED' : 'API_ERROR');

  return {
    code,
    message: body?.message ?? body?.data?.message ?? 'API Error',
    rateLimit: Number.isFinite(retryAfter) ? { retryAfterSeconds: retryAfter } : undefined,
  };
};

export const createChatSession = async (): Promise<number> => {
  const response = await clientAuthHttp.post<void, CreateSessionResponse>(
    ENDPOINTS.AI_CHAT.createSession(),
  );

  return response.data.sessionId;
};

export type StreamCallbacks = {
  onToken: (delta: string) => void | Promise<void>;
  onDone: (data: DoneEvent) => void;
  onError: (data: ErrorEvent) => void;
  onRetry?: () => void;
};

export const streamChatMessage = async (
  sessionId: string,
  content: string,
  callbacks: StreamCallbacks,
  retryCount = 0,
): Promise<void> => {
  let response: Response;

  try {
    response = await clientAuthHttp.stream(ENDPOINTS.AI_CHAT.sendMessage(sessionId), { content });
  } catch (error) {
    throw new HttpError({
      message: error instanceof Error ? error.message : 'Network Error',
      status: 503,
    });
  }

  // pre-stream rate limit → Retry-After 헤더 확인 후 재시도
  if (response.status === 429 && retryCount < SSE_RETRY_MAX) {
    const retryAfter = Number(response.headers.get('Retry-After') ?? 5);
    callbacks.onRetry?.();
    await sleep(retryAfter * 1000);
    return streamChatMessage(sessionId, content, callbacks, retryCount + 1);
  }

  if (!response.ok) {
    callbacks.onError(await parsePreStreamError(response));
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) throw new HttpError({ message: 'No response body', status: 502 });

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE 메시지는 \n\n 단위로 구분
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const lines = part.split('\n');
      let eventType = '';
      const dataLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith('event:')) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trim());
        }
      }

      if (!eventType || dataLines.length === 0) continue;

      let data: unknown;
      try {
        data = JSON.parse(dataLines.join('\n'));
      } catch {
        console.warn('[SSE] JSON parse failed for event:', eventType, dataLines.join('\n'));
        continue;
      }

      if (eventType === 'token') {
        const parsed = TokenEventSchema.safeParse(data);
        if (parsed.success) {
          await callbacks.onToken(parsed.data.delta);
        } else {
          console.warn('[SSE] token schema failed:', parsed.error.issues, data);
        }
      } else if (eventType === 'done') {
        const parsed = DoneEventSchema.safeParse(data);
        if (parsed.success) {
          callbacks.onDone(parsed.data);
        } else {
          console.warn('[SSE] done schema failed:', parsed.error.issues, data);
        }
      } else if (eventType === 'error') {
        const parsed = ErrorEventSchema.safeParse(data);
        if (parsed.success) {
          if (parsed.data.code === 'AI_RATE_LIMIT_BURST' && retryCount < SSE_RETRY_MAX) {
            const retryAfter = parsed.data.rateLimit?.retryAfterSeconds ?? 5;
            await reader.cancel();
            callbacks.onRetry?.();
            await sleep(retryAfter * 1000);
            return streamChatMessage(sessionId, content, callbacks, retryCount + 1);
          }
          callbacks.onError(parsed.data);
        } else {
          console.warn('[SSE] error schema failed:', parsed.error.issues, data);
        }
      }
    }
  }
};
