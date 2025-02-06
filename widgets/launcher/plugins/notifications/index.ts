import Notifd from 'gi://AstalNotifd';
import { Variable } from 'astal';
import { Plugin } from '../plugin';
import Notifications from './Notifications';
import NotifButton from './NotifButton';
import { dependencies, bash } from 'core/lib/os';

export default function notifications(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const filter = Variable<Array<string>>([]);
  const apps = () =>
    Notifd.get_default()
      .get_notifications()
      .map(n => n.appName.toLowerCase())
      .join('\n');

  return {
    description: `List of notifications`,
    icon: NotifButton(),
    ui: Notifications(filter),
    search(search) {
      bash`echo "${apps()}" | fzf -f "${search}"`.then(out => out && filter.set(out.split('\n'))).catch(() => {});
    },
    enter() {},
  };
}
