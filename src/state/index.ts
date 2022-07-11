export type IDebuggerState = {
  isMounted: boolean;
  areSnapshotsEnabled: boolean;
  getGlobalState?: () => any;
  previousSnapshot: any;
};

export const DebuggerState: IDebuggerState = {
  isMounted: false,
  areSnapshotsEnabled: true,
  getGlobalState: undefined,
  previousSnapshot: undefined,
};
