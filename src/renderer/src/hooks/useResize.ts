import { createSignal, onCleanup, onMount } from "solid-js";

function useResize<T extends HTMLElement>(
  callback: (rect: DOMRect) => void,
  debounceDelay: number = 100
) {
  let ref: T | null = null;
  let timeoutId: number | null = null;

  const handleResize = () => {
    if (!ref) return;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      const rect = ref.getBoundingClientRect();
      callback(rect);
    }, debounceDelay);
  };

  const setRef = (el: T) => {
    ref = el;

    if (ref) {
      // Run initially to send the first rect info
      handleResize();
    }
  };

  onMount(() => {
    window.addEventListener("resize", handleResize);

    onCleanup(() => {
      window.removeEventListener("resize", handleResize);
      if (timeoutId) clearTimeout(timeoutId);
    });
  });

  return setRef;
}

export default useResize;

/*
  - Usage:


import { createSignal } from "solid-js";
import useResize from "./useResize";

const ResizableComponent = () => {
  const [rect, setRect] = createSignal<DOMRect | null>(null);

  const handleResize = (newRect: DOMRect) => {
    setRect(newRect);
  };

  const ref = useResize<HTMLDivElement>(handleResize, 200); // 200ms debounce delay

  return (
    <div>
      <div ref={ref} style={{ width: "100%", height: "200px", background: "lightblue" }}>
        Resize me!
      </div>
      {rect() && (
        <pre>
          {JSON.stringify(rect(), null, 2)}
        </pre>
      )}
    </div>
  );
};

export default ResizableComponent;
*/
