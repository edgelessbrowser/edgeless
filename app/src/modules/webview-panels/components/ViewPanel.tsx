import BrowserEvents from "../../../utils/browserEvents";
import ViewPanelState, { PanelInterface } from "../store/ViewPanelState";
import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

function ViewPanel(props: { panel?: PanelInterface }) {
  let panelRef: HTMLDivElement | undefined;

  const [tabBounds, setTabBounds] = createSignal<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [widthPercent, setWidthPercent] = createSignal("100%");
  const [isFocusedPanel, setIsFocusedPanel] = createSignal(false);

  const updateBounds = () => {
    if (panelRef) {
      const bounds = panelRef.getBoundingClientRect();
      const formattedBounds = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
      setTabBounds(formattedBounds);
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
      class="h-full relative mt-0.5"
      style={{
        width: widthPercent(),
      }}
    >
      <div
        class="bg-slate-700 p-4 min-w-52 w-full h-full"
        ref={(el) => (panelRef = el)}
      >
        <p class="text-xs mb-2">{widthPercent()}</p>
        <pre class="text-xs">{JSON.stringify(tabBounds(), null, 2)}</pre>
        <p class="mt-4">Panel State</p>
        <pre class="text-xs">
          {JSON.stringify(ViewPanelState.panels, null, 2)}
        </pre>
      </div>
      {isFocusedPanel() && (
        <div class="absolute top-0 left-0 right-0 -mt-1.5 px-0.5 select-none">
          <div class="bg-slate-400/80 hover:bg-slate-400 h-1 rounded"></div>
        </div>
      )}
    </div>
  );
}

export default ViewPanel;
