// preload.ts
import { contextBridge, ipcRenderer } from "electron";
import { PrintReceiptType } from "./types/common.type";


contextBridge.exposeInMainWorld('electronAPI', {
  getPrinters: () => ipcRenderer.invoke('get-printers'),
  printReceipt: (Props: PrintReceiptType) => ipcRenderer.invoke("print-receipt", Props),
  getOS: (): Promise<NodeJS.Platform> => ipcRenderer.invoke('get-os'),
  
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  onUpdateAvailable: (callback: (event: any, info: any) => void) =>
    ipcRenderer.on('update-available', callback),
  onDownloadProgress: (callback: (event: any, progress: any) => void) =>
    ipcRenderer.on('download-progress', callback),
  onUpdateDownloaded: (callback: (event: any, info: any) => void) =>
    ipcRenderer.on('update-downloaded', callback),
  onUpdateError: (callback: (event: any, error: string) => void) =>
    ipcRenderer.on('update-error', callback),
  restartApp: () => ipcRenderer.send('restart-app')
});