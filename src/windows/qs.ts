import QuickSettings from '@/widget/qs';
import app from 'ags/gtk4/app';
import { themes } from 'options';

export default () => {
  app.get_monitors().map(QuickSettings);

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-qs', null);
    });
  }
};
