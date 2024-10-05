import useEvents from "../../../hooks/useEvents";
import BrowserEvents from "../../../utils/browserEvents";
import SidebarState from "../../sidebar/store/SidebarState";
import ToolbarState from "../../toolbar/store/ToolbarState";
import ViewPanelState, { PanelInterface } from "../store/ViewPanelState";
import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

function ViewPanel(props: { panel?: PanelInterface }) {
  let panelRef: HTMLDivElement | undefined;

  const [widthPercent, setWidthPercent] = createSignal("100%");
  const [isFocusedPanel, setIsFocusedPanel] = createSignal(false);

  useEvents({
    channel: "baseWindow:toogleToolbar",
    callback: () => {
      ToolbarState.toggleToolbar();
    },
  });

  useEvents({
    channel: "baseWindow:toogleSidebar",
    callback: () => {
      SidebarState.toggleSidebar();
    },
  });

  const updateBounds = () => {
    if (panelRef) {
      const bounds = panelRef.getBoundingClientRect();
      const formattedBounds = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };

      BrowserEvents.send("PANEL:BOUND_UPDATE", {
        ...formattedBounds,
        id: props.panel?.id,
      });
    }
  };

  onMount(() => {
    if (panelRef) {
      updateBounds();
      const resizeObserver = new ResizeObserver(updateBounds);
      if (panelRef) {
        resizeObserver.observe(panelRef);
      }
      onCleanup(() => {
        resizeObserver.disconnect();
      });
    }
  });

  createEffect(() => {
    setWidthPercent(`${props.panel?.width}%`);
  });

  createEffect(() => {
    if (ViewPanelState.highlightFocusedPanel()) {
      setIsFocusedPanel(props.panel?.isFocused ?? false);
    }
  });

  return (
    <div
      class="h-full relative"
      style={{
        width: widthPercent(),
      }}
    >
      <div
        class="bg-slate-700 p-4 min-w-52 w-full h-full"
        ref={(el) => (panelRef = el)}
      />
      {isFocusedPanel() && (
        <div class="absolute top-0 left-0 right-0 -mt-1.5 px-0.5 select-none">
          <div class="bg-slate-400/80 hover:bg-slate-400 h-1 rounded"></div>
        </div>
      )}
    </div>
  );
}

export default ViewPanel;
