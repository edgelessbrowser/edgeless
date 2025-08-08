import { onMount } from 'solid-js'
import { JSX } from 'solid-js/jsx-runtime'
import BrowserEvents from '../../../utils/browserEvents'
import store, {
  setBaseWindowSize,
  setFocusedTab,
  updatePanelWithObject
} from '@renderer/store'
import { addNewTab } from '../../webview-panels/utils/panelManagement'

interface EdgelessWindowProps {
  children: JSX.Element
}

function EdgelessWindow({ children }: EdgelessWindowProps) {
  onMount(() => {
    BrowserEvents.on('baseWindow:sizeUpdate', (data) => {
      setBaseWindowSize({
        width: data.width + 'px',
        height: data.height + 'px'
      })
    })

    BrowserEvents.on('panel:focused', (data) => {
      setFocusedTab(data.name)
    })

    BrowserEvents.on('PANEL:UPDATE', (data) => {
      const { id, ...rest } = data
      updatePanelWithObject(id, rest)
    })

    if (store.panels.length === 0) {
      addNewTab()
    }
  })

  return (
    <div
      style={{
        width: store.baseWindowSize.width,
        height: store.baseWindowSize.height
      }}
      class="bg-slate-600 text-white flex flex-col overflow-hidden"
    >
      {children}
    </div>
  )
}

export default EdgelessWindow
