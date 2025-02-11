import options from 'options';
import Notifications from './Notifications';
import { App } from 'astal/gtk3';

export default function notifications() {
  App.get_monitors().map(Notifications);

  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,notifications', null);
    });
  }
}
