import { onCleanup } from 'solid-js'
import BrowserEvents from '../utils/browserEvents'

type BrowserMessageCallback = (...args: any[]) => void

interface UseEventsInterface {
  payload?: any
  channel: string
  broadcast?: boolean
  listenOnce?: boolean
  callback: BrowserMessageCallback
}

function useEvents({
  channel,
  callback,
  broadcast,
  payload,
  listenOnce = false
}: UseEventsInterface) {
  const listener: BrowserMessageCallback = (...args) => {
    callback(...args)
  }

  if (broadcast) {
    BrowserEvents.send(channel, payload)
  }

  if (listenOnce) {
    BrowserEvents.once(channel, listener)
  } else {
    BrowserEvents.on(channel, listener)
  }

  onCleanup(() => {
    BrowserEvents.removeListener(channel, listener)
  })
}

export default useEvents
