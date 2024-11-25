import { uid } from 'uid'

export interface PanelInterface {
  id?: string
  index?: number
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

export const panels: PanelInterface[] = []

export const createPanel = ({
  index = 0,
  title = 'New Edgeless Tab',
  url = '',
  icon = '',
  loading = true,
  progress = 0,
  canGoBack = false,
  canGoForward = false,
  isFocused = true,
  width = 100,
  isVisible = true,
  split = 'horizontal',
  children = []
}: PanelInterface) => {
  const newPanel = {
    id: uid(12),
    index,
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
    split,
    children
  }

  panels.push(newPanel)

  return newPanel
}
