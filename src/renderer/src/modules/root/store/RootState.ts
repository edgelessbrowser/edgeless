import { OSName, Theme, Architecture } from '@renderer/shared/types'
import { createSignal, createRoot } from 'solid-js'

function RootState() {
  const [osName, setOsName] = createSignal<OSName>(OSName.Unknown)

  const [theme, setTheme] = createSignal<Theme>(Theme.Slate)

  const [architecture, setArchitecture] = createSignal<Architecture>(Architecture.Unknown)

  const [edglessVersion, setEdglessVersion] = createSignal<string>('stocholm-alpha')

  const [isMaximized, setIsMaximized] = createSignal<boolean>(false)

  return {
    osName,
    setOsName,

    architecture,
    setArchitecture,

    edglessVersion,
    setEdglessVersion,

    theme,
    setTheme,

    isMaximized,
    setIsMaximized
  }
}

export default createRoot(RootState)
