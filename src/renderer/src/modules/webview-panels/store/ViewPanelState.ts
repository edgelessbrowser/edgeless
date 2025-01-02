import { createStore } from 'solid-js/store'
import { createSignal, createRoot } from 'solid-js'
import BrowserEvents from '@renderer/utils/browserEvents'

export interface PanelInterface {
  id?: string
  title?: string
  url?: string
  icon?: string
  loading?: boolean
  progress?: number
  canGoBack?: boolean
  canGoForward?: boolean
  isFocused?: boolean
  width?: number
  isVisible?: boolean
  split?: 'horizontal' | 'vertical'
  children?: PanelInterface[]
}

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
    canGoBack,
    canGoForward,
    isFocused,
    width,
    isVisible,
    split
  }
}

function ViewPanelState() {
  const [tabWidth, setTabWidth] = createSignal(100)
  const [focuedTab, setFocusedTab] = createSignal('')

  const [panels, setPanels] = createStore<PanelInterface[]>([])

  const addPanel = async () => {
    const newPanel = await BrowserEvents.invoke('PANEL:CREATE')
    const containerPanel = initPanel({
      id: newPanel.id
    })

    setPanels(panels.length, containerPanel)
  }

  const removePanel = (id: string) => {
    setPanels((panels) => panels.filter((panel) => panel.id !== id))
  }

  const updatePanel = (id: string, columnName: any, columnValue: any) => {
    setPanels((panel) => panel.id === id, columnName, columnValue)
  }

  const updatePanelWithObject = (id: string, data: any) => {
    setPanels((panel) => panel.id === id, data)
  }

  const updateActivePanel = (columnName: any, columnValue: any) => {
    const activePanel = getVisiblePanel()
    if (activePanel) {
      updatePanel(activePanel.id || '', columnName, columnValue)
    }
  }

  const setAsVisible = (id: string) => {
    const visiblePanel = getVisiblePanel()
    if (visiblePanel) {
      updatePanel(visiblePanel.id || '', 'isVisible', false)
    }

    updatePanel(id, 'isVisible', true)
  }

  const getActiveUrl = () => {
    const activePanel = getVisiblePanel()
    return activePanel?.url
  }

  const highlightFocusedPanel = () => {
    // return panels.length > 1;
    return false
  }

  const getVisiblePanel = (): PanelInterface | undefined => {
    return panels.find((panel) => panel.isVisible)
  }

  return {
    panels,
    addPanel,
    tabWidth,
    focuedTab,
    setTabWidth,
    removePanel,
    updatePanel,
    setAsVisible,
    getActiveUrl,
    setFocusedTab,
    getVisiblePanel,
    updateActivePanel,
    updatePanelWithObject,
    highlightFocusedPanel
  }
}

export default createRoot(ViewPanelState)
