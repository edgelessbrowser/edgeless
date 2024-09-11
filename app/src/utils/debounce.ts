function debounce<T extends (...args: any[]) => any>(handler: T, delay: number) {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>): void {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      handler.apply(this, args);
    }, delay);
  };
}

export default debounce;