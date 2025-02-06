import { Plugin } from '../plugin';
import { dependencies, bash } from 'core/lib/os';
import { Variable } from 'astal';
import Wp from 'gi://AstalWp';
import Mixer from './Mixer';

export default function bluetooth(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const wp = Wp.get_default()!.audio;
  const names = () => wp.get_streams()!.map(s => s.name.toLowerCase());
  const filter = Variable(names());

  return {
    icon: 'mixer-symbolic',
    ui: Mixer(filter),
    description: 'Audio mixer',
    search(search) {
      bash`echo "${names().join('\n')}" | fzf -f "${search}"`.then(out => out && filter.set(out.split('\n') as Array<Lowercase<string>>)).catch(() => {});
    },
    enter() {},
  };
}
