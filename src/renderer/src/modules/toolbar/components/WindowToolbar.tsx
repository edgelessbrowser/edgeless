import {
  IconArrowRight,
  IconPlus,
  IconReload,
  IconLayoutSidebar,
  // IconCaretDownFilled,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-solidjs'
import Box from '@renderer/modules/ui/components/Box'
import BrowserEvents from '@renderer/utils/browserEvents'
import SidebarState from '@renderer/modules/sidebar/store/SidebarState'
import ToolbarState from '@renderer/modules/toolbar/store/ToolbarState'
import ToolbarButton from '@renderer/modules/toolbar/components/ToolbarButton'
import ViewPanelState from '@renderer/modules/webview-panels/store/ViewPanelState'
import WindowControlButtons from '@renderer/modules/toolbar/components/WindowControlButtons'

function WindowToolbar() {
  const handleSubmit = (e: Event) => {
    e.preventDefault()
    const el = e.target as HTMLFormElement
    const value = el.querySelector('input')?.value

    ViewPanelState.updateActivePanel('url', value)

    const activePanel = ViewPanelState.getVisiblePanel()
    BrowserEvents.send('PANEL:LOAD_URL', {
      id: activePanel?.id,
      url: value
    })
  }

  const handleReload = () => {
    const activePanel = ViewPanelState.getVisiblePanel()
    BrowserEvents.send('PANEL:RELOAD', {
      id: activePanel?.id
    })
  }

  return (
    <Box
      class="text-center flex items-center justify-center gap-3 win-drag transition-[height,opacity] duration-200 transform-gpu relative"
      style={{
        height: ToolbarState.viewToolbar() ? '38px' : '0px',
        opacity: ToolbarState.viewToolbar() ? 1 : 0,
        'user-select': ToolbarState.viewToolbar() ? 'auto' : 'none'
      }}
    >
      <Box>
        <ToolbarButton class="pr-2" title="Go back">
          <IconChevronLeft class="w-5 h-5" stroke="2" />
        </ToolbarButton>

        <ToolbarButton title="Go forward">
          <IconChevronRight class="w-5 h-5" stroke="2" />
        </ToolbarButton>
      </Box>

      <ToolbarButton onClick={SidebarState.toggleSidebar} title="Toggle sidebar">
        <IconLayoutSidebar class="w-5 h-5" stroke="2" />
      </ToolbarButton>

      <ToolbarButton onClick={handleReload} title="Reload page">
        <IconReload class="w-5 h-5" stroke="2" />
      </ToolbarButton>

      <form class="w-3/6 h-full py-0.5 win-no-drag flex relative mt-0.5" onSubmit={handleSubmit}>
        <input
          class={`
            group
            text-xs 
            w-full text-slate-100 pl-3 pr-10 rounded outline-none 
            bg-transparent hover:bg-slate-700/60 active:bg-slate-700 focus:bg-slate-700 transition-[background-color] duration-200
          `}
          type="text"
          title="Search or visit a website"
          value={ViewPanelState.getActiveUrl()}
        />

        <button
          class="p-1 win-no-drag rounded absolute right-0 mt-0.5 mr-1 text-slate-400 hover:text-slate-300 transition-[color] duration-200 hidden group-focus:block"
          title="Search"
          type="submit"
        >
          <IconArrowRight stroke="2" />
        </button>
      </form>
      <Box class="win-no-drag">
        <ToolbarButton onClick={ViewPanelState.addPanel} title="New tab">
          <IconPlus class="w-5 h-5" stroke="2" />
        </ToolbarButton>
      </Box>

      <WindowControlButtons />
    </Box>
  )
}

export default WindowToolbar
