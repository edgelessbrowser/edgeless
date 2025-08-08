export enum Architecture {
  x86 = 'x86',
  x64 = 'x64',
  arm = 'arm',
  arm64 = 'arm64',
  Unknown = 'Unknown'
}

export enum OSName {
  Windows = 'Windows',
  Mac = 'Mac',
  Linux = 'Linux',
  Unknown = 'Unknown'
}

export enum Theme {
  Light = 'Light',
  Dark = 'Dark',
  Slate = 'Slate'
}

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
