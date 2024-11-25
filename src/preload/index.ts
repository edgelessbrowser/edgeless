const { contextBridge, ipcRenderer } = require('electron')

// Edgeless Browser Pipeline (EDGELESS_GLOBAL_BRIDGE)
contextBridge.exposeInMainWorld('EDGELESS_GLOBAL_BRIDGE', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  },
  once: (channel, func) => {
    ipcRenderer.once(channel, (_, ...args) => func(...args))
  },
  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func)
  }
})
