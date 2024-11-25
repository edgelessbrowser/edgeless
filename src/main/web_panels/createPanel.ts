import { uid } from 'uid'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { BaseWindow, WebContentsView } from 'electron'

function resetCss() {
  return `
    ::-webkit-scrollbar {
        width: 14px;
        height: 14px;
      }

      ::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.2);
      }

      ::-webkit-scrollbar-thumb {
        background-color: #d6dee1;
        border-radius: 8px;
        border: 2px solid transparent;
        border-left-width: 3px;
        border-right-width: 3px;
        background-clip: content-box;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: #a8bbbf;
      }

      ::-webkit-scrollbar-corner { 
        background-color: transparent; 
      }
  `
}

export interface PanelInterface {
  id?: string
  x?: number
  y?: number
  url?: string
  icon?: string
  width?: number
  height?: number
  title?: string
  progress?: number
  loading?: boolean
  isFocused?: boolean
  canGoBack?: boolean
  isVisible?: boolean
  canGoForward?: boolean
  base?: BaseWindow
  container?: WebContentsView
  panel?: WebContentsView
  children?: PanelInterface[]
  split?: 'none' | 'horizontal' | 'vertical'
}

export const panels: PanelInterface[] = []

// export const createArgs = ({
//   index = 0,
//   title = 'New Edgeless Tab',
//   url = '',
//   icon = '',
//   loading = true,
//   progress = 0,
//   canGoBack = false,
//   canGoForward = false,
//   isFocused = true,
//   width = 100,
//   isVisible = true,
//   split = 'horizontal',
//   children = []
// }: PanelInterface) => {
//   const newPanel = {
//     id: uid(12),
//     index,
//     title,
//     url,
//     icon,
//     loading,
//     progress,
//     canGoBack,
//     canGoForward,
//     isFocused,
//     width,
//     isVisible,
//     split,
//     children
//   }

//   panels.push(newPanel)

//   return newPanel
// }

export const createPanel = (props: PanelInterface) => {
  const attributes = {
    x: 0,
    y: 0,
    id: uid(12),
    title: 'New Edgeless Tab',
    url: process.env['ELECTRON_RENDERER_URL'] + '#page=default-page',
    icon: '',
    loading: false,
    progress: 0,
    canGoBack: false,
    canGoForward: false,
    isFocused: true,
    width: 100,
    height: 100,
    isVisible: true,
    split: 'none',
    ...props
  }

  const base = attributes.base || null
  const container = attributes.container || null

  if (!base || !container) {
    throw new Error('Base window and container are required')
  }

  const panel = new WebContentsView({
    webPreferences: {
      nodeIntegration: false
    }
  })

  panel.setBorderRadius(6)

  panel.setBackgroundColor('#475569')
  panel.webContents.userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'

  // contextMenu({
  //   window: panel.webContents,
  //   showSaveImageAs: true,
  //   showInspectElement: true,
  //   showSearchWithGoogle: true
  // })

  base.contentView.addChildView(panel)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    panel.webContents.loadURL(attributes.url)
  } else {
    panel.webContents.loadFile(join(__dirname, '../renderer/index.html#page=default-page'))
  }

  panel.setBounds({
    x: attributes.x,
    y: attributes.y,
    width: attributes.width,
    height: attributes.height
  })

  panel.webContents.on('focus', () => {
    container.webContents.send('panel:focused', { name: attributes.id })
  })

  panel.webContents.on('page-title-updated', () => {
    const title = panel.webContents.getTitle()
    container.webContents.send('PANEL:UPDATE', { id: attributes.id, title })
  })

  panel.webContents.on('update-target-url', () => {
    const url = panel.webContents.getURL()
    container.webContents.send('PANEL:UPDATE', { id: attributes.id, url })
  })

  panel.webContents.on('dom-ready', () => {
    panel.setBackgroundColor('#ffffff')
    panel.webContents.insertCSS(resetCss())
  })

  return { panel, ...attributes }
}
