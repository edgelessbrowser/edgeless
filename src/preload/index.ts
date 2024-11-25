const { contextBridge, ipcRenderer } = require('electron')

// Edgeless Browser Pipeline (___ebp___)
contextBridge.exposeInMainWorld('___ebp___', {
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
