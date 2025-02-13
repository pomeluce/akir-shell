import { App } from 'astal/gtk3';
import Dock from './Dock';
import options from 'options';

export default () => {
  App.get_monitors().map(Dock);
  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,dock', null);
    });
  }
};
