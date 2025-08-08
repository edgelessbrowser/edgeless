import { createStore } from 'solid-js/store'
import { OSName, Theme, Architecture } from '@renderer/shared/types'
import { PanelInterface } from '@renderer/shared/types'
import BrowserEvents from '@renderer/utils/browserEvents'

const initPanel = ({
  id,
  title = 'New Tab',
  url = '',
  icon = '',
  loading = true,
  progress = 0,
  canGoBack = false,
  canGoForward = false,
  isFocused = true,
  width = 100,
  isVisible = true,
  split = 'horizontal'
}: PanelInterface) => {
  return {
    id,
    title,
    url,
    icon,
    loading,
    progress,
    canGoGoBack: canGoBack,
    canGoForward,
    isFocused,
    width,
    isVisible,
    split
  }
}

const [store, setStore] = createStore({
  osName: OSName.Unknown,
  theme: Theme.Slate,
  architecture: Architecture.Unknown,
  edgelessVersion: 'stocholm-alpha',
  isMaximized: false,
  panels: [] as PanelInterface[],
  tabWidth: 100,
  focuedTab: '',
  viewToolbar: true,
  viewSidebar: true,

  get visiblePanel(): PanelInterface | undefined {
    return this.panels.find((panel) => panel.isVisible)
  },

  get activeUrl(): string | undefined {
    return this.visiblePanel?.url
  },

  highlightFocusedPanel() {
    return this.panels.length > 1
  }
})

export const addPanel = async ({ url }: { url?: string }) => {
  const newPanel = await BrowserEvents.invoke('PANEL:CREATE', url ? { url } : {})
  const containerPanel = initPanel({
    id: newPanel.id,
    url
  })

  setStore('panels', (panels) => [...panels, containerPanel])
}

export const removePanel = (id: string) => {
  setStore('panels', (panels) => panels.filter((panel) => panel.id !== id))
}

export const updatePanel = (id: string, columnName: any, columnValue: any) => {
  setStore('panels', (panel) => panel.id === id, columnName, columnValue)
}

export const updatePanelWithObject = (id: string, data: any) => {
  setStore('panels', (panel) => panel.id === id, data)
}

export const updateActivePanel = (columnName: any, columnValue: any) => {
  if (store.visiblePanel) {
    updatePanel(store.visiblePanel.id || '', columnName, columnValue)
  }
}

export const setAsVisible = (id: string) => {
  if (store.visiblePanel) {
    updatePanel(store.visiblePanel.id || '', 'isVisible', false)
  }

  updatePanel(id, 'isVisible', true)
}

export const setOsName = (osName: OSName) => setStore('osName', osName)
export const setTheme = (theme: Theme) => setStore('theme', theme)
export const setArchitecture = (architecture: Architecture) => setStore('architecture', architecture)
export const setEdgelessVersion = (version: string) => setStore('edgelessVersion', version)
export const setIsMaximized = (isMaximized: boolean) => setStore('isMaximized', isMaximized)
export const setTabWidth = (width: number) => setStore('tabWidth', width)
export const setFocusedTab = (id: string) => setStore('focuedTab', id)

export const toggleToolbar = () => setStore('viewToolbar', (v) => !v)
export const toggleSidebar = () => setStore('viewSidebar', (v) => !v)

export default store
