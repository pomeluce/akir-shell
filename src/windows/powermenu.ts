import PowerMenu from '@/widget/powermenu';
import Verification from '@/widget/powermenu/verification';
import { Gtk } from 'ags/gtk4';
import { exec } from 'ags/process';
import { createState } from 'gnim';
import options from 'options';

export default function powermenu() {
  const [label, setLabel] = createState('');
  const [selected, setSelected] = createState<PowerMenuType>('shutdown');

  const labels: Record<PowerMenuType, string> = {
    hibernate: 'Hibernate',
    shutdown: 'Shutdown',
    logout: 'Log Out',
    reboot: 'Reboot',
    sleep: 'Sleep',
    lockscreen: 'Lock Screen',
  };

  function onClick(btn: PowerMenuType) {
    setLabel(labels[btn]);
    setSelected(btn);
    verification.show();
    powermenu.hide();
  }

  function onAccept() {
    exec(options.powermenu[selected.get()].get());
    verification.hide();
  }

  const verification = Verification({ label, onAccept }) as Gtk.Widget;
  const powermenu = PowerMenu({ onClick }) as Gtk.Widget;

  Object.assign(globalThis, {
    powermenu: onClick,
  });
}

declare global {
  const powermenu: (btn: PowerMenuType) => void;
}
