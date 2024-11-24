import Box from '../../ui/components/Box'
import Sidebar from '../../sidebar/components/Sidebar'
import WindowToolbar from '../../toolbar/components/WindowToolbar'
import EdgelessWindow from '../../window/components/EdgelessWindow'
import ViewPanelContainer from '../../webview-panels/components/ViewPanelContainer'
import useEvents from '../../../hooks/useEvents'
import RootState from '../store/RootState'
import { Architecture, OSName, Theme } from '@renderer/shared/types'

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
    channel: 'BROWSER:GET_IS_MAXIMIZE',
    broadcast: false,
    callback: (data) => {
      RootState.setIsMaximized(data)
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
