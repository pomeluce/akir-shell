import BT from 'gi://AstalBluetooth';
import { Plugin } from '../plugin';
import BluetoothIcon from './BluetoothIcon';
import Bluetooth from './Bluetooth';
import { Variable, exec } from 'astal';
import { bash, dependencies } from 'core/lib/os';

export default function bluetooth(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const bt = BT.get_default();
  const names = () => bt.get_devices().map(d => d.name.toLowerCase());
  const filter = Variable(names());

  return {
    icon: BluetoothIcon(),
    ui: Bluetooth(filter),
    description: 'Connect to Bluetooth devices',
    search(search) {
      bash`echo "${names().join('\n')}" | fzf -f "${search}"`.then(out => out && filter.set(out.split('\n') as Array<Lowercase<string>>)).catch(() => {});
    },
    enter() {},
    complete(search) {
      const res = exec(['bash', '-c', `cat ${names()} | fzf -f "${search}" | head -n 1`]);
      return res === search ? '' : res;
    },
  };
}
