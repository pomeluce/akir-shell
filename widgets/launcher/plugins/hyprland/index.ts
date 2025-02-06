import { App } from 'astal/gtk3';
import Hyprland from 'gi://AstalHyprland';
import { Variable } from 'astal';
import { dependencies, bash } from 'core/lib/os';
import { Plugin } from '../plugin';
import HyprlandClients from './HyprlandClients';

export default function hyprland(): Plugin {
  if (!dependencies('fzf')) throw Error('missing dependency: fzf');

  const hyprland = Hyprland.get_default();

  if (!hyprland) {
    console.error('could not connect to Hyprland');
    App.quit();
  }

  const filter = Variable([] as string[]);

  const titles = () =>
    hyprland
      .get_clients()
      .sort((a, b) => a.workspace.id - b.workspace.id)
      .map(c => c.title!)
      .join('\n');

  function setFilter(arr: string[]) {
    if (JSON.stringify(arr) !== JSON.stringify(filter.get())) filter.set(arr);
  }

  return {
    description: 'Hyprland running clients',
    ui: HyprlandClients(filter),
    icon: 'window-close',
    search(search) {
      bash`echo "${titles()}" | fzf -f "${search}"`.then(out => setFilter(out == '' ? [] : out.split('\n'))).catch(() => setFilter([]));
    },
    enter({ search }) {
      bash`echo "${titles()}" | fzf -f "${search}" | head -n 1`
        .then(title => {
          hyprland
            .get_clients()
            .find(c => c.title == title)
            ?.focus();
          App.get_window('launcher')!.visible = false;
        })
        .catch(() => {});
    },
  };
}
