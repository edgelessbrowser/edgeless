import { For, Show } from "solid-js";
import ViewPanel from "./ViewPanel";
import ViewPanelState from "../store/ViewPanelState";
import PanelResizer from "../../panel-resizer/components/PanelResizer";

function ViewPanelContainer() {
  /*const handleResize = (deltaX: number, tabIndex: number) => {
    const containerWidth = window.innerWidth;

    if (tab === 1) {
      const newTab1Width = Math.max(
        10,
        Math.min(90, tab1Width() + (deltaX / containerWidth) * 100)
      );
      const newTab2Width = Math.max(
        10,
        Math.min(90, tab2Width() - (deltaX / containerWidth) * 100)
      );
      setTab1Width(newTab1Width);
      setTab2Width(newTab2Width);
    } else if (tab === 2) {
      const newTab2Width = Math.max(
        10,
        Math.min(90, tab2Width() + (deltaX / containerWidth) * 100)
      );
      const newTab3Width = Math.max(
        10,
        Math.min(90, tab3Width() - (deltaX / containerWidth) * 100)
      );
      setTab2Width(newTab2Width);
      setTab3Width(newTab3Width);
    }
  };*/

  return (
    <div class="flex w-full h-full">
      <ViewPanel panel={ViewPanelState.getVisiblePanel()} />
      {/* <For each={ViewPanelState.panels}>
        {(panel) => (
          <>
            <ViewPanel
              width={panel.width ?? 100}
              name={(panel.index ?? 0).toString()}
              active={panel.isFocused ?? false}
            />
            <Show when={panel.index ?? 0 < ViewPanelState.panels.length - 1}>
              <PanelResizer
                onResize={(deltaX) => handleResize(deltaX, panel.index ?? 0)}
              />
            </Show>
          </>
        )}
      </For> */}
    </div>
  );
}

export default ViewPanelContainer;
