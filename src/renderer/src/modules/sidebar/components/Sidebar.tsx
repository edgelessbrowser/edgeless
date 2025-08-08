import { For } from 'solid-js'
import Box from '../../ui/components/Box'
import { IconX } from '@tabler/icons-solidjs'
import store, { setAsVisible } from '@renderer/store'
import { removeTab } from '../../webview-panels/utils/webViewManagement'
import Tree, { TreeItem } from '@renderer/components/Tree'

function Sidebar() {
  const sampleData: TreeItem[] = [
    {
      id: '1',
      name: 'Folder 1',
      type: 'folder',
      children: [
        { id: '2', name: 'File A', type: 'file' },
        {
          id: '3',
          name: 'Subfolder',
          type: 'folder',
          children: [
            { id: '4', name: 'File B', type: 'file' },
            { id: '8', name: 'File C', type: 'file' }
          ]
        }
      ]
    },
    {
      id: '5',
      name: 'Folder 2',
      type: 'folder',
      children: [{ id: '6', name: 'File D', type: 'file' }]
    },
    {
      id: '7',
      name: 'Orphan File',
      type: 'file'
    }
  ]

  return (
    <Box
      class="flex-shrink-0 border-r-0 border-r-slate-500 transition-[width,opacity] duration-75 transform-gpu"
      style={{
        width: store.viewSidebar ? '220px' : '0px',
        opacity: store.viewSidebar ? 1 : 0,
        'user-select': store.viewSidebar ? 'auto' : 'none'
      }}
    >
      <Box class="flex flex-col gap-1 w-[220px] mt-1 h-full">
        <For each={store.panels}>
          {(panel) => (
            <Box
              class={`
                group select-none flex items-center justify-between px-2 h-8 ml-1 mr-0 rounded-md 
                ${
                  panel.isVisible
                    ? 'bg-slate-700 border-slate-500 shadow-sm shadow-slate-800/80'
                    : 'bg-slate-700/40 border-slate-500/90 shadow-none'
                } hover:bg-slate-700/90 active:bg-slate-700 cursor-pointer 
                relative border
              `}
              onClick={() => {
                setAsVisible(panel.id ?? '')
              }}
            >
              <p class="text-xs truncate">{panel.title}</p>
              <button
                title="Close Tab"
                class="rounded h-6 w-6 pl-1 hover:bg-slate-800/60 group-hover:block hidden"
                onClick={() => {
                  if (panel.id) {
                    removeTab(panel.id)
                  }
                }}
              >
                <IconX width="16" stroke="2" class="text-slate-400" />
              </button>
            </Box>
          )}
        </For>

        <Box class="pl-1.5">
          <Tree data={sampleData} />
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
