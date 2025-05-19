import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import { PrintReceiptType } from './types/common.type';
import { autoUpdater } from 'electron-updater';
import Logger from 'electron-log';

Logger.initialize({});
Logger.transports.file.level = 'info';
Logger.transports.file.fileName = 'main.log';
Logger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Get platform-appropriate log path
const logPath = path.join(app.getPath('userData'), 'logs/main.log');
Logger.transports.file.resolvePath = () => logPath;

Logger.log("Application version", app.getVersion())
// Log initialization
Logger.info(`Application started in ${process.env.NODE_ENV} mode`);
Logger.info(`Log file location: ${logPath}`);

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

if (started) {
  app.quit();
}

// Configure IPC handlers first
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
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'src/static/icons/icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  configureIPC();
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", () => {
  Logger.info("update-available")
})
autoUpdater.on("checking-for-update", () => {
  Logger.info("update-available")
})
autoUpdater.on("download-progress", () => {
  Logger.info("download-progress")
})
autoUpdater.on("update-not-available", (progressTrack) => {
  Logger.info("update-not-available", progressTrack)
})
autoUpdater.on("update-downloaded", () => {
  Logger.info("update-downloaded")
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});