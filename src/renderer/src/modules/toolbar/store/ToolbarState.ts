import { createSignal, createRoot } from "solid-js";

function ToolbarState() {
  const [viewToolbar, setViewToolbar] = createSignal(true);
  const toggleToolbar = () => setViewToolbar(!viewToolbar());

  return { viewToolbar, toggleToolbar };
}

export default createRoot(ToolbarState);
