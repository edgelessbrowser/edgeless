import { onMount } from 'solid-js'
import Box from '../../ui/components/Box'
import useEvents from '../../../hooks/useEvents'
import Sidebar from '../../sidebar/components/Sidebar'
import WindowToolbar from '../../toolbar/components/WindowToolbar'
import EdgelessWindow from '../../window/components/EdgelessWindow'
import { Architecture, OSName, Theme } from '@renderer/shared/types'
import ViewPanelContainer from '../../webview-panels/components/ViewPanelContainer'
import store, {
  addPanel,
  setArchitecture,
  setIsMaximized,
  setOsName,
  setTheme,
  toggleSidebar,
  toggleToolbar
} from '@renderer/store'
import BrowserEvents from '@renderer/utils/browserEvents'

export default function RootView() {
  onMount(async () => {
    const systemInfo = await BrowserEvents.invoke('BROWSER:GET_SYSTEM_INFO')
    setOsName(OSName[systemInfo.osName as keyof typeof OSName])
    setTheme(Theme[systemInfo.systemTheme as keyof typeof Theme])
    setArchitecture(Architecture[systemInfo.architecture as keyof typeof Architecture])
    setIsMaximized(systemInfo.isMaximized)

    const panels = await BrowserEvents.invoke('PANEL:GET_ALL')
    if (panels.length === 0) {
      addPanel({})
    }
  })

  useEvents({
    channel: 'BROWSER:GET_IS_MAXIMIZE',
    broadcast: false,
    callback: (data) => {
      setIsMaximized(data)
    }
  })

  useEvents({
    channel: 'PANEL:REQUEST_CREATE_NEW',
    callback: ({ url }) => {
      addPanel({ url })
    }
  })

  useEvents({
    channel: 'baseWindow:toogleToolbar',
    callback: () => {
      toggleToolbar()
    }
  })

  useEvents({
    channel: 'baseWindow:toogleSidebar',
    callback: () => {
      toggleSidebar()
    }
  })

  return (
    <EdgelessWindow>
      <WindowToolbar />

      <Box class="flex h-full">
        <Sidebar />
        <ViewPanelContainer />
      </Box>
    </EdgelessWindow>
  )
}
