import { Variable, exec } from 'astal';
import PowerMenu from './PowerMenu';
import Verification from './Verification';
import options from 'options';

export type Btn = 'hibernate' | 'shutdown' | 'logout' | 'reboot' | 'sleep' | 'lockscreen';

export default function powermenu() {
  const label = Variable('');
  const selected = Variable<Btn>('shutdown');

  const labels: Record<Btn, string> = {
    hibernate: 'Hibernate',
    shutdown: 'Shutdown',
    logout: 'Log Out',
    reboot: 'Reboot',
    sleep: 'Sleep',
    lockscreen: 'Lock Screen',
  };

  function onClick(btn: Btn) {
    label.set(labels[btn]);
    selected.set(btn);
    verification.show();
    powermenu.hide();
  }

  function onAccept() {
    exec(options.powermenu[selected.get()].get());
    verification.hide();
  }

  const verification = Verification({ label, onAccept });
  const powermenu = PowerMenu({ onClick });

  Object.assign(globalThis, {
    powermenu: onClick,
  });
}

declare global {
  const powermenu: (btn: Btn) => void;
}
