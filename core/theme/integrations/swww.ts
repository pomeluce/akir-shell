import { execAsync } from 'astal/process';
import { Gio, monitorFile, readFile, writeFile } from 'astal/file';
import { dependencies, sh } from '../../lib/os';
import { debounce } from '../../lib/function';
import options from 'options';
import { interval } from 'astal';

const WP = `${CACHE}/wallpaper`;
const { enable, wp, fps, interval: time } = options.theme.swww;
const enabled = enable.get;

function wps() {
  const dir = Gio.file_new_for_path(wp.get());
  const enums = dir.enumerate_children('standard::*', Gio.FileQueryInfoFlags.NONE, null);
  const names: string[] = [];

  let fileInfo: Gio.FileInfo | null;
  while ((fileInfo = enums.next_file(null)) !== null) {
    names.push(fileInfo.get_name());
  }
  enums.close(null);

  return names.sort();
}

function setWp(wp: string) {
  writeFile(WP, JSON.stringify(wp));
}

function getWp(): string {
  const file = Gio.file_new_for_path(WP);
  return file.query_exists(null) ? JSON.parse(readFile(WP)) : '';
}

async function run(name: string) {
  if (!enabled() || !dependencies('swww')) return;
  const pos = await sh(`hyprctl cursorpos`);
  return sh(`swww img --transition-type grow --transition-fps ${fps.get()} --transition-pos ${pos.replace(' ', '')} ${wp.get()}/${name}`);
}

async function wallpaper() {
  const names = wps();
  let index = names.indexOf(getWp()) !== -1 ? names.indexOf(getWp()) : 0;

  const state = () => {
    const name = names[index];
    run(name).then(v => print(v));
    setWp(name);
    index = (index + 1) % names.length;
  };

  state();

  interval(time.get() * 1000, state);
}

export default {
  async init() {
    if (!enabled() || !dependencies('swww-daemon')) return;

    execAsync('swww-daemon').catch(() => void 0);

    wallpaper().catch(printerr);

    monitorFile(wp.get(), debounce(5, wallpaper));

    options.theme.swww.enable.subscribe(v => {
      void (
        v &&
        execAsync('swww-daemon')
          .then(wallpaper)
          .catch(() => void 0)
      );
    });
  },
};
