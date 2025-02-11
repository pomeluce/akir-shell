import options from 'options';
import Launcher from './Launcher';

export default function launcher() {
  const launcher = Launcher();

  Object.assign(globalThis, {
    launcher(prefix: string) {
      launcher.show();
      launcher.setText(`:`);
      if (prefix) launcher.setText(`:${prefix} `);
    },
  });

  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,launcher', null);
    });
  }
}

declare global {
  const launcher: (prefix: string) => void;
}
