import options from 'options';
import Launcher from './Launcher';
import { PanelKeyType } from './panel';

export default function launcher() {
  const launcher = Launcher();

  Object.assign(globalThis, {
    launcher(panel: PanelKeyType) {
      launcher.show();
      launcher.setPanel(panel);
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
