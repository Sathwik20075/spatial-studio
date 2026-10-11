const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  platform: process.platform,
  getLogin: () => ipcRenderer.invoke('get-login'),
  setLogin: (on) => ipcRenderer.invoke('set-login', on)
});
