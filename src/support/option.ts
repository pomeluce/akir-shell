import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { Accessor, Setter, createState } from 'gnim';
import { monitorFile, readFile, writeFile } from 'ags/file';
import { mkdir } from './os';

export class Opt<T = unknown> {
  initial: T;
  id = '';

  private accessor: Accessor<T>;
  private setter: Setter<T>;

  constructor(initial: T) {
    this.initial = initial;
    const [a, s] = createState(initial) as [Accessor<T>, Setter<T>];
    this.accessor = a;
    this.setter = s;
    return this;
  }

  toString = () => `${this.get()}`;
  toJSON = () => this.get();

  get value() {
    return this.accessor;
  }

  get() {
    return this.accessor.get();
  }

  /**
   * DO NOT call this explicitly
   * use the cli or the set fn on the object returned by {@link mkOptions}
   */
  set(value: T | ((prev: T) => T)) {
    if (JSON.stringify(this.get()) !== JSON.stringify(value)) {
      value instanceof Function ? this.setter(value) : this.setter(value);
    }
  }

  subscribe(cb: () => void) {
    return this.accessor.subscribe(cb);
  }

  init(cacheFile: string) {
    const cacheV = parse(cacheFile)[this.id];
    if (cacheV !== undefined) this.set(cacheV);
  }

  reset() {
    if (JSON.stringify(this.get()) !== JSON.stringify(this.initial)) {
      this.set(this.initial);
      return this.id;
    }
    return undefined;
  }
}

export function opt<T = unknown>(initial: T): Opt<T> & (() => Accessor<T>) {
  const option = new Opt<T>(initial);
  const fn = () => option.value;
  return new Proxy(fn, {
    get(_target, prop, _receiver) {
      const v = (option as any)[prop];
      return typeof v === 'function' ? v.bind(option) : v;
    },
    set(_target, prop, value) {
      (option as any)[prop] = value;
      return true;
    },
    apply(_target, _thisArg, _args) {
      return fn.apply(option);
    },
    getPrototypeOf() {
      return Object.getPrototypeOf(option);
    },
  }) as Opt<T> & (() => Accessor<T>);
}

function getOptions(object: Record<string, any>, path = ''): Opt<any>[] {
  return Object.keys(object).flatMap(key => {
    const obj = object[key];
    const id = path ? path + '.' + key : key;
    if (obj instanceof Opt) {
      obj.id = id;
      return obj;
    }
    if (typeof obj === 'object' && obj !== null) return getOptions(obj, id);
    return [];
  });
}

function parse(cacheFile: string): any {
  try {
    return JSON.parse(readFile(cacheFile) || '{}');
  } catch (error) {
    printerr(error, cacheFile);
    return {};
  }
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
        options.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.get() }), {}),
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
