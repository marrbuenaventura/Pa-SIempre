const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setZoom: (factor) => ipcRenderer.send('set-zoom', factor),
});