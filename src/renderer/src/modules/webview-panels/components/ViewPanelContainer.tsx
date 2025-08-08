import { Show } from 'solid-js'
import ViewPanel from './ViewPanel'
import store from '@renderer/store'
import { PanelInterface } from '@renderer/shared/types'

function ViewPanelContainer() {
  return (
    <div class="w-full h-full p-[5px] pt-1">
      <Show when={store.visiblePanel}>
        <ViewPanel panel={store.visiblePanel as PanelInterface} />
      </Show>
    </div>
  )
}

export default ViewPanelContainer
