import { createSignal, createMemo, For, Show, onMount } from 'solid-js'
import type { Component } from 'solid-js'

export interface TreeItem {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: TreeItem[]
}

interface TreeProps {
  data: TreeItem[] // The hierarchical data to render
  activeId?: string // The currently active item (7)
}

// Helper function to find an item's parent chain to expand
function findItemPath(data: TreeItem[], id: string): string[] | null {
  // Depth-first search for the item with the matching id
  for (const item of data) {
    if (item.id === id) {
      return [id]
    }
    if (item.children) {
      const path = findItemPath(item.children, id)
      if (path) {
        return [item.id, ...path]
      }
    }
  }
  return null
}

const Tree: Component<TreeProps> = (props) => {
  // (2) Collapsible/expandable folders:
  // We maintain a set of expanded folder ids in a signal
  const [expandedFolders, setExpandedFolders] = createSignal<Set<string>>(new Set())

  // (6) Pass the active item from props
  // We store the active item for reference in styling
  const activeId = () => props.activeId ?? ''

  // Pre-expand folders if the activeId is nested
  // (7) For nested active items, ensure parents are expanded
  onMount(() => {
    if (activeId()) {
      const path = findItemPath(props.data, activeId())
      if (path) {
        const newSet = new Set(expandedFolders())
        // Remove the last item from the path because we only want to expand
        // the parent folders, not the file itself (if it is a file).
        // If it’s a folder, that’s fine too—this ensures it’s expanded if it's the active folder.
        path.forEach((id) => {
          newSet.add(id)
        })
        setExpandedFolders(newSet)
      }
    }
  })

  // Toggle a folder's expanded/collapsed state
  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const copy = new Set(prev)
      if (copy.has(id)) {
        copy.delete(id)
      } else {
        copy.add(id)
      }
      return copy
    })
  }

  // (1) Support for nested folders and files with unlimited depth:
  // We'll create a recursive component to handle each item.
  const RenderTreeItem: Component<{ item: TreeItem; level: number }> = (props) => {
    const isFolder = createMemo(() => props.item.type === 'folder')
    const isExpanded = createMemo(() => expandedFolders().has(props.item.id))
    const isActive = createMemo(() => props.item.id === activeId())

    // Keyboard navigation:
    // - ArrowUp / ArrowDown: Move between items
    // - ArrowRight: Expand if folder
    // - ArrowLeft: Collapse if folder or move up a level
    const onKeyDown = (e: KeyboardEvent) => {
      // For demonstration, we handle minimal navigation.
      // In a complete solution you would keep track of a focusable list of items
      // and move focus accordingly.
      if (isFolder()) {
        if (e.key === 'ArrowRight') {
          setExpandedFolders((prev) => {
            const copy = new Set(prev)
            copy.add(props.item.id)
            return copy
          })
        } else if (e.key === 'ArrowLeft') {
          setExpandedFolders((prev) => {
            const copy = new Set(prev)
            copy.delete(props.item.id)
            return copy
          })
        }
      }
    }

    return (
      <div>
        {/* (3) Visual distinction between files and folders 
            (4) Proper indentation for nested items 
            (8) Hover, focus states 
        */}
        <div
          class="flex items-center cursor-pointer px-2 py-1 transition-colors 
                 hover:bg-slate-700/60 focus:bg-slate-700 rounded outline-none"
          style={{ 'padding-left': `${props.level * 1.25}rem` }}
          tabIndex={0} // Make each item focusable
          onKeyDown={onKeyDown}
          onClick={() => isFolder() && toggleFolder(props.item.id)}
          classList={{
            'bg-slate-700': isActive() // Active highlight
          }}
        >
          {/* (3) Show icons for files/folders */}
          <Show
            when={isFolder()}
            fallback={
              // File icon
              <svg
                class="w-4 h-4 mr-2 text-slate-500"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            }
          >
            {/* Folder icon - change based on expanded/collapsed */}
            <svg
              class={`w-4 h-4 mr-2 transition-transform text-slate-300 ${
                isExpanded() ? 'rotate-90' : ''
              }`}
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 7h4l2 3h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" />
            </svg>
          </Show>
          {/* (5) Smooth expand/collapse animations will happen to the nested items container below,
              but here's the label of the current item. */}
          <span class="text-slate-300 text-sm">{props.item.name}</span>
        </div>
        {/* Render children if folder is expanded */}
        <Show when={isFolder() && isExpanded()}>
          <div class="overflow-hidden transition-all duration-200">
            <For each={props.item.children}>
              {(child) => <RenderTreeItem item={child} level={props.level + 1} />}
            </For>
          </div>
        </Show>
      </div>
    )
  }

  return (
    <div class="w-full text-left text-sm">
      {/* (4) & (5) We'll use a top-level container. The actual indentation is handled in the item. */}
      <For each={props.data}>{(item) => <RenderTreeItem item={item} level={0} />}</For>
    </div>
  )
}

export default Tree
