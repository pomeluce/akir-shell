import { EvalCommands } from '@/types/widget';
import Launcher from '@/widget/launcher';
import { PanelKeyType } from '@/widget/launcher/panels';
import { themes } from 'options';

export default function launcher() {
  const launcher = Launcher();

  Object.assign(globalThis, {
    $eval: {
      launcher(panel: PanelKeyType) {
        launcher.setPanel(panel);
        launcher.show();
      },
    },
  });

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-launcher', null);
    });
  }
}

declare global {
  const $eval: EvalCommands;
}
