import type { Plugin } from '../plugin';
import { dependencies, ls, bash, mkdir } from 'core/lib/os';
import { Variable } from 'astal';
import options from '../../options';
import DarkMode from './DarkMode';
import Wallpaper from './Wallpaper';
import { setWallpaper } from 'core/theme/integrations/swww';

export default function sh(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const dir = mkdir(options.theme.wallpapers.directory.get());
  const filter = Variable<Array<string>>([]);

  return {
    description: 'Set the wallpaper',
    icon: DarkMode(),
    ui: Wallpaper({
      wallpapers: ls(dir).map(f => `${dir}/${f}`),
      filter,
    }),
    search(search: string) {
      if (!search) return filter.set([]);

      bash`echo "${ls(dir).join('\n')}" | fzf -f "${search}"`.then(out => filter.set(out.split('\n').map(f => `${dir}/${f}`))).catch(() => filter.set([]));
    },
    enter(entered: string) {
      if (!entered) return;

      bash`echo "${ls(dir).join('\n')}" | fzf -f "${entered}" | head -n 1`.then(out => setWallpaper(`${dir}/${out}`)).catch(() => 0);
    },
  };
}
