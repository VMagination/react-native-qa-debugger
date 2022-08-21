export type IDebuggerState = {
  isMounted: boolean;
  areSnapshotsEnabled: boolean;
  getGlobalState?: () => any | Promise<any>;
  previousSnapshot: any | Promise<any>;
};

export const DebuggerState: IDebuggerState = {
  isMounted: false,
  areSnapshotsEnabled: true,
  getGlobalState: undefined,
  previousSnapshot: undefined,
};
