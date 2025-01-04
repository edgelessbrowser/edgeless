import { createEffect } from 'solid-js'
import Box from '../../ui/components/Box'

export default function DefaultPage() {
  createEffect(() => {
    document.title = 'New Tab'
  })

  return (
    <Box
      class={`
      w-full h-screen flex justify-center items-center flex-col 
      text-sm text-white bg-slate-700
    `}
    >
      <h1 class="font-bold text-4xl text-slate-800/70 select-none pointer-events-none">
        Eon Browser
      </h1>
    </Box>
  )
}
