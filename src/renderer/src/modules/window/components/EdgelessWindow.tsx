import { onMount } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import BrowserEvents from '../../../utils/browserEvents'
import EdgelessWindowState from '../store/EdgelessWindowState'
import ViewPanelState from '../../webview-panels/store/ViewPanelState'
import { addNewTab } from '../../webview-panels/utils/webViewManagement'

interface EdgelessWindowProps {
  children: JSX.Element
}

function EdgelessWindow({ children }: EdgelessWindowProps) {
  onMount(() => {
    BrowserEvents.on('baseWindow:sizeUpdate', (data) => {
      EdgelessWindowState.setBaseWindowSize({
        width: data.width + 'px',
        height: data.height + 'px'
      })
    })

    BrowserEvents.on('panel:focused', (data) => {
      ViewPanelState.setFocusedTab(data.name)
    })

    BrowserEvents.on('PANEL:UPDATE', (data) => {
      const { id, ...rest } = data
      ViewPanelState.updatePanelWithObject(id, rest)
    })

    addNewTab()
  })

  return (
    <div
      style={{
        width: EdgelessWindowState.baseWindowSize().width,
        height: EdgelessWindowState.baseWindowSize().height
      }}
      class="bg-slate-600 text-white flex flex-col overflow-hidden"
    >
      {children}
    </div>
  )
}

export default EdgelessWindow
