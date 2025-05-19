import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import path from 'node:path';
import fs from 'fs';
import started from 'electron-squirrel-startup';
import { PrintReceiptType } from './types/common.type';
import { autoUpdater, UpdateInfo, ProgressInfo } from 'electron-updater';
import Logger from 'electron-log';

// Configure logger
Logger.initialize({});
Logger.transports.file.level = 'info';
Logger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Ensure logs directory exists
const logDirectory = path.join(app.getPath('userData'), 'logs');
fs.mkdirSync(logDirectory, { recursive: true });

// Set log path
const logPath = path.join(logDirectory, 'main.log');
Logger.transports.file.resolvePath = () => logPath;

// Log initialization
Logger.info(`Application started in ${process.env.NODE_ENV || 'production'} mode`);
Logger.info(`Log file location: ${logPath}`);
Logger.info(`Application version ${app.getVersion()}`);

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

let mainWindow: BrowserWindow;

function configureIPC() {
  ipcMain.handle('get-printers', async () => {
    const mainWindow = BrowserWindow.getFocusedWindow();
    if (mainWindow) {
      return await mainWindow.webContents.getPrintersAsync();
    }
    return [];
  });

  ipcMain.handle('get-os', (): NodeJS.Platform => {
    return process.platform;
  });

  ipcMain.handle("print-receipt", (event, Props: PrintReceiptType) => {
    const { imgArgs, printerName, copies } = Props;
    const { data, width, height } = imgArgs;

    return new Promise((resolve, reject) => {
      const printWindow = new BrowserWindow({
        show: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
        },
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>
                    @page {
                        size: ${width}mm ${height}mm;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: ${width}mm;
                        height: ${height}mm;
                        -webkit-print-color-adjust: exact;
                    }
                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <img src="${data}" />
            </body>
        </html>
        `;

      printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

      printWindow.webContents.on("did-finish-load", () => {
        printWindow.webContents.print({
          silent: true,
          printBackground: true,
          deviceName: printerName,
          copies: copies,
          pageSize: {
            width: Math.round(width * 1000),
            height: Math.round(height * 1000)
          },
          margins: {
            marginType: 'none',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          },
          scaleFactor: 100,
        }, (success, errorType) => {
          printWindow.close();
          success ?
            resolve({ success: true, message: "Print successful" }) :
            reject({ success: false, message: errorType });
        });
      });

      printWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
        printWindow.close();
        reject({ success: false, message: `Content load failed: ${errorDescription}` });
      });
    });
  });

  ipcMain.handle('get-app-version', () => {
    return { version: app.getVersion() };
  });
}

function createWindow(): BrowserWindow {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/static/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (process.env.NODE_ENV === 'development') {
    window.webContents.openDevTools();
  }

  return window;
}

app.whenReady().then(() => {
  configureIPC();
  mainWindow = createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// Auto-updater events with UI forwarding
autoUpdater.on("update-available", (info: UpdateInfo) => {
  mainWindow?.webContents.send('update-available', info);
  Logger.info(`Update available: ${info.version}`);
});

autoUpdater.on("download-progress", (progress: ProgressInfo) => {
  mainWindow?.webContents.send('download-progress', progress);
  Logger.info(`Download progress: ${Math.round(progress.percent)}%`);
});

autoUpdater.on("update-not-available", () => {
  mainWindow?.webContents.send('update-not-available');
  Logger.info("No updates available");
});

autoUpdater.on("update-downloaded", (info: UpdateInfo) => {
  mainWindow?.webContents.send('update-downloaded', info);
  Logger.info(`Update downloaded: ${info.version}`);
});

autoUpdater.on("error", (error: Error) => {
  mainWindow?.webContents.send('update-error', error.message);
  Logger.error(`Update error: ${error.message}`);
});

autoUpdater.on('checking-for-update', () => {
  mainWindow?.webContents.send('checking-for-update');
  Logger.info("Checking for updates...");
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});