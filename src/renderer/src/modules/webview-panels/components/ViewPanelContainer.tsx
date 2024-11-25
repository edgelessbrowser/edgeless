import ViewPanel from './ViewPanel'
import Resizable from '@corvu/resizable'
import ViewPanelState from '../store/ViewPanelState'

function ResizeHandle() {
  return (
    <Resizable.Handle aria-label="Resize panels" class="group basis-1.5">
      <div
        class={`
          group-active:bg-slate-500 group-dragging:bg-slate-500
          size-full select-none 
          bg-slate-600 hover:bg-slate-500/40 transition-colors rounded-lg
        `}
      />
    </Resizable.Handle>
  )
}

function ViewPanelContainer() {
  return (
    <div class="flex w-full h-full p-1.5 pt-1">
      <Resizable class="size-full">
        <Resizable.Panel minSize="250px">
          <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
        </Resizable.Panel>
        <ResizeHandle />
        <Resizable.Panel minSize="250px">
          <Resizable class="size-full" orientation="vertical">
            <Resizable.Panel minSize="200px">
              <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
            </Resizable.Panel>
            <ResizeHandle />
            <Resizable.Panel minSize="200px">
              <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
            </Resizable.Panel>
          </Resizable>
        </Resizable.Panel>
      </Resizable>
    </div>
  )
}

export default ViewPanelContainer
