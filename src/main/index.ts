import os from 'os'
import { join } from 'path'
import {
  app,
  BaseWindow,
  WebContentsView,
  nativeTheme,
  screen,
  globalShortcut,
  ipcMain
} from 'electron'

// import { fileURLToPath } from 'url'
// import path, { dirname } from 'path'

// import contextMenu from 'electron-context-menu'

// const projectDirname = dirname(fileURLToPath(import.meta.url))

import { baseWindow } from './windows/baseWindow'
import { containerWindow } from './windows/containerWindow'
import { createPanel, panels, removePanel } from './web_panels/createPanel'

const getOsName = () => {
  switch (os.platform()) {
    case 'win32':
      return 'Windows'
    case 'darwin':
      return 'Mac'
    case 'linux':
      return 'Linux'
    default:
      return 'Unknown'
  }
}

const getSystemTheme = () => (nativeTheme.shouldUseDarkColors ? 'Dark' : 'Light')

const getArchitecture = () => {
  switch (os.arch()) {
    case 'x64':
      return 'x64'
    case 'arm64':
      return 'arm64'
    case 'arm':
      return 'arm'
    case 'ia32':
      return 'x86'
    default:
      return 'Unknown'
  }
}

// function encodeHashParams(params) {
//   const hashParams = new URLSearchParams()

//   Object.keys(params).forEach((key) => {
//     const value = params[key]
//     hashParams.append(key, value.toString())
//   })

//   // Return the hash string, including the leading '#'
//   return `#${hashParams.toString()}`
// }

// const isLinux = process.platform === 'linux'
// const isMacOs = process.platform === 'darwin'
const isWindows = process.platform === 'win32'
// const isDev = is.dev

let base: BaseWindow
let container: WebContentsView

function getMaximizedMonitorInfo(mainWindow: BaseWindow) {
  mainWindow.on('maximize', () => {
    // Get the current window bounds
    const windowBounds = mainWindow.getBounds()

    // Get the display that contains the majority of the window
    // @ts-ignore
    const display = screen.getDisplayMatching(windowBounds)
    const { height, width } = display.workAreaSize

    // Extract monitor information
    const monitorInfo = {
      id: display.id,
      width,
      height,
      scaleFactor: display.scaleFactor, // Scale factor is related to DPI
      dpi: display.scaleFactor * 96 // Common DPI calculation (96 is standard DPI for 100%)
    }

    // Log monitor info or send it to the renderer process
    // console.log('Maximized on Monitor:', monitorInfo)
    // mainWindow.webContents.send("monitor-info", monitorInfo);
    container.webContents.send('baseWindow:sizeUpdate', {
      width: monitorInfo.width,
      height: monitorInfo.height
    })
  })
}

function createWindow(): void {
  nativeTheme.themeSource = 'dark'

  base = baseWindow()
  container = containerWindow({ base, preload: join(__dirname, '../preload/index.js') })
}

