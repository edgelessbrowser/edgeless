import { For, Show } from "solid-js";
import SidebarState from "../store/SidebarState";
import { IconActivity } from "@tabler/icons-solidjs";
import ViewPanelState from "../../webview-panels/store/ViewPanelState";
import Box from "../../ui/components/Box";
import { IconX } from "@tabler/icons-solidjs";
import { removeTab } from "../../webview-panels/utils/webViewManagement";

function Sidebar() {
  return (
    <div
      class="flex-shrink-0 border-r-0 border-r-slate-500 transition-[width,opacity] duration-200 transform-gpu mr-0"
      style={{
        width: SidebarState.viewSidebar() ? "260px" : "0px",
        opacity: SidebarState.viewSidebar() ? 1 : 0,
        "user-select": SidebarState.viewSidebar() ? "auto" : "none",
      }}
    >
      <div class="flex flex-col gap-1 mx-2 w-[250px] mt-1">
        <For each={ViewPanelState.panels}>
          {(panel) => (
            <div
              class={`
                group select-none flex items-center justify-between px-4 h-8 mr-1.5 rounded 
                ${
                  panel.isVisible ? "bg-slate-700" : "bg-slate-700/30"
                } hover:bg-slate-700/80 active:bg-slate-700 cursor-pointer 
                relative
              `}
              onClick={() => {
                ViewPanelState.setAsVisible(panel.id ?? "");
              }}
            >
              <p class="text-xs">{panel.title}</p>
              <button
                title="Close Tab"
                class="rounded h-6 w-6 pl-1 hover:bg-slate-800/60 group-hover:block hidden"
                onClick={() => {
                  if (panel.id) {
                    removeTab(panel.id);
                  }
                }}
              >
                <IconX width="16" stroke="2" class="text-slate-400" />
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Sidebar;
