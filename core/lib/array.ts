export function range(length: number): Array<number>;
export function range(start: number, end: number): Array<number>;
export function range(start: number, end?: number): Array<number> {
  if (typeof end === 'number') return Array.from({ length: end - start + 1 }, (_, i) => i + start);

  return Array.from({ length: start }, (_, i) => i);
}

export function chunks<T>(size: number, arr: T[]): T[][] {
  const result = [] as T[][];
  for (let i = 0; i < arr.length; i += size) {
    const chunk = arr.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

export function fill<T>(size: number, arr: T[], fill: (i: number) => T) {
  while (size > arr.length) {
    arr.push(fill(arr.length));
  }
  return arr;
}
