import { useCallback, useState } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [mountKey, setMountKey] = useState(0);

  const open = useCallback(() => {
    setMountKey((n) => n + 1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    mountKey,
    open,
    close,
  };
};
