import Box from '../../ui/components/Box'
import RootState from '../store/RootState'
import useEvents from '../../../hooks/useEvents'
import Sidebar from '../../sidebar/components/Sidebar'
import WindowToolbar from '../../toolbar/components/WindowToolbar'
import EdgelessWindow from '../../window/components/EdgelessWindow'
import { Architecture, OSName, Theme } from '@renderer/shared/types'
import ToolbarState from '@renderer/modules/toolbar/store/ToolbarState'
import SidebarState from '@renderer/modules/sidebar/store/SidebarState'
import ViewPanelState from '@renderer/modules/webview-panels/store/ViewPanelState'
import ViewPanelContainer from '../../webview-panels/components/ViewPanelContainer'

export default function RootView() {
  useEvents({
    channel: 'BROWSER:GET_SYSTEM_INFO',
    broadcast: true,
    callback: (data: {
      osName: string
      systemTheme: string
      architecture: string
      isMaximized: boolean
    }) => {
      RootState.setIsMaximized(data.isMaximized)
      RootState.setOsName(OSName[data.osName as keyof typeof OSName])
      RootState.setTheme(Theme[data.systemTheme as keyof typeof Theme])
      RootState.setArchitecture(Architecture[data.architecture as keyof typeof Architecture])
    }
  })

  useEvents({
    invoke: true,
    channel: 'PANEL:GET_ALL',
    callback: (data) => {
      if (data.length === 0) {
        ViewPanelState.addPanel()
      }
    }
  })

  useEvents({
    channel: 'BROWSER:GET_IS_MAXIMIZE',
    broadcast: false,
    callback: (data) => {
      RootState.setIsMaximized(data)
    }
  })

  useEvents({
    channel: 'baseWindow:toogleToolbar',
    callback: () => {
      ToolbarState.toggleToolbar()
    }
  })

  useEvents({
    channel: 'baseWindow:toogleSidebar',
    callback: () => {
      SidebarState.toggleSidebar()
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
