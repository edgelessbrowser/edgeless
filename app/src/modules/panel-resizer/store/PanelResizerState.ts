import { createSignal, createRoot } from "solid-js";

function PanelResizerState() {
  const [isResizing, setIsResizing] = createSignal(false);

  return { isResizing, setIsResizing };
}

export default createRoot(PanelResizerState);
