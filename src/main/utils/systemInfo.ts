import os from 'os'
import { nativeTheme } from 'electron'

export const getOsName = (): string => {
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

export const getSystemTheme = (): 'Dark' | 'Light' =>
  nativeTheme.shouldUseDarkColors ? 'Dark' : 'Light'

export const getArchitecture = (): string => {
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
