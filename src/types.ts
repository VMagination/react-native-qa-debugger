export type Props = {
  getGlobalState?: () => Promise<Record<any, any>> | Record<any, any>;
  disableSnapshots?: boolean;
  sendToDefaultValue?: string;
  hideSwitcher?: boolean;
  customSendRequest?: (text: string, debugItems: any[]) => void;
};
