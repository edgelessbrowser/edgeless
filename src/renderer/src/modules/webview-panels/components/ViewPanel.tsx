import BrowserEvents from '../../../utils/browserEvents'
import ViewPanelState, { PanelInterface } from '../store/ViewPanelState'
import { createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import PanelBorder from './PanelBorder'

function ViewPanel(props: { panel: PanelInterface }) {
  let panelContainerRef: HTMLDivElement | undefined

  const [widthPercent, setWidthPercent] = createSignal('100%')
  const [isFocusedPanel, setIsFocusedPanel] = createSignal(false)

  const updateBounds = () => {
    if (panelContainerRef) {
      const bounds = panelContainerRef.getBoundingClientRect()

      const formattedBounds = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        panelId: props.panel.id
      }

      BrowserEvents.send('PANEL:BOUND_UPDATE', formattedBounds)
    }
  }

  onMount(() => {
    if (panelContainerRef) {
      updateBounds()
      const resizeObserver = new ResizeObserver(updateBounds)
      if (panelContainerRef) {
        resizeObserver.observe(panelContainerRef)
      }
      onCleanup(() => {
        resizeObserver.disconnect()
      })
    }
  })

  createEffect(() => {
    setWidthPercent(`${props.panel?.width}%`)
  })

  createEffect(() => {
    if (ViewPanelState.highlightFocusedPanel()) {
      setIsFocusedPanel(props.panel?.isFocused ?? false)
    }
  })

  return (
    <PanelBorder active={props.panel.isVisible || false}>
      <div
        class="h-full relative"
        style={{
          width: widthPercent()
        }}
      >
        <div
          class="bg-slate-700 p-4 min-w-52 w-full h-full rounded-md"
          ref={(el) => (panelContainerRef = el)}
        />
        {isFocusedPanel() && (
          <div class="absolute top-0 left-0 right-0 -mt-1.5 px-0.5 select-none">
            <div class="bg-slate-400/80 hover:bg-slate-400 h-1 rounded"></div>
          </div>
        )}
      </div>
    </PanelBorder>
  )
}

export default ViewPanel
