declare global {
  interface Window {
    EDGELESS_GLOBAL_BRIDGE: {
      send: (channel: string, data?: any) => void
      on: (channel: string, func: (...args: any[]) => void) => void
      once: (channel: string, func: (...args: any[]) => void) => void
      removeListener: (channel: string, func: (...args: any[]) => void) => void
    }
  }
}

const BrowserEvents = window.EDGELESS_GLOBAL_BRIDGE

export default BrowserEvents
