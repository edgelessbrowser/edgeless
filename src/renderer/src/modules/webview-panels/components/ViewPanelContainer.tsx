import { For, Show, createEffect, createSignal } from 'solid-js'
import ViewPanel from './ViewPanel'
import Resizable from '@corvu/resizable'
import ViewPanelState, { PanelInterface } from '../store/ViewPanelState'

function ResizeHandle() {
  return (
    <Resizable.Handle aria-label="Resize panels" class="group basis-[5px]">
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
  const [visiblePanel, setVisiblePanel] = createSignal<PanelInterface | undefined>(undefined)

  createEffect(() => {
    setVisiblePanel(ViewPanelState.getVisiblePanel())
  })

  return (
    <div class="w-full h-full p-[5px] pt-1">
      {/* <For each={ViewPanelState.panels}>{(panel) => <ViewPanel panel={panel} />}</For> */}
      {/* {visiblePanel() ? <ViewPanel panel={visiblePanel()} /> : null} */}
      <Show when={visiblePanel() !== undefined}>
        <ViewPanel panel={visiblePanel() as PanelInterface} />
      </Show>
    </div>
  )

  // return ViewPanelState.panels.length ? (
  //   <div class="flex w-full h-full p-[5px]">
  //     <For each={ViewPanelState.panels}>{(panel) => <ViewPanel panel={panel} />}</For>
  //   </div>
  // ) : (
  //   <div class="flex w-full h-full p-[5px]">
  //     <For each={ViewPanelState.panels}>{(panel) => <ViewPanel panel={panel} />}</For>
  //   </div>
  // )

  // return (
  //   <div class="flex w-full h-full p-[5px]">
  //     <Resizable class="size-full border-2">
  //       <Resizable.Panel>
  //         <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
  //       </Resizable.Panel>
  //       <ResizeHandle />
  //       <Resizable.Panel minSize="250px">
  //         <Resizable class="size-full" orientation="vertical">
  //           <Resizable.Panel minSize="200px">
  //             <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
  //           </Resizable.Panel>
  //           <ResizeHandle />
  //           <Resizable.Panel minSize="200px">
  //             <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
  //           </Resizable.Panel>
  //         </Resizable>
  //       </Resizable.Panel>
  //     </Resizable>
  //   </div>
  // )
}

export default ViewPanelContainer
