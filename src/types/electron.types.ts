import { PrintReceiptType, PrintResult } from "./common.type";

export { };

declare global {
  interface Window {
    electronAPI: {
      getPrinters: () => Promise<any>;
      printReceipt: (Props: PrintReceiptType) => Promise<PrintResult>;
      getOS: () => Promise<NodeJS.Platform>;
      
      getAppVersion: () => Promise<{ version: string }>;

      onUpdateAvailable: (callback: (event: Event, info: { version: string }) => void) => void,
      onDownloadProgress: (callback: (event: Event, progress: {
        percent: number;
        bytesPerSecond: number;
        total: number;
        transferred: number;
      }) => void) => void,
      onUpdateDownloaded: (callback: (event: Event, info: { version: string }) => void) => void,
      onUpdateError: (callback: (event: Event, error: string) => void) => void,
      restartApp: () => void
    };
  }
}
