const { contextBridge, ipcRenderer } = require("electron");

// Edgeless Browser Pipeline (___ebp___)
contextBridge.exposeInMainWorld("___ebp___", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  },
});