app.whenReady().then(() => {
  createWindow()
  // container.webContents.openDevTools()

  if (isWindows) {
    getMaximizedMonitorInfo(base)
  }

  const toolbarreg = globalShortcut.register('Ctrl+Shift+T', () => {
    if (base.isFocused()) {
      container.webContents.send('baseWindow:toogleToolbar')
    }
  })

  if (!toolbarreg) {
    console.log('Registration failed')
  }

  const sidereg = globalShortcut.register('Ctrl+Shift+D', () => {
    if (base.isFocused()) {
      container.webContents.send('baseWindow:toogleSidebar')
    }
  })

  if (!sidereg) {
    console.log('Registration failed')
  }

  if (isWindows) {
    base.on('resize', () => {
      const newBounds = base.getBounds()
      if (base.isMaximized()) {
        // container.webContents.send("baseWindow:sizeUpdate", {
        //   width: newBounds.width - 16,
        //   height: newBounds.height - 18,
        // });
      } else {
        container.webContents.send('baseWindow:sizeUpdate', newBounds)
      }
    })

    // base.on("ready-to-show", () => {
    //   const newBounds = base.getBounds();
    //   container.webContents.send("baseWindow:sizeUpdate", newBounds);
    // });
  }

  ipcMain.on('PANEL:BOUND_UPDATE', (_, data) => {
    const newBounds = {
      height: data.height,
      width: data.width,
      x: data.x,
      y: data.y
    }

    // console.log('main PANEL:BOUND_UPDATE => ', data)

    panels.forEach((panel: any) => {
      if (panel.id === data.panelId) {
        // console.log('found the panel:', panel)
        panel.panelWindow.setBounds({
          ...panel.panelWindow.getBounds(),
          ...newBounds
        })

        base.contentView.addChildView(panel.panelWindow)
      }
    })
  })

  ipcMain.on('PANEL:LOAD_URL', (_, data: any) => {
    const { id, url } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.panelWindow.webContents.loadURL(url)
      }
    })
  })

  ipcMain.on('PANEL:RELOAD', (_, data: { id: string; url: string }) => {
    const { id } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.panelWindow.webContents.reload()
      }
    })
  })

  ipcMain.on('PANEL:GO_BACK', (_, data: { id: string }) => {
    const { id } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.panelWindow.webContents.goBack()
      }
    })
  })

  ipcMain.on('PANEL:GO_FORWARD', (_, data: { id: string }) => {
    const { id } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.panelWindow.webContents.goForward()
      }
    })
  })

  ipcMain.on('BROWSER:GET_SYSTEM_INFO', (event) => {
    const osName = getOsName()
    const systemTheme = getSystemTheme()
    const architecture = getArchitecture()

    // console.log('osName:', osName)
    // console.log('systemTheme:', systemTheme)
    // console.log('architecture:', architecture)

    event.reply('BROWSER:GET_SYSTEM_INFO', {
      osName,
      systemTheme,
      architecture,
      isMaximized: base.isMaximized()
    })
  })

  ipcMain.on('BROWSER:MINIMIZE', () => {
    base.minimize()
  })

  ipcMain.on('BROWSER:MAXIMIZE', () => {
    if (base.isMaximized()) {
      base.unmaximize()
    } else {
      base.maximize()
    }
  })

  base.on('maximize', () => {
    container.webContents.send('BROWSER:GET_IS_MAXIMIZE', true)
  })

  base.on('unmaximize', () => {
    container.webContents.send('BROWSER:GET_IS_MAXIMIZE', false)
  })

  ipcMain.on('BROWSER:CLOSE', () => {
    base.close()
  })

  ipcMain.handle('PANEL:CREATE', async () => {
    return new Promise(function (resolve, reject) {
      const newPanel = createPanel({
        base,
        container,
        width: 300,
        height: 200
      })

      if (newPanel.id) {
        resolve({
          id: newPanel.id
        })
      } else {
        reject(new Error('Error creating panel'))
      }
    })
  })

  ipcMain.handle('PANEL:GET_ALL', async () => {
    if (panels.length < 1) {
      return []
    }

    return panels.map((panel: any) => {
      return {
        ...panel,
        panelWindow: undefined
      }
    })
  })

  ipcMain.on('baseWindow:toggleTrafficLights', (_, data) => {
    console.log('baseWindow:toggleTrafficLights => ', data)
    base.setWindowButtonVisibility(data.nextToolbarState)
  })

  ipcMain.on('TAB:REMOVE', (_, panelId) => {
    const panel: any = panels.find((panel: any) => panel.id === panelId)
    // console.log('destroy panel:', panel)

    if (panel.panelWindow && panel.panelWindow.webContents) {
      base.contentView.removeChildView(panel.panelWindow)
      panel.panelWindow.webContents.destroy()
    }

    removePanel(panelId)
  })

  app.on('activate', function () {
    if (BaseWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
