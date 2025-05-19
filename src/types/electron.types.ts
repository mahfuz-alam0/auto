import { PrintReceiptType, PrintResult } from "./common.type";

export { };

declare global {
  interface Window {
    electronAPI: {
      getPrinters: () => Promise<any>;
      printReceipt: (Props: PrintReceiptType) => Promise<PrintResult>;
      getOS: () => Promise<NodeJS.Platform>;
    };
  }
}
