import { useEffect, useState } from 'react';
import { DebuggerState } from '../state';
import { findDiff } from './findDiff';

let currentDebugItems = [] as any[];

const callbacks = {} as Record<string, (newItems: any[]) => void>;

type LogItem = any & {
  label?: string;
  type?: 'info' | 'success' | 'error' | 'warning';
};

export const resetLogItems = () => {
  currentDebugItems = [];
  Object.values(callbacks).forEach((callback) => {
    callback?.(currentDebugItems);
  });
};

export const addLogItem = (...newItems: LogItem[]) => {
  if (!DebuggerState.isMounted) return;
  let snapshot: any;
  let snapshotReadable: any;
  if (DebuggerState.areSnapshotsEnabled && DebuggerState.getGlobalState) {
    const newSnapshot = DebuggerState.getGlobalState();
    if (DebuggerState.previousSnapshot) {
      const { diff, diffReadable } = findDiff(
        DebuggerState.previousSnapshot,
        newSnapshot
      );
      snapshotReadable = diffReadable;
      snapshot = diff;
    } else {
      snapshot = newSnapshot;
    }
    DebuggerState.previousSnapshot = newSnapshot;
  }
  const normalizedItems = newItems.map((item) =>
    item && typeof item === 'object'
      ? {
          label: item?.label || item?.title || 'No description',
          id: getId(),
          logType: item.logType || 'info',
          type: item.type ?? undefined,
          data: item?.data || item,
          snapshot,
          snapshotReadable,
          timestamp: new Date().toISOString(),
        }
      : {
          label: item,
          id: getId(),
          timestamp: new Date().toISOString(),
          logType: 'info',
          snapshot,
          snapshotReadable,
          type: undefined,
        }
  );
  currentDebugItems = [...normalizedItems, ...currentDebugItems];
  Object.values(callbacks).forEach((callback) => {
    callback?.(currentDebugItems);
  });
};

const getGenIdFn = () => {
  let lastId = 0;
  return () => `${lastId++}`;
};

export const getId = getGenIdFn();

const getUseDebugItems = () => {
  return () => {
    const [debugItems, setDebugItems] = useState(currentDebugItems);

    useEffect(() => {
      const uid = getId();

      callbacks[uid] = (newItems) => setDebugItems(newItems);

      return () => {
        delete callbacks[uid];
      };
    }, []);

    return [debugItems, addLogItem] as [any[], (newItems: any[]) => void];
  };
};

export const useDebugItems = getUseDebugItems();
