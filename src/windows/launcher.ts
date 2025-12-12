import Launcher from '@/widget/launcher';
import { themes } from 'options';

export default function launcher() {
  const launcher = Launcher();

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-launcher', null);
    });
  }
}
