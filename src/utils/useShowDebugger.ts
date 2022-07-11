import { useEffect, useState } from 'react';

let currentShowDebugger = false;

const callbacks = {} as Record<string, (show: boolean) => void>;

export const toggleDebugger = (show?: boolean) => {
  currentShowDebugger = typeof show === 'boolean' ? show : !currentShowDebugger;
  Object.values(callbacks).forEach((callback) => {
    callback?.(currentShowDebugger);
  });
};

const getGenIdFn = () => {
  let lastId = 0;
  return () => `${lastId++}`;
};

export const getLocalId = getGenIdFn();

const getUseShowDebugger = () => {
  return () => {
    const [show, setShowDebugger] = useState(currentShowDebugger);
    useEffect(() => {
      const uid = getLocalId();

      callbacks[uid] = (newShow) => setShowDebugger(newShow);

      return () => {
        delete callbacks[uid];
      };
    }, []);

    return [show, toggleDebugger] as [boolean, (show?: boolean) => void];
  };
};

export const useShowDebugger = getUseShowDebugger();
