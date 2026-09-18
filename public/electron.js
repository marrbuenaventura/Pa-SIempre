const { app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const isDev = !app.isPackaged;

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

function createWindow() {
    const window = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 650,
        title: "Pa Siempre",
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    window.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    );

    // Fuerza el zoom a 100% cada vez que carga, ignorando lo que haya quedado guardado
    window.webContents.on('did-finish-load', () => {
        window.webContents.setZoomFactor(1);
    });

    ipcMain.on('set-zoom', (event, factor) => {
        window.webContents.setZoomFactor(factor);
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });