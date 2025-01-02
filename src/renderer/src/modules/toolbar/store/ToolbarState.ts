import { createSignal, createRoot } from 'solid-js'
import BrowserEvents from '@renderer/utils/browserEvents'
import RootState from '@renderer/modules/root/store/RootState'
import { OSName } from '@renderer/shared/types'

function ToolbarState() {
  const [viewToolbar, setViewToolbar] = createSignal(true)
  const toggleToolbar = () => {
    const nextToolbarState = !viewToolbar()

    if (RootState.osName() === OSName.Mac) {
      BrowserEvents.send('baseWindow:toggleTrafficLights', {
        nextToolbarState
      })
    }

    setViewToolbar(nextToolbarState)
  }

  return { viewToolbar, toggleToolbar }
}

export default createRoot(ToolbarState)
