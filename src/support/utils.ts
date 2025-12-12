import { Accessor, createComputed } from 'gnim';

export function tmpl(strings: TemplateStringsArray, ...values: (Accessor<any> | string | number | boolean)[]) {
  const deps = values.filter(v => v instanceof Accessor);
  const indexes = deps.map(d => values.indexOf(d));

  const evaluate = () => {
    let v = 0;
    const val = (i: number) => (indexes.includes(i) ? deps[v++]() : (values[i] ?? ''));
    return strings
      .flatMap((str, i) => {
        const v = val(i);
        return str + `${String(v instanceof Accessor ? v() : v)}`;
      })
      .join('');
  };

  return createComputed(evaluate);
}

export function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? '0' : '';
  return `${min}:${sec0}${sec}`;
}

type StyleNode = undefined | boolean | string | Record<string, boolean | undefined | null>;

export function cnames(...arg: Array<StyleNode>): string {
  const names = arg.flatMap(item => {
    if (item && typeof item === 'string') {
      return item;
    }

    if (typeof item === 'object') {
      return Object.entries(item)
        .filter(([, v]) => v)
        .map(([name]) => name);
    }

    return null;
  });

  return names.filter(Boolean).join(' ');
}

export function fake<T>(value: T | Accessor<T>): Accessor<T> {
  if (value instanceof Accessor) return value;
  else {
    const subscribers = new Set<() => void>();
    const subscribe = (callback: () => void) => {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    };
    return new Accessor(() => value, subscribe);
  }
}
