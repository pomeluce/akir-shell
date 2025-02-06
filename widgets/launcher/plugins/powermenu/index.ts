import { Variable, exec } from 'astal';
import { bash, dependencies } from 'core/lib/os';
import { Plugin } from '../plugin';
import PowerMenu from './PowerMenu';
import Uptime from './Uptime';
import options from '../../options';

export type Btn = 'shutdown' | 'logout' | 'reboot' | 'sleep';

export default function powermenu(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const { powermenu } = options;
  const buttons = ['shutdown', 'logout', 'reboot', 'sleep'];

  const filter = Variable(buttons);

  return {
    description: 'Shutdown and go sleepy time',
    icon: Uptime(),
    ui: PowerMenu(filter),
    search(search) {
      bash`echo "${buttons.join('\n')}" | fzf -f "${search}"`.then(out => out && filter.set(out.split('\n'))).catch(() => {});
    },
    enter(entered) {
      bash`echo "${buttons.join('\n')}" | fzf -f "${entered}" | head -n 1`.then(out => out && exec(powermenu[out as Btn]?.get())).catch(() => {});
    },
  };
}
