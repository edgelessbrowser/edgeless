import { onMount } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import BrowserEvents from "../../../utils/browserEvents";
import EdgelessWindowState from "../store/EdgelessWindowState";
import ViewPanelState from "../../webview-panels/store/ViewPanelState";

interface EdgelessWindowProps {
  children: JSX.Element;
}

function EdgelessWindow({ children }: EdgelessWindowProps) {
  onMount(() => {
    BrowserEvents.on("baseWindow:sizeUpdate", (data) => {
      console.log("Received Bounds:", data);
      EdgelessWindowState.setBaseWindowSize({
        width: data.width + "px",
        height: data.height + "px",
      });
    });

    BrowserEvents.on("panel:focused", (data) => {
      ViewPanelState.setFocusedTab(data.name);
    });
  });

  return (
    <div
      style={{
        width: EdgelessWindowState.baseWindowSize().width,
        height: EdgelessWindowState.baseWindowSize().height,
      }}
      class="bg-slate-600 text-white flex flex-col overflow-hidden"
    >
      {children}
    </div>
  );
}

export default EdgelessWindow;
