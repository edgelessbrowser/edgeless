declare global {
  interface Window {
    ___ebp___: {
      send: (channel: string, data?: any) => void
      on: (channel: string, func: (...args: any[]) => void) => void
      once: (channel: string, func: (...args: any[]) => void) => void
      removeListener: (channel: string, func: (...args: any[]) => void) => void
    }
  }
}

const BrowserEvents = window.___ebp___

export default BrowserEvents
