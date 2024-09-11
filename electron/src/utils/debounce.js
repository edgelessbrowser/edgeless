export function debounce(handler, delay) {
  let timeout;

  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler.apply(this, args);
    }, delay);
  };
}