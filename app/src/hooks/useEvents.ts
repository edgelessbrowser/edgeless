import { onCleanup } from "solid-js";
import BrowserEvents from "../utils/browserEvents";

type BrowserMessageCallback = (...args: any[]) => void;

function useEvents(channel: string, callback: BrowserMessageCallback) {
  const listener: BrowserMessageCallback = (...args) => {
    callback(...args);
  };

  BrowserEvents.on(channel, listener);

  onCleanup(() => {
    BrowserEvents.removeListener(channel, listener);
  });
}

export default useEvents;
