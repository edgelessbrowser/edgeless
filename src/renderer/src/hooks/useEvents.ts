import { onCleanup } from 'solid-js'
import BrowserEvents from '../utils/browserEvents'

type BrowserMessageCallback = (...args: any[]) => void

interface UseEventsInterface {
  payload?: any
  channel: string
  broadcast?: boolean
  listenOnce?: boolean
  invoke?: boolean
  callback: BrowserMessageCallback
}

function useEvents({
  channel,
  callback,
  broadcast,
  payload,
  invoke = false,
  listenOnce = false
}: UseEventsInterface) {
  const listener: BrowserMessageCallback = (...args) => {
    callback(...args)
  }

  if (invoke) {
    BrowserEvents.invoke(channel, payload).then((data) => {
      callback(data)
    })
  } else {
    if (broadcast) {
      BrowserEvents.send(channel, payload)
    }

    if (listenOnce) {
      BrowserEvents.once(channel, listener)
    } else {
      BrowserEvents.on(channel, listener)
    }
  }

  onCleanup(() => {
    BrowserEvents.removeListener(channel, listener)
  })
}

export default useEvents
