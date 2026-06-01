import Link from 'next/link';
import {
  CHAT_CARD_COLOR_SEQUENCE,
  CHAT_CARD_STATUS,
  ChatCard,
  DocumentIcon,
} from '@/components';
import { PATH_NAME } from '@/constants';
import { formatDate, type SessionItem, type SessionStatus } from '@/lib';

const SESSION_STATUS_TO_CARD: Record<
  SessionStatus,
  (typeof CHAT_CARD_STATUS)[keyof typeof CHAT_CARD_STATUS]
> = {
  ACTIVE: CHAT_CARD_STATUS.DEFAULT,
  SUMMARIZING: CHAT_CARD_STATUS.LOADING,
  CLOSED: CHAT_CARD_STATUS.DEFAULT,
  FAILED: CHAT_CARD_STATUS.ERROR,
};

type Props = {
  sessions: SessionItem[];
  filteredSessions: SessionItem[];
  sentinelRef: React.RefObject<HTMLLIElement | null>;
  onNavigate: (path: string) => Promise<void>;
};

export const SessionList = (props: Props) => {
  const { sessions, filteredSessions, sentinelRef, onNavigate } = props;

  return (
    <div className="mt-[2.4rem] flex flex-col gap-[1.2rem]">
      <div className="flex items-center gap-[0.4rem] px-[2.4rem]">
        <DocumentIcon className="shrink-0 text-text-caption" />
        <p className="body2-semibold tracking-[-0.042rem]">
          <span className="text-text-description">오전 6시에</span>
          <span className="text-text-caption"> AI가 독후감을 작성해요</span>
        </p>
      </div>
      <ol className="flex list-none flex-col gap-[0.4rem] px-[2.4rem] pb-32">
        {filteredSessions.map((session) => {
          const sessionIdStr = String(session.sessionId);
          const originalIndex = sessions.indexOf(session);
          const color =
            CHAT_CARD_COLOR_SEQUENCE[
              (sessions.length - 1 - originalIndex) % CHAT_CARD_COLOR_SEQUENCE.length
            ];
          const path =
            session.status === 'CLOSED' || session.status === 'SUMMARIZING'
              ? `${PATH_NAME.summary.detail(sessionIdStr)}?color=${color}`
              : PATH_NAME.chat.detail(sessionIdStr);

          return (
            <li key={session.sessionId}>
              <Link
                href={path}
                className="cursor-pointer"
                onClick={async (e) => {
                  e.preventDefault();
                  await onNavigate(path);
                }}
              >
                <ChatCard
                  color={color}
                  status={SESSION_STATUS_TO_CARD[session.status]}
                  date={formatDate(session.lastChattedDate)}
                  summary={session.title}
                  bookmarked={session.status === 'CLOSED'}
                />
              </Link>
            </li>
          );
        })}
        <li ref={sentinelRef} aria-hidden />
      </ol>
    </div>
  );
};
