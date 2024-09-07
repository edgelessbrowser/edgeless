import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

import BrowserEvents from "../utils/browserEvents";

function ViewPanel(props: { width: number; name: string; active: boolean }) {
  let tabRef: HTMLDivElement | undefined;

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

  const [isActiveWindow, setIsActiveWindow] = createSignal(false);

  const [widthPercent, setWidthPercent] = createSignal("100%");

  const updateBounds = () => {
    if (tabRef) {
      const bounds = tabRef.getBoundingClientRect();
      const formattedBounds = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
      setTabBounds(formattedBounds);
      BrowserEvents.send("tab:seperator", {
        ...formattedBounds,
        name: props.name,
      });
    }
  };

  onMount(() => {
    if (tabRef) {
      // Call updateBounds initially to set initial bounds
      updateBounds();

      // Create a ResizeObserver to watch for changes in the size of the div
      const resizeObserver = new ResizeObserver(() => {
        updateBounds();
      });

      // Start observing the element
      if (tabRef) {
        resizeObserver.observe(tabRef);
      }

      // Cleanup the observer when the component is unmounted
      onCleanup(() => {
        resizeObserver.disconnect();
      });
    }
  });

  createEffect(() => {
    setWidthPercent(`${props.width}%`);
  });

  createEffect(() => {
    setIsActiveWindow(props.active);
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
        ref={(el) => (tabRef = el)}
      >
        <p class="text-xs mb-2">{widthPercent()}</p>
        <pre class="text-xs">{JSON.stringify(tabBounds(), null, 2)}</pre>
      </div>
      {isActiveWindow() && (
        <div class="absolute top-0 left-0 right-0 -mt-1.5 px-0.5 select-none">
          <div class="bg-slate-400/80 hover:bg-slate-400 h-1 rounded"></div>
        </div>
      )}
    </div>
  );
}

export default ViewPanel;
