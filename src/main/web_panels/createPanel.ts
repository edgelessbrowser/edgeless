import { uid } from 'uid'
import { join } from 'node:path'
import { is } from '@electron-toolkit/utils'
import { Menu, BaseWindow, WebContentsView } from 'electron'

function resetCss() {
  return ''
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
  panelWindow?: WebContentsView
  children?: PanelInterface[]
  split?: 'none' | 'horizontal' | 'vertical'
}

export const panels: PanelInterface[] = []

export function removePanel(id: string): boolean {
  const index = panels.findIndex((panel) => panel.id === id)
  if (index === -1) {
    return false
  }
  panels.splice(index, 1)
  return true
}

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
    split: 'none' as 'none' | 'horizontal' | 'vertical',
    ...props
  }

  const base = attributes.base || null
  const container = attributes.container || null

  if (!base || !container) {
    throw new Error('Base window and container are required')
  }

  const panel = new WebContentsView({
    // webPreferences: {
    //   nodeIntegration: false,
    //   contextIsolation: true,
    //   sandbox: true,
    //   experimentalFeatures: true
    // }

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      enableBlinkFeatures: 'ExecutionContext',
      // enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      offscreen: false,
      experimentalFeatures: true,
      safeDialogs: true,
      safeDialogsMessage: 'Are you sure?',
      additionalArguments: [],
      nodeIntegrationInSubFrames: false,
      nodeIntegrationInWorker: false,
      webviewTag: false,
      plugins: false,
      scrollBounce: false,
      spellcheck: true
    }
  })

  panel.setBorderRadius(4)

  panel.setBackgroundColor('#475569')

  let currentMousePosition = { x: 120, y: 140 }

  const contextMenuTemplate = [
    {
      label: 'Reload',
      click: () => panel.webContents.reload()
    },
    {
      label: 'Open DevTools',
      click: () => panel.webContents.openDevTools()
    },
    {
      label: 'Inspect Element',
      click: () => panel.webContents.inspectElement(currentMousePosition.x, currentMousePosition.y)
    }
  ]

  const contextMenu = Menu.buildFromTemplate(contextMenuTemplate)

  panel.webContents.on('context-menu', (event, params) => {
    currentMousePosition = { x: params.x, y: params.y }
    contextMenu.popup()
  })

  // base.contentView.addChildView(panel)
  // base.contentView.removeChildView(panel)

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

  const panelItem = { panelWindow: panel, ...attributes }

  panels.push(panelItem)

  return panelItem
}
