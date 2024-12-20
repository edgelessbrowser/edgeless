import { createSignal, createRoot } from 'solid-js'

function EdgelessWindowState() {
  const [baseWindowSize, setBaseWindowSize] = createSignal({
    width: '100vw',
    height: '100vh'
  })

  return { baseWindowSize, setBaseWindowSize }
}

export default createRoot(EdgelessWindowState)
