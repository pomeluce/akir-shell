import Notifications from '@/widget/notifications';
import app from 'ags/gtk4/app';
import { themes } from 'options';

export default function notifications() {
  app.get_monitors().map(Notifications);

  if (themes.hyprland.enable.peek()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,akirds-notifications', null);
    });
  }
}
