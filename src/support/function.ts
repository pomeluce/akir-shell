import { timeout } from 'ags/time';

export function throttle<T extends (...args: any[]) => any>(ms: number, callback: T) {
  let last = 0;
  return (...args: Parameters<T>) => {
    const now = new Date().getTime();
    if (now - last >= ms) {
      last = now;
      callback(...args);
    }
  };
}

export function debounce<R, T extends (...args: any[]) => R>(ms: number, callback: T) {
  let time: ReturnType<typeof timeout>;

  return function (...args: Parameters<T>): Promise<R | null> {
    if (time) time.cancel();

    time = timeout(ms);

    return new Promise(res => {
      time.connect('now', () => res(callback(...args)));
      time.connect('cancelled', () => res(null));
    });
  };
}

export function sleep(ms: number) {
  return new Promise(res => timeout(ms, () => res(null)));
}
