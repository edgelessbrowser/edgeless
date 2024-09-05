import { createSignal, onMount, onCleanup, createEffect } from "solid-js";

import BrowserEvents from "../utils/browserEvents";

function ViewPanel(props: { width: number; name: string }) {
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
      console.log("Updated Bounds:", formattedBounds); // Log new bounding client rect
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

  return (
    <div
      class="bg-slate-700 p-4 min-w-52"
      style={{
        width: widthPercent(),
      }}
      ref={(el) => (tabRef = el)}
    >
      <p class="text-xs mb-2">{widthPercent()}</p>
      <pre class="text-xs">{JSON.stringify(tabBounds(), null, 2)}</pre>
    </div>
  );
}

export default ViewPanel;
