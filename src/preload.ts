// preload.ts
import { contextBridge, ipcRenderer } from "electron";
import { PrintReceiptType } from "./types/common.type";


contextBridge.exposeInMainWorld('electronAPI', {
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printReceipt: (Props: PrintReceiptType) => ipcRenderer.invoke("print-receipt", Props),
  getOS: (): Promise<NodeJS.Platform> => ipcRenderer.invoke('get-os'),
});