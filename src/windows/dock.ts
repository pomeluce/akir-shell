import Dock from '@/widget/dock';
import app from 'ags/gtk4/app';
import { themes } from 'options';

export default () => {
  app.get_monitors().map(Dock);
  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-dock', null);
    });
  }
};
