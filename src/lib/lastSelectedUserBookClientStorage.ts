const STORAGE_KEY = 'readum:lastSelectedUserBookId';

/** 목록에 존재할 때만 유효 — 다른 기기 등에서 삭제된 id는 무시 */
export const getLastSelectedUserBookIdClient = (
  books: readonly { userBookId: number }[],
): number | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return undefined;
    }
    const id = Number(raw);
    if (!Number.isFinite(id)) {
      return undefined;
    }
    if (!books.some((b) => b.userBookId === id)) {
      return undefined;
    }
    return id;
  } catch {
    return undefined;
  }
};

export const setLastSelectedUserBookIdClient = (userBookId: number): void => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    sessionStorage.setItem(STORAGE_KEY, String(userBookId));
  } catch {
    // quota / private mode
  }
};
