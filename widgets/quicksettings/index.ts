import { App } from 'astal/gtk3';
import QuickSettings from './QuickSettings';
import options from 'options';

export default function quicksettings() {
  App.get_monitors().map(QuickSettings);

  if (options.theme.hyprland.enable.get()) {
    import('gi://AstalHyprland').then(m => {
      const h = m.default.get_default();
      h.message_async('keyword layerrule noanim,quicksettings', null);
    });
  }
}
