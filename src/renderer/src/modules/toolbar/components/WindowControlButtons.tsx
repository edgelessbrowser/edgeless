import RootState from '@renderer/modules/root/store/RootState'
import Box from '@renderer/modules/ui/components/Box'
import { OSName } from '@renderer/shared/types'
import BrowserEvents from '@renderer/utils/browserEvents'
import { IconMinus, IconSquare, IconSquares, IconX } from '@tabler/icons-solidjs'

import { Component, JSX, Show } from 'solid-js'

type WindowButtonProps = {
  onClick: () => void
  variant: 'windows' | 'linux'
  isClose?: boolean
  children: JSX.Element
}

const WindowButton: Component<WindowButtonProps> = (props) => {
  const baseStyles = `
    group
    flex items-center justify-center 
    transition-[color, backgroundColor] duration-200 transform-gpu 
    ${props.isClose ? 'hover:bg-red-600 active:bg-red-500' : 'hover:bg-slate-500 active:bg-slate-400'}
  `

  const buttonStyle = () =>
    props.variant === 'linux'
      ? `
    border border-slate-500 w-7 h-7 rounded-full  
  `
      : 'flex-1 flex-wrap h-8'

  return (
    <div onClick={props.onClick} class={`${baseStyles} ${buttonStyle()}`}>
      {props.children}
    </div>
  )
}

export default function WindowControlButtons() {
  return (
    <>
      <Show when={RootState.osName() === OSName.Windows}>
        <WindowsOs />
      </Show>

      <Show when={RootState.osName() === OSName.Linux}>
        <LinuxOs />
      </Show>

      <Show when={RootState.osName() === OSName.Mac}>
        <MacOs />
      </Show>
    </>
  )
}

function WindowsOs() {
  return (
    <Box class="win-no-drag absolute top-0 right-0 bottom-0 w-[115px]">
      <Box class="flex">
        {/* Minimise */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:MINIMIZE')} variant="windows">
          <IconMinus class="w-4.5 h-5 text-white" stroke="1.5" />
        </WindowButton>

        {/* Maximize/Restore */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:MAXIMIZE')} variant="windows">
          <Show
            when={RootState.isMaximized()}
            fallback={<IconSquare class="w-4 h-3.5 text-white" stroke="1.5" />}
          >
            <IconSquares class="w-4 h-3.5 text-white rotate-90" stroke="1.5" />
          </Show>
        </WindowButton>

        {/* Close */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:CLOSE')} variant="windows" isClose>
          <IconX class="w-4.5 h-5 text-white" stroke="1.5" />
        </WindowButton>
      </Box>
    </Box>
  )
}

function LinuxOs() {
  return (
    <Box class="win-no-drag absolute top-0 right-0 bottom-0 w-[110px]">
      <Box class="flex h-full items-center justify-around pr-1">
        {/* Minimise */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:MINIMIZE')} variant="linux">
          <IconMinus class="w-4 h-4 text-slate-300 group-hover:text-white" stroke="2" />
        </WindowButton>

        {/* Maximize/Restore */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:MAXIMIZE')} variant="linux">
          <Show
            when={RootState.isMaximized()}
            fallback={
              <IconSquare class="w-4 h-3.5 text-slate-300 group-hover:text-white" stroke="1.5" />
            }
          >
            <IconSquares
              class="w-4 h-3.5 text-slate-300 group-hover:text-white rotate-90"
              stroke="1.5"
            />
          </Show>
        </WindowButton>

        {/* Close */}
        <WindowButton onClick={() => BrowserEvents.send('BROWSER:CLOSE')} variant="linux" isClose>
          <IconX class="w-4 h-4 text-slate-300 group-hover:text-white" stroke="1.5" />
        </WindowButton>
      </Box>
    </Box>
  )
}

function MacOs() {
  return null
}
