import { App } from 'astal/gtk3';
import DateMenu from './DateMenu';
import options from 'options';

export default function datemenu() {
  App.get_monitors().map(DateMenu);

  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,datemenu', null);
    });
  }
}
