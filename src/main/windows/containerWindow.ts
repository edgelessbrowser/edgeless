import { join } from 'path'
import { BaseWindow, WebContentsView } from 'electron'
import { is } from '@electron-toolkit/utils'

export const containerWindow = ({
  preload,
  base
}: {
  preload: string
  base: BaseWindow
}): WebContentsView => {
  const container = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload
    }
  })

  base.contentView.addChildView(container)
  container.setBackgroundColor('#00000000')

  container.setBounds({ ...base.getBounds(), x: 0, y: 0 })
  base.on('resize', () => {
    container.setBounds({ ...base.getBounds(), x: 0, y: 0 })
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    container.webContents.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#page=browser')
  } else {
    container.webContents.loadFile(join(__dirname, '../renderer/index.html#page=browser'))
  }

  return container
}
