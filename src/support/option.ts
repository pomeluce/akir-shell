import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { Accessor, Setter } from 'gnim';
import { monitorFile, readFile, writeFile } from 'ags/file';
import { mkdir } from './os';

export class AccessorOption<T = unknown> extends Accessor<T> {
  id = '';

  initial: T;
  set: Setter<T>;

  constructor(initial: T) {
    let currentValue = initial;
    super(get, subscribe);

    function get() {
      return currentValue;
    }
    const subscribers = new Set<() => void>();
    function subscribe(callback: () => void): () => void {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    }
    function set(newValue: unknown): void {
      const value: T = typeof newValue === 'function' ? newValue(currentValue) : newValue;
      if (!Object.is(currentValue, value)) {
        currentValue = value;
        Array.from(subscribers).forEach(cb => cb());
      }
    }
    this.initial = initial;
    this.set = set;
  }

  toString = () => `${this.peek()}`;
  toJSON = () => this.peek();

  init(cacheFile: string) {
    const cacheV = parse(cacheFile)[this.id];
    if (cacheV !== undefined) this.set(cacheV);
  }

  reset() {
    if (JSON.stringify(this.peek()) !== JSON.stringify(this.initial)) {
      this.set(this.initial);
      return this.id;
    }
    return undefined;
  }
}

function parse(cacheFile: string): any {
  try {
    return JSON.parse(readFile(cacheFile) || '{}');
  } catch (error) {
    printerr(error, cacheFile);
    return {};
  }
}

export function opt<T = unknown>(initial: T) {
  return new AccessorOption<T>(initial);
}

function getOptions(object: Record<string, any>, path = ''): AccessorOption<any>[] {
  return Object.keys(object).flatMap(key => {
    const obj = object[key];
    const id = path ? path + '.' + key : key;
    if (obj instanceof AccessorOption) {
      obj.id = id;
      return obj;
    }
    if (typeof obj === 'object' && obj !== null) return getOptions(obj, id);
    return [];
  });
}

export function mkOptions<T extends object>(name: string, object: T) {
  const options = getOptions(object);
  const cacheFile = `${CONFIG}/${name}.json`;
  mkdir(CONFIG);

  // ensure file exists
  if (!GLib.file_test(cacheFile, GLib.FileTest.EXISTS)) {
    writeFile(
      cacheFile,
      JSON.stringify(
        options.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.peek() }), {}),
        null,
        2,
      ),
    );
  }

  // init from file
  for (const opt of options) opt.init(cacheFile);

  // monitor file and update options
  monitorFile(cacheFile, (_, event) => {
    if (event === Gio.FileMonitorEvent.CHANGED) {
      const config = parse(cacheFile);
      for (const opt of options) {
        if (config[opt.id] !== undefined) {
          opt.set(config[opt.id]);
        } else {
          opt.reset();
        }
      }
    }
  });

  const opts = Object.assign(object, {
    opts: () => options,
    reset: () => options.map(opt => opt.reset()).filter(Boolean) as (string | undefined)[],
    set(id: string, value: any) {
      const config = parse(cacheFile);
      let rawId = id;
      if (id.startsWith(name)) rawId = id.replace(`${name}.`, '');
      config[rawId] = value;
      const target = opts.get(rawId);
      if (target) target.set(value);
      writeFile(cacheFile, JSON.stringify(config, null, 2));
    },
    get(id: string) {
      let rawId = id;
      if (id.startsWith(name)) rawId = id.replace(`${name}.`, '');
      return options.find(opt => opt.id === rawId);
    },
    subscribe(callback: () => void) {
      const unsub = options.map(opt => opt.subscribe(callback));
      return () => unsub.forEach(fn => fn());
    },
  });

  return opts;
}
