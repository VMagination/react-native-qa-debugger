import { promisesSettled } from './promisesSettled';
import { getCurrentSnapshots } from './useDebugItems';

export const getCompleteDebugItems = async (debugItems: any[]) => {
  const preparedItems = await promisesSettled(
    debugItems.map(async (item, i) => {
      if (i) {
        return {
          ...item,
          snapshot: await item.snapshot,
          snapshotReadable: await item.snapshotReadable,
        };
      }
      const { snapshot, snapshotReadable } = getCurrentSnapshots();
      return {
        ...item,
        snapshot: await snapshot,
        snapshotReadable: await snapshotReadable,
      };
    })
  );
  return preparedItems.map((item, i) =>
    item.status === 'fulfilled'
      ? item.value
      : {
          ...debugItems[i],
          snapshot: {
            '[RNQADebugger]: Error Processing Snapshot State': item.reason,
          },
          snapshotReadable: {
            '[RNQADebugger]: Error Processing Snapshot State': item.reason,
          },
        }
  );
};
