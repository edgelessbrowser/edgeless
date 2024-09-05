import { SidebarState } from "./Sidebar";

function TopHeader() {
  return (
    <div class="text-center flex items-center justify-center gap-4 h-11 win-drag py-1">
      <button class="p-1 pl-4 win-no-drag" onClick={SidebarState.toggleSidebar}>
        Toggle Sidebar
      </button>
      <input
        class="w-3/6 h-full text-slate-100 px-3 text-sm p-1 pb-1.5 win-no-drag rounded bg-slate-700"
        value="https://google.com"
        type="text"
      />
      <button class="p-2 win-no-drag">Go</button>
    </div>
  );
}

export default TopHeader;
