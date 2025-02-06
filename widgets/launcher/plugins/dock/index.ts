import { Variable } from 'astal';
import { Plugin } from '../plugin';
import Apps from 'gi://AstalApps';
import options from '../../options';
import Dock from './Dock';
import DockIcon from './DockIcon';

const { display } = options.dock;

export default function dock(): Plugin {
  const list = Variable<Apps.Application[]>([]);
  const apps = new Apps.Apps();

  function populate() {
    const show = display.get();
    list.set(typeof show === 'number' ? apps.get_list().slice(0, show) : show.map(f => apps.exact_query(f)[0]));
  }

  return {
    ui: Dock(list),
    icon: DockIcon(),
    search() {},
    enter() {},
    reload: populate,
  };
}
