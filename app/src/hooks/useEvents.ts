import { onCleanup } from "solid-js";
import BrowserEvents from "../utils/browserEvents";

type BrowserMessageCallback = (...args: any[]) => void;

interface UseEventsInterface {
  channel: string;
  broadcast?: boolean;
  payload?: any;
  callback: BrowserMessageCallback;
}

function useEvents({
  channel,
  callback,
  broadcast,
  payload,
}: UseEventsInterface) {
  const listener: BrowserMessageCallback = (...args) => {
    callback(...args);
  };

  if (broadcast) {
    BrowserEvents.send(channel, payload);
  }

  BrowserEvents.on(channel, listener);

  onCleanup(() => {
    BrowserEvents.removeListener(channel, listener);
  });
}

export default useEvents;
