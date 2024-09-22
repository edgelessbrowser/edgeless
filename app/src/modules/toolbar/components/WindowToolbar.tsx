import {
  IconArrowRight,
  IconPlus,
  IconReload,
  IconLayoutSidebar,
  IconCaretDownFilled,
} from "@tabler/icons-solidjs";

import Box from "../../ui/components/Box";
import SidebarState from "../../sidebar/store/SidebarState";
import ViewPanelState from "../../webview-panels/store/ViewPanelState";
import { addNewTab } from "../../webview-panels/utils/webViewManagement";
import BrowserEvents from "../../../utils/browserEvents";

function WindowToolbar() {
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const el = e.target as HTMLFormElement;
    const value = el.querySelector("input")?.value;
    ViewPanelState.updateActivePanel("url", value);

    const activePanel = ViewPanelState.getVisiblePanel();
    BrowserEvents.send("PANEL:LOAD_URL", {
      id: activePanel?.id,
      url: value,
    });
  };

  return (
    <Box class="text-center flex items-center justify-center gap-3 h-11 win-drag py-1">
      <button
        title="Toggle Sidebar"
        class="p-1 win-no-drag hover:bg-slate-700 rounded mt-1 h-9"
        onClick={SidebarState.toggleSidebar}
      >
        <IconLayoutSidebar stroke="1.5" />
      </button>

      <button
        title="Toggle Sidebar"
        class="p-1 win-no-drag hover:bg-slate-700 rounded mt-1 h-9 px-1.5"
        onClick={SidebarState.toggleSidebar}
      >
        <IconReload stroke="1.5" />
      </button>
      <form
        class="w-3/6 h-full py-0.5 win-no-drag flex relative"
        onSubmit={handleSubmit}
      >
        <input
          class="h-9 w-full text-slate-100 pl-3 pr-10 text-sm rounded bg-slate-700 outline-none"
          type="text"
          value={ViewPanelState.getActiveUrl()}
        />

        <button
          class="p-1 win-no-drag hover:bg-slate-700 rounded absolute right-0 mt-0.5 mr-1 text-slate-400 hover:text-slate-300"
          title="Search"
          type="submit"
        >
          <IconArrowRight stroke="2" />
        </button>
      </form>
      <Box class="win-no-drag">
        <button
          class="p-1 win-no-drag hover:bg-slate-700 rounded mt-1 h-9 px-1.5"
          title="Add new tab"
          onClick={addNewTab}
        >
          <IconPlus stroke="1.5" />
        </button>

        <button
          class="p-1 win-no-drag hover:bg-slate-700 rounded mt-1 h-9 px-2.5"
          title="Add new tab"
          onClick={addNewTab}
        >
          <IconCaretDownFilled stroke="1.5" class="w-4" />
        </button>
      </Box>
    </Box>
  );
}

export default WindowToolbar;
