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
import { createPanel } from './web_panels/createPanel'

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

// const createPanel = ({ id, url, x, y, width, height }) => {
//   const panel = new WebContentsView({
//     webPreferences: {
//       nodeIntegration: false
//     }
//   })

//   panel.setBorderRadius(6)

//   panel.setBackgroundColor('#475569')
//   panel.webContents.userAgent =
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

//   // contextMenu({
//   //   window: panel.webContents,
//   //   showSaveImageAs: true,
//   //   showInspectElement: true,
//   //   showSearchWithGoogle: true
//   // })

//   base.contentView.addChildView(panel)

//   if (url) {
//     panel.webContents.loadURL(url)
//   } else if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
//     panel.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#page=default-page')
//   } else {
//     panel.webContents.loadFile(join(__dirname, '../renderer/index.html#page=default-page'))
//   }

//   panel.setBounds({
//     width,
//     height,
//     x,
//     y
//   })

//   panel.webContents.on('focus', () => {
//     container.webContents.send('panel:focused', { name: id })
//   })

//   panel.webContents.on('page-title-updated', () => {
//     const title = panel.webContents.getTitle()
//     container.webContents.send('PANEL:UPDATE', { id, title })
//   })

//   panel.webContents.on('update-target-url', () => {
//     const url = panel.webContents.getURL()
//     container.webContents.send('PANEL:UPDATE', { id, url })
//   })

//   panel.webContents.on('dom-ready', () => {
//     panel.setBackgroundColor('#ffffff')
//     panel.webContents.insertCSS(resetCss())
//   })

//   return panel
// }

app.whenReady().then(() => {
  createWindow()
  container.webContents.openDevTools()

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

    panels.forEach((panel: any) => {
      if (panel.id === data.id) {
        panel.wcv.setBounds({
          ...panel.wcv.getBounds(),
          ...newBounds
        })
      }
    })
  })

  ipcMain.on('PANEL:LOAD_URL', (_, data: any) => {
    const { id, url } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.wcv.webContents.loadURL(url)
      }
    })
  })

  ipcMain.on('BROWSER:GET_SYSTEM_INFO', (event) => {
    const osName = getOsName()
    const systemTheme = getSystemTheme()
    const architecture = getArchitecture()

    console.log('osName:', osName)
    console.log('systemTheme:', systemTheme)
    console.log('architecture:', architecture)

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

  let panels = []
  ipcMain.handle('TAB:CREATE', async () => {
    return new Promise(function (resolve, reject) {
      console.log('create panel')
      const newPanel = createPanel({
        base,
        container,
        width: 300,
        height: 200
      })

      if (newPanel.id) {
        delete newPanel.base
        delete newPanel.container
        delete (newPanel as any).panel

        resolve(newPanel)
      } else {
        reject(new Error('Error creating panel'))
      }
    })
    // console.log('create panel')
    // const newPanel = createPanel({
    //   base,
    //   container,
    //   width: 300,
    //   height: 200
    // })

    // if (newPanel.id) {
    //   delete newPanel.base
    //   delete newPanel.container
    //   delete (newPanel as any).panel

    //   setInterval(() => {
    //     event.reply('TAB:CREATE', { cool: 1 })
    //   }, 1000)

    //   event.reply('TAB:CREATE', newPanel)
    // }
  })

  ipcMain.on('TAB:REMOVE', (_, panelId) => {
    const panel: any = panels.find((panel: any) => panel.id === panelId)
    console.log('destroy panel:', panel)

    if (panel.wcv && panel.wcv.webContents) {
      base.contentView.removeChildView(panel.wcv)
      panel.wcv.webContents.destroy()
    }

    panels = panels.filter((panel: any) => panel.id !== panelId)
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
