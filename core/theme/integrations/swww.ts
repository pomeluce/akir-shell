import GLib from 'gi://GLib?version=2.0';
import { execAsync } from 'astal/process';
import { monitorFile } from 'astal/file';
import { dependencies, sh } from '../../lib/os';
import { debounce } from '../../lib/function';
import options from 'options';

export function setWallpaper(wp: string) {
  return sh`cp ${wp} ${GLib.get_user_config_dir()}/background`;
}

const WP = `${GLib.get_user_config_dir()}/background`;
const enabled = options.theme.swww.enable.get;

async function wallpaper() {
  if (!enabled() || !dependencies('swww')) return;
  const pos = await sh(`hyprctl cursorpos`);
  return sh(`swww img --transition-type grow --transition-fps ${options.theme.swww.fps.get()} --transition-pos ${pos.replace(' ', '')} ${WP}`);
}

export default {
  async init() {
    if (!enabled() || !dependencies('swww-daemon')) return;

    await execAsync('swww-daemon').catch(() => void 0);
    await wallpaper().then(v => print(v));

    monitorFile(`${TMP}/background`, debounce(5, wallpaper));

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
