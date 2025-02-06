import type { Plugin } from '../plugin';
import Network from 'gi://AstalNetwork';
import { Variable } from 'astal';
import { dependencies, bash } from 'core/lib/os';
import options from '../../options';
import Wifi from './Wifi';
import WifiIcon from './WifiIcon';

export default function sh(): Plugin {
  if (!dependencies('fzf')) {
    throw Error('missing dependency: fzf');
  }

  const { maxItems } = options.wifi;
  const nw = Network.get_default();
  const ssids = () => nw.wifi.get_access_points().map(ap => ap.ssid);
  const networks = Variable(ssids());

  nw.wifi.scan();

  return {
    description: 'List of available wifi networks',
    icon: WifiIcon(),
    ui: Wifi(networks),
    search(search: string) {
      if (!search) networks.set(ssids().slice(maxItems.get()));

      bash`echo "${ssids().join('\n')}" | fzf -f "${search}" | head -n ${maxItems.get()}`
        .then(str => networks.set(str.split('\n')))
        .catch(err => {
          print(err);
          networks.set([]);
        });
    },
    enter() {
      print(networks.get()[0]);
    },
  };
}
