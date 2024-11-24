import {
  IconArrowRight,
  IconPlus,
  IconReload,
  IconLayoutSidebar,
  IconCaretDownFilled,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-solidjs'

import Box from '../../ui/components/Box'
import SidebarState from '../../sidebar/store/SidebarState'
import ViewPanelState from '../../webview-panels/store/ViewPanelState'
import { addNewTab } from '../../webview-panels/utils/webViewManagement'
import BrowserEvents from '../../../utils/browserEvents'
import ToolbarButton from './ToolbarButton'
import ToolbarState from '../store/ToolbarState'
import WindowControlButtons from './WindowControlButtons'

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
        <ToolbarButton class="pr-2">
          <IconChevronLeft class="w-5 h-5" stroke="2" />
        </ToolbarButton>

        <ToolbarButton>
          <IconChevronRight class="w-5 h-5" stroke="2" />
        </ToolbarButton>
      </Box>

      <ToolbarButton onClick={SidebarState.toggleSidebar}>
        <IconLayoutSidebar class="w-5 h-5" stroke="2" />
      </ToolbarButton>

      <ToolbarButton onClick={handleReload}>
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
        <ToolbarButton onClick={addNewTab}>
          <IconPlus class="w-5 h-5" stroke="2" />
        </ToolbarButton>

        <ToolbarButton>
          <IconCaretDownFilled class="w-4 h-4" stroke="2" />
        </ToolbarButton>
      </Box>

      <WindowControlButtons />
    </Box>
  )
}

export default WindowToolbar
