import DateMenu from '@/widget/datemenu';
import { themes } from 'options';
import app from 'ags/gtk4/app';

export default () => {
  app.get_monitors().map(DateMenu);

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-datemenu', null);
    });
  }
};
