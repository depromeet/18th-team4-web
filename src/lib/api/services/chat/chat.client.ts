import { ENDPOINTS } from '@/constants';
import { clientAuthHttp, HttpError } from '@/lib';
import { type CreateSessionResponse, type DoneEvent, type ErrorEvent } from './chat.type';
import { DoneEventSchema, ErrorEventSchema, TokenEventSchema } from './chat.zod';

const SSE_RETRY_MAX = 3;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const createChatSession = async (): Promise<number> => {
  const response = await clientAuthHttp.post<void, CreateSessionResponse>(
    ENDPOINTS.AI_CHAT.createSession(),
  );

  return response.data.sessionId;
};

export type StreamCallbacks = {
  onToken: (delta: string) => void;
  onDone: (data: DoneEvent) => void;
  onError: (data: ErrorEvent) => void;
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
    await sleep(retryAfter * 1000);
    return streamChatMessage(sessionId, content, callbacks, retryCount + 1);
  }

  if (!response.ok) {
    throw new HttpError({ message: 'API Error', status: response.status });
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
      const eventMatch = part.match(/^event: (\w+)/m);
      const dataMatch = part.match(/^data: (.+)/m);
      if (!eventMatch || !dataMatch) continue;

      const eventType = eventMatch[1];
      let data: unknown;
      try {
        data = JSON.parse(dataMatch[1]);
      } catch {
        continue;
      }

      if (eventType === 'token') {
        const parsed = TokenEventSchema.safeParse(data);
        if (parsed.success) {
          callbacks.onToken(parsed.data.delta);
        }
      } else if (eventType === 'done') {
        const parsed = DoneEventSchema.safeParse(data);
        if (parsed.success) {
          callbacks.onDone(parsed.data);
        }
      } else if (eventType === 'error') {
        const parsed = ErrorEventSchema.safeParse(data);
        if (parsed.success) {
          if (parsed.data.code === 'AI_RATE_LIMIT_BURST' && retryCount < SSE_RETRY_MAX) {
            const retryAfter = parsed.data.rateLimit?.retryAfterSeconds ?? 5;
            reader.cancel();
            await sleep(retryAfter * 1000);
            return streamChatMessage(sessionId, content, callbacks, retryCount + 1);
          }
          callbacks.onError(parsed.data);
        }
      }
    }
  }
};
