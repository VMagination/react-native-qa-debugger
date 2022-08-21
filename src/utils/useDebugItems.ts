import { useEffect, useState } from 'react';
import { DebuggerState } from '../state';
import { findDiff } from './findDiff';

let currentDebugItems = [] as any[];

const callbacks = {} as Record<string, (newItems: any[]) => void>;

type LogItem = any & {
  label?: string;
  title?: string;
  logType?: 'info' | 'success' | 'error' | 'warning';
  type?: any;
  data?: any;
};

export const resetLogItems = () => {
  DebuggerState.previousSnapshot = undefined;
  currentDebugItems = [];
  Object.values(callbacks).forEach((callback) => {
    callback?.(currentDebugItems);
  });
};

export const getCurrentSnapshots = () => {
  let snapshot: Promise<any> | undefined;
  let snapshotReadable: Promise<any> | undefined;
  if (DebuggerState.areSnapshotsEnabled && DebuggerState.getGlobalState) {
    const newSnapshot = DebuggerState.getGlobalState() as Promise<any>;
    if (DebuggerState.previousSnapshot) {
      const diffPromise = findDiff(DebuggerState.previousSnapshot, newSnapshot);
      snapshotReadable = diffPromise.then(({ diffReadable }) => diffReadable);
      snapshot = diffPromise.then(({ diff }) => diff);
    } else {
      snapshot = newSnapshot;
    }
    DebuggerState.previousSnapshot = newSnapshot;
  }
  return { snapshot, snapshotReadable };
};

export const addLogItem = (...newItems: LogItem[]) => {
  if (!DebuggerState.isMounted) return;
  const { snapshot, snapshotReadable } = getCurrentSnapshots();
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

export const logToDebugger = addLogItem;

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
