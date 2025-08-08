import { ipcMain, BaseWindow, WebContentsView } from 'electron'
import { createPanel, panels, removePanel } from '../web_panels/createPanel'
import { getOsName, getSystemTheme, getArchitecture } from '../utils/systemInfo'

export function registerIpcHandlers(base: BaseWindow, container: WebContentsView) {
  ipcMain.on('PANEL:BOUND_UPDATE', (_, data) => {
    const newBounds = {
      height: data.height,
      width: data.width,
      x: data.x,
      y: data.y
    }

    panels.forEach((panel: any) => {
      if (panel.id === data.panelId) {
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
        panel.panelWindow.webContents.navigationHistory.goBack()
      }
    })
  })

  ipcMain.on('PANEL:GO_FORWARD', (_, data: { id: string }) => {
    const { id } = data

    panels.forEach((panel: any) => {
      if (panel.id === id) {
        panel.panelWindow.webContents.navigationHistory.goForward()
      }
    })
  })

  ipcMain.on('BROWSER:GET_SYSTEM_INFO', (event) => {
    const osName = getOsName()
    const systemTheme = getSystemTheme()
    const architecture = getArchitecture()

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

  ipcMain.on('BROWSER:CLOSE', () => {
    base.close()
  })

  ipcMain.handle('PANEL:CREATE', async (_, { url = undefined }) => {
    return new Promise(function (resolve, reject) {
      const props: { url?: string } = {}

      if (url) {
        props.url = url
      }

      const newPanel = createPanel({
        base,
        container,
        width: 300,
        height: 200,
        ...props
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

    if (panel.panelWindow && panel.panelWindow.webContents) {
      base.contentView.removeChildView(panel.panelWindow)
      panel.panelWindow.webContents.destroy()
    }

    removePanel(panelId)
  })
}
