import Variable from 'astal/variable';
import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { readFile, writeFile, monitorFile } from 'astal/file';
import { mkdir } from './os';

export class Opt<T = unknown> extends Variable<T> {
  constructor(initial: T) {
    super(initial);
    this.initial = initial;
  }

  initial: T;
  id = '';

  toString = () => `${this.get()}`;
  toJSON = () => this.get();
  get = () => super.get();

  /**
   * DO NOT call this explicitly
   * use the cli or the set fn on the object returned by {@link mkOptions}
   */
  set = (value: T) => {
    if (JSON.stringify(this.get()) !== JSON.stringify(value)) {
      super.set(value);
    }
  };

  init(cacheFile: string) {
    const cacheV = parse(cacheFile)[this.id];
    if (cacheV !== undefined) this.set(cacheV);
  }

  reset() {
    if (JSON.stringify(this.get()) !== JSON.stringify(this.initial)) {
      this.set(this.initial);
      return this.id;
    }
  }
}

function getOptions(object: Record<string, any>, path = ''): Opt[] {
  return Object.keys(object).flatMap(key => {
    const obj = object[key];
    const id = path ? path + '.' + key : key;
    if (obj instanceof Opt) {
      obj.id = id;
      return obj;
    }
    if (typeof obj === 'object') return getOptions(obj, id);
    return [];
  });
}

export function opt<T>(initial: T) {
  return new Opt(initial);
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
  // ensure file exists, so that .init does not fail
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

  for (const opt of options) opt.init(cacheFile);
  // monitor file and update option values
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
    options: () => options,
    reset: () => options.forEach(opt => opt.reset()),
    set(id: string, value: any) {
      const config = parse(cacheFile);
      config[id] = value;
      opts.get(id)?.set(value);
      writeFile(cacheFile, JSON.stringify(config, null, 2));
    },
    get(id: string) {
      if (id.startsWith(name)) id = id.replace(`${name}.`, '');
      return options.find(opt => opt.id === id);
    },
    subscribe(callback: () => void) {
      const unsub = options.map(opt => opt.subscribe(callback));
      return () => unsub.map(fn => fn());
    },
  });

  return opts;
}
