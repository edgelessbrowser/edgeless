import { createSignal, createRoot } from 'solid-js'

function SidebarState() {
  const [viewSidebar, setViewSidebar] = createSignal(true)
  const toggleSidebar = () => {
    setViewSidebar(!viewSidebar())
  }

  return { viewSidebar, toggleSidebar }
}

export default createRoot(SidebarState)
