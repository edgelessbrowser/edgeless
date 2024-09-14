import Box from "../../ui/components/Box";
import SidebarState from "../../sidebar/store/SidebarState";
import { addNewTab } from "../../webview-panels/utils/webViewManagement";
import { IconPlus, IconLayoutSidebar } from "@tabler/icons-solidjs";

function WindowToolbar() {
  return (
    <Box class="text-center flex items-center justify-center gap-4 h-11 win-drag py-1">
      <button
        title="Toggle Sidebar"
        class="p-1 win-no-drag hover:bg-slate-700 rounded"
        onClick={SidebarState.toggleSidebar}
      >
        <IconLayoutSidebar stroke="1.5" />
      </button>
      <input
        class="w-3/6 h-full text-slate-100 px-3 text-sm p-1 pb-1.5 win-no-drag rounded bg-slate-700"
        value=""
        type="text"
      />
      <Box class="win-no-drag">
        <button
          class="p-1 win-no-drag hover:bg-slate-700 rounded"
          title="Add new tab"
          onClick={addNewTab}
        >
          <IconPlus stroke="1.5" />
        </button>
      </Box>
    </Box>
  );
}

export default WindowToolbar;
