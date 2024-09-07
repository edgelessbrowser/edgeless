import { createSignal, createRoot } from "solid-js";

function State() {
  const [viewSidebar, setViewSidebar] = createSignal(true);
  const toggleSidebar = () => setViewSidebar(!viewSidebar());

  return { viewSidebar, toggleSidebar };
}

export const SidebarState = createRoot(State);

function Sidebar() {
  const { viewSidebar } = SidebarState;

  return (
    <div
      class="flex-shrink-0 border-r-0 border-r-slate-500 transition-[width,opacity] duration-200 transform-gpu mr-0"
      style={{
        width: viewSidebar() ? "260px" : "0px",
        opacity: viewSidebar() ? 1 : 0,
        "user-select": viewSidebar() ? "auto" : "none",
      }}
    >
      sidebar
    </div>
  );
}

export default Sidebar;
