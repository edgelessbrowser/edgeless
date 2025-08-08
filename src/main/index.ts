import os from 'os'
import { join } from 'path'
import {
  app,
  BaseWindow,
  WebContentsView,
  nativeTheme,
  screen,
  globalShortcut
} from 'electron'
import { baseWindow } from './windows/baseWindow'
import { containerWindow } from './windows/containerWindow'
import { is } from '@electron-toolkit/utils'
import { registerIpcHandlers } from './events'

const isWindows = process.platform === 'win32'

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

app.whenReady().then(async () => {
  const contextMenu = (await import('electron-context-menu')).default
  contextMenu()
  createWindow()

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
      } else {
        container.webContents.send('baseWindow:sizeUpdate', newBounds)
      }
    })

  }

  registerIpcHandlers(base, container)

  app.on('activate', function () {
    if (BaseWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' || is.dev) {
    app.quit()
  }
})
