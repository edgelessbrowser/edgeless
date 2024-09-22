import { For } from "solid-js";
import SidebarState from "../store/SidebarState";
import ViewPanelState from "../../webview-panels/store/ViewPanelState";
import { IconX } from "@tabler/icons-solidjs";
import { removeTab } from "../../webview-panels/utils/webViewManagement";

function Sidebar() {
  return (
    <div
      class="flex-shrink-0 border-r-0 border-r-slate-500 transition-[width,opacity] duration-200 transform-gpu"
      style={{
        width: SidebarState.viewSidebar() ? "220px" : "0px",
        opacity: SidebarState.viewSidebar() ? 1 : 0,
        "user-select": SidebarState.viewSidebar() ? "auto" : "none",
      }}
    >
      <div class="flex flex-col gap-1 w-[220px] mt-1 h-full">
        <For each={ViewPanelState.panels}>
          {(panel) => (
            <div
              class={`
                group select-none flex items-center justify-between px-2 h-8 ml-1 mr-1.5 rounded 
                ${
                  panel.isVisible ? "bg-slate-700" : "bg-slate-700/30"
                } hover:bg-slate-700/80 active:bg-slate-700 cursor-pointer 
                relative
              `}
              onClick={() => {
                ViewPanelState.setAsVisible(panel.id ?? "");
              }}
            >
              <p class="text-xs truncate">{panel.title}</p>
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
